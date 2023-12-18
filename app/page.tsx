"use client"

import React, { useEffect, useState } from 'react';
import Available_Locations from '@/components/Available_Locations';
import Banner from '@/components/Banner';
import FAQ from '@/components/FAQ';
import HeroSeaction from '@/components/HeroSeaction';
import { initializeAuthTokens } from './_actions/initilize_auth_token';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import RecentlyViewedComponents from '@/components/recentlyviewed_vehicles';



const LandingPage = () => {
    
    const [emailVerified, setEmailVerified] = useState(false);
    const auth = getAuth();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const res = user.emailVerified;
                setEmailVerified(res);
                console.log("email verified status " + res);
                localStorage.setItem("email_veirfy_status", res.toString());
            }
        });
    }, [auth]);

    useEffect(() => {
        const fetchTokens = async () => {
            try {
                const response = await initializeAuthTokens();
                localStorage.setItem("bundee_auth_token", response.token);
            } catch (error) {
                console.error("Error initializing tokens:", error);
            }
        };
        fetchTokens();
    }, []);



    return (
        <>
            <HeroSeaction />
            <Available_Locations />
            {/* <hr className='my-6 border-neutral-200 md:my-10' /> */}
            <RecentlyViewedComponents />
            {/* <hr className='my-6 border-neutral-200 md:my-10' /> */}
            <Banner />
            {/* <hr className='my-6 border-neutral-200 md:my-10' /> */}
            <FAQ />
        </>
    );
};

export default LandingPage;
