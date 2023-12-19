"use client"

import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import NoData from './nodata';
import TripsDetails from './tripcard';
import ChatComponent from './conversation';
import { getTripDetailsbyId } from '@/app/_actions/trip_details_by_id';

export default function SingleVehicleDetails() {
    const [tabSelectedIndex, setTabSelectedIndex] = useState(0);
    const [masterTripData, setMasterTripData] = useState({});
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchTripDetails = useCallback(async () => {
        try {
            setLoading(true);
            const authToken = localStorage.getItem('auth_token_login');
            const pathSegments = window.location.pathname.split('/');
            const tripId = pathSegments[pathSegments.length - 1];

            const data = await getTripDetailsbyId(authToken, tripId);
            if (data) {
                setMasterTripData(data);
            } else {
                throw new Error('No data received');
            }
        } catch (error) {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (tabSelectedIndex === 0) {
            fetchTripDetails();
        }
    }, [tabSelectedIndex, fetchTripDetails]);

    const renderTabContent = () => {
        if (tabSelectedIndex === 0) {
            return !loading && (!error ? <TripsDetails tripsData={masterTripData} /> : <NoData />);
        } else if (tabSelectedIndex === 1) {
            return <ChatComponent />;
        }
    };

    const renderButton = (index, text) => (
        <Button
            onClick={() => setTabSelectedIndex(index)}
            className={`my-4 mx-4 ${tabSelectedIndex === index ? 'bg-primary text-white' : ''}`}
            variant="outline"
        >
            {text}
        </Button>
    );

    return (
        <div className="bg-white">
            <div className="pt-2">
                <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:max-w-7xl lg:px-8">
                    <div className="flex">
                        {renderButton(0, 'Trip Details')}
                        {renderButton(1, 'Conversation')}
                    </div>
                </div>
                <div className="test">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
}
