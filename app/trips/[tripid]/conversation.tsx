import { getTripChatHistory } from "@/app/_actions/get_message_history";
import { sendMessageToHost } from "@/app/_actions/send_messages";
import { auth } from "@/app/auth/firebase";
import React, { useState, useRef, useEffect } from "react";

export default function ConversationDetails({ }) {

    const [token, setToken] = useState('');
    const [tripId, setTripId] = useState(null);
    const [inputMessage, setInputMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [messageList, setMessageList] = useState([]);

    const senderImage = "https://media.istockphoto.com/id/1458688223/photo/tracking-shot-happy-farmer-talking-on-mobile-phone-while-carrying-basket-of-vegetables-at.webp?b=1&s=170667a&w=0&k=20&c=Wt4VQZSjbPbcNByLJleqJPnXil27mS0QKyg1FgufP20=";
    const hostImage = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D";

    const chatWindowRef = useRef(null);

    async function handleSendMessage() {

        const data = await sendMessageToHost(tripId, inputMessage, token);
        if (data.success) {
            console.log("message sent successfylly");
        }
        setInputMessage("");
        const context = await getTripChatHistory(tripId, token);
        if (data != null) {
            setMessageList(context.reverse());
        }
    }

    useEffect(() => {


        const fetchChatHistory = async (tripId, token) => {
            try {
                const data = await getTripChatHistory(tripId, token);
                if (data != null) {
                    setMessageList(data.reverse());
                }
            } catch (error) {
                console.error('Error fetching chat history:', error);
            } finally {
                setLoading(false);
            }
        };

        const getIdTokenFromFirebase = async () => {
            if (auth.currentUser) {
                try {
                    const idToken = await auth.currentUser.getIdToken();
                    setToken(idToken);
                    return idToken;
                } catch (error) {
                    console.error('Error retrieving token:', error);
                    alert("Something went wrong, Reload the page and try again");
                }
            } else {
                alert("You are not logged in");
            }
        };

        const initializeChat = async () => {
            const pathSegments = window.location.pathname.split('/');
            const foundTripId = pathSegments[pathSegments.length - 1];

            if (foundTripId) {
                setTripId(foundTripId);
                const token = await getIdTokenFromFirebase();
                if (token) {
                    await fetchChatHistory(foundTripId, token);
                }
            }
        };
        setInterval(() => {
            initializeChat();
        }, 5000);
    }, []); // Empty dependency array ensures this runs once on component mount


    function getIdTokenFromFirebase() {
        const user = auth.currentUser;
        if (user) {
            user.getIdToken().then((idToken) => {
                setToken(idToken);
                console.log("token generated successfully", token);
            }).catch((error) => {
                console.error('Error retrieving token:', error);
                alert("Something went wrong, Reload the page and try again")
            });
        } else {
            alert("You are not logged in");
        }
    }

    return (
        <div className="mb-4 mt-4 h-[600px] flex bg-white shadow-2xl rounded-2xl mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:max-w-7xl">
            <div className="w-full flex flex-col space-y-4">
                <div className="flex-1 overflow-y-auto" ref={chatWindowRef}>
                    {messageList.map((message, index) => (
                        <div
                            key={index} // It's better to have a unique key, consider using a message ID if available
                            className={`${["CLIENT"].includes(message.author) ? "flex justify-end items-center" : "flex justify-start items-center"}`}
                        >
                            {["system"].includes(message.author) && (
                                <img
                                    src={senderImage || "/default-sender-image.jpg"} // Default image if senderImage is not available
                                    alt="Sender's image"
                                    className="w-8 h-8 rounded-full mr-2"
                                />
                            )}
                            <div
                                className={`${["User", "Driver"].includes(message.author) ? "bg-blue-100 text-black self-end mt-4" : "bg-gray-100 text-black mt-4"} p-2 rounded-lg`}
                            >
                                <p>{message.message}</p>
                                <p className="text-xs text-gray-500">{new Date(message.deliveryDate).toLocaleString()}</p>
                            </div>
                            {["User", "Driver"].includes(message.author) && (
                                <img
                                    src={hostImage || "/default-host-image.jpg"} // Default image if hostImage is not available
                                    alt="Host's image"
                                    className="w-8 h-8 rounded-full ml-2"
                                />
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring focus:border-blue-500"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300 ease-in-out"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
