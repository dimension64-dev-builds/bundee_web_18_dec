'use client';
import React, { useEffect, useState } from 'react';
import { createBrowserHistory } from 'history';// Import useHistory from React Router
import Persona from 'persona';
import { callApi } from '../../_actions/personaupdateapi';
import { useRouter } from 'next/navigation';


const InlineInquiry = () => {

    const router = useRouter();

    const [id, setUserID] = useState("");

    useEffect(() => {
      
        const data = localStorage.getItem('userId');
        if(data){
            setUserID(data);
        }
       
  
    }, []);

    const divStyle = {
        width: '100%', 
    };

    const handleComplete = async ({ inquiryId, status, fields }) => {
        try {
            if (status === 'completed') {
                await callApi(inquiryId, id);
                router.push('/profile'); 
              
            }
        } catch (e) {
            console.error("Error in handleComplete:", e);
            throw Error(e);
        }
    };

    return (
        <div className='h-screen flex justify-center' style={divStyle}>
            <Persona.Inquiry
                templateId='itmpl_oFwr5vDFxPnJVnpKmXpgxY5x'
                environmentId='env_3gPXHtfowwicvW8eh5GdW9PV'
                onLoad={() => {
                    console.log('Loaded inline');
                }}
                onComplete={handleComplete}
            />
        </div>
    );
};

export default InlineInquiry;
