"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import NoAuthStatePage from "./noauth";
import { useEffect, useState } from "react";
import { getAllActiveTripsByUser } from "../_actions/get_active_trips";
import { getAllHistoryTripsByUser } from "../_actions/get_all_history_trips";
import TripsList from "./tripscard";


const UserTrips = () => {

    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [tabselectedindex, settabselectedindex] = useState(0);

    const [TripsResponse, setTripResponses] = useState({});



    console.log("current tab selected=>" + tabselectedindex);


    useEffect(() => {

        const sessionEmail = localStorage.getItem("session_user");
        const session_id = localStorage.getItem("userId");

        if (sessionEmail && session_id) {
            setUserLoggedIn(true);
        }


        const fetchData = async () => {

            try {
                const authToken = localStorage.getItem('auth_token_login');
                const userId = localStorage.getItem('userId');

                if (tabselectedindex == 0) {
                    const data = await getAllActiveTripsByUser(userId, authToken);
                    if (data != null) {
                        setTripResponses(data);
                        console.log(TripsResponse);
                    }
                }

                if (tabselectedindex == 1) {
                    const data = await getAllHistoryTripsByUser(userId, authToken);
                    if (data != null) {
                        setTripResponses(data);
                        console.log(TripsResponse);
                    }
                }

            } catch (error) {
                console.error('Error fetching data', error);
            } finally {
                // set loading state false;
            }
        };

        fetchData();

    }, [tabselectedindex]);



    if (!userLoggedIn) {
        // If the user is not logged in, display NoAuthStatePage
        return <NoAuthStatePage />;
    }

    return (
        <>
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:max-w-full lg:px-8 sm:py-8 lg:py-8">
                <div className="flex justify-between">
                    <div className="flex flex-col mx-4">
                        <h2 className="text-xl font-bold tracking-tight text-neutral-900">
                            Trips
                        </h2>
                        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">All your trips will be listed here. Click individual trips see details section for more information</p>
                    </div>

                    <div className="flex">
                        <Button
                            onClick={() => settabselectedindex(0)}
                            className={`my-4 ${tabselectedindex === 0 ? 'bg-primary text-white' : ''}`}
                            variant="outline"
                        >
                            Current Bookings
                        </Button>
                        <Button
                            onClick={() => settabselectedindex(1)}
                            className={`mt-4 mx-4 ${tabselectedindex === 1 ? 'bg-red-700 text-white' : ''}`}
                            variant="outline"
                        >
                            Previous Booking History
                        </Button>
                    </div>
                </div>
                {tabselectedindex === 0 && (
                    <div className="mt-6 flex flex-wrap gap-x-6 gap-y-10 xl:gap-x-8">
                        <TripsList tripsData={TripsResponse} />
                    </div>
                )}

                {tabselectedindex === 1 && (
                    <div className="mt-6 flex flex-wrap gap-x-6 gap-y-10 xl:gap-x-8">
                        <TripsList tripsData={TripsResponse} />
                    </div>
                )}
            </div>

        </>
    );
};

export default UserTrips;
