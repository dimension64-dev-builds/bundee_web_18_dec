"use client"

import React, { useEffect, useState } from 'react';
import { StarIcon } from '@heroicons/react/20/solid'
import { RadioGroup } from '@headlessui/react'
import { Button } from '@/components/ui/button';
import { getTripDetailsbyId } from '@/app/_actions/trip_details_by_id';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { SelectValue } from '@radix-ui/react-select';
import Nodata from './nodata';
import TripsDetails from './tripcard';
import ConversationDetails from './conversation';
import ChatComponent from './conversation';



interface VehicleDetailsParams {
    tripId: number;
}

export default function SingleVehicleDetails() {

    const [params, setParams] = useState<VehicleDetailsParams>({
        tripId: 0,
    });

    const [tabselectedindex, settabselectedindex] = useState(0);


    const [masterTripData, setMasterTripData] = useState({});


    const [error, setError] = useState(false);

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const authToken = localStorage.getItem('auth_token_login');

                if (tabselectedindex === 0) {
                    const pathSegments = window.location.pathname.split('/');
                    const tripId = pathSegments[pathSegments.length - 1];

                    const data = await getTripDetailsbyId(authToken, tripId);
                    if (data != null) {
                        setMasterTripData(data);
                        console.log(data[0]['tripid']);
                    }
                }

            } catch (error) {
                setError(true)
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [tabselectedindex]);



    return (
        <div className="bg-white">
            <div className="pt-2">
                <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:max-w-7xl lg:px-8">
                    <div className="flex">
                        <Button
                            onClick={() => settabselectedindex(0)}
                            className={`my-4 ${tabselectedindex === 0 ? 'bg-primary text-white' : ''}`}
                            variant="outline"
                        >
                            Trip Details
                        </Button>
                        <Button
                            onClick={() => settabselectedindex(1)}
                            className={`mt-4 mx-4 ${tabselectedindex === 1 ? 'bg-primary text-white' : ''}`}
                            variant="outline"
                        >
                            conversation
                        </Button>
                    </div>
                </div>

                {tabselectedindex == 0 && (
                    <div className="test">
                        {!loading && !error && (
                            <TripsDetails tripsData={masterTripData} />
                        )}
                        {!loading && error && (
                            <Nodata />
                        )}
                    </div>
                )}
                {tabselectedindex == 1 && (
                    <div className="test">
                    <ChatComponent/>
                    </div>
                )}



            </div>
        </div>
    );
}
