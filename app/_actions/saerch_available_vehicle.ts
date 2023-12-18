"use server"

export const getVehicleAllDetails = async (searchQuery: any, token: string) => {
    console.log(searchQuery);
    console.log(token);

    const url = `${process.env.BUNDEE_SEARCH_API_URL}`;
    let accessToken = token || process.env.FALLBACK_BUNDEE_AUTH_TOKEN;

    const headersList = {
        Accept: '*/*',
        bundee_auth_token: accessToken,
        'Content-Type': 'application/json',
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(searchQuery),
            headers: headersList,
            cache: 'no-cache',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('data.vehicleAllDetails :', data.vehicleAllDetails);
        return data.vehicleAllDetails;
    } catch (error) {
        console.error('Error fetching data of vehicleAllDetails :', error);
        throw new Error('An error occurred while fetching data.');
    }
};
