'use client';

import React, { useEffect, useState } from 'react';
import { VehiclesCardsSkeleton } from './vehicleCards';
import VehicleCards from './vehicleCards';
import Search from './search';
import { getVehicleAllDetails } from '../_actions/saerch_available_vehicle';

const Page = ({ searchParams }) => {
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('auth_token_login') || '';
                const data = await getVehicleAllDetails(buildSearchQuery(searchParams), token);
                setResponse(data);
            } catch (error) {
                console.error('Error fetching data', error);
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        const deStructredQuery = Object.entries(searchParams)
            .map(([key, value]: any) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
        setSearchQuery(deStructredQuery);

    }, [searchParams]);

    const buildSearchQuery = params => {
        const currentDate = new Date();
        const newFromDate = new Date(currentDate);
        newFromDate.setDate(currentDate.getDate());
        const newToDate = new Date(currentDate);
        newToDate.setDate(currentDate.getDate() + 3);

        const longitude = params.longitude !== undefined && params.longitude !== 'undefined' ? params.longitude : '30.271129';
        const latitude = params.latitude !== undefined && params.latitude !== 'undefined' ? params.latitude : '-97.7437';
        const pickupTime = params.pickupTime || '10:00 AM';
        const dropTime = params.dropTime || '9:30 PM';

        const pickupDate = params.pickupDate ? new Date(params.pickupDate).toISOString().slice(0, 10) : newFromDate.toISOString().slice(0, 10);
        const dropDate = params.dropDate ? new Date(params.dropDate).toISOString().slice(0, 10) : newToDate.toISOString().slice(0, 10);

        return {
            lat: longitude,
            lng: latitude,
            startTs: pickupDate,
            endTS: dropDate,
            pickupTime: pickupTime,
            dropTime: dropTime,
            userId: '', // Assuming userId is handled elsewhere or not needed
        };
    };

    let content;
    if (isLoading) {
        content = <VehiclesCardsSkeleton />;
    } else if (error) {
        content = <p className='font-medium text-center text-base pt-28'>Error fetching data.</p>;
    } else if (response && response.length > 0) {
        content = <VehicleCards carDetails={response} searchQuery={searchQuery} />;
    } else {
        content = <p className='font-medium text-center text-base pt-28'>No vehicles are available at the moment.</p>;
    }

    return (
        <>
            <section className='min-h-screen py-10'>
                <div className='md:sticky md:top-16 z-50'>
                    <Search searchQuery={buildSearchQuery(searchParams)} />
                </div>
                {content}
            </section>
        </>
    );
};

export default Page;
