// Assuming 'use server' is a valid directive in your project environment
"use server"

export const updateExistUser = async (body:any, bundee_auth_token: string) => {
    const url = "http://4.240.86.202:8080/api/v1/user/updateUser";

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
        console.log(data)
        return { 
            errorcode: data.errorCode, 
            errorMessage:data.errorMessage
        
         };

    } catch (error) {
        console.error('Error Creating new user:', error);
        throw new Error('Error Creating new user');
    }
};
