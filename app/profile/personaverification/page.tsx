"use client"

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { callApi } from '../../_actions/personaupdateapi';

// Dynamically import the Persona component with SSR disabled
const PersonaInquiry = dynamic(
    () => import('persona').then((mod) => mod.Inquiry),
    { ssr: false }
);

const InlineInquiry = () => {
    const [userID, setUserID] = useState('');

    useEffect(() => {
        const storedUserID = localStorage.getItem('userId');
        if (storedUserID) {
            setUserID(storedUserID);
        }
    }, []);

    const handleComplete = async ({ inquiryId, status }) => {
        if (status === 'completed') {
            try {
                await callApi(inquiryId, userID);
                window.location.href = '/profile';
            } catch (e) {
                console.error("Error in handleComplete:", e);
            }
        }
    };

    return (
        <div className='h-screen flex justify-center' style={{ width: '100%' }}>
            <PersonaInquiry
                templateId='itmpl_oFwr5vDFxPnJVnpKmXpgxY5x'
                environmentId='env_3gPXHtfowwicvW8eh5GdW9PV'
                onLoad={() => console.log('Loaded inline')}
                onComplete={handleComplete}
            />
        </div>
    );
};

export default InlineInquiry;
