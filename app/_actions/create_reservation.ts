// Assuming 'use server' is a valid directive in your project environment
"use server"

export const createNewUser = async (body:any, bundee_auth_token: string) => {

    const url = "http://4.240.86.202:8002/api/v1/booking/createReservation";

    const headersList = {
        Accept: '*/*',
        'bundee_auth_token': bundee_auth_token,
        'Content-Type': 'application/json',
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headersList,
            body: JSON.stringify(body),
            cache: 'no-cache',
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return data;

    } catch (error) {
        console.error('Error creating resservation', error);
        throw new Error(error);
    }
};
