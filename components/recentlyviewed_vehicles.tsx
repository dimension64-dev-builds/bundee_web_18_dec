"use client"


import Link from 'next/link';
import { Button } from './ui/button';
import { getAllRecentlyViewedVehicles } from '@/app/_actions/recently_viewed_vehice';
import { useEffect, useState } from 'react';
import { RecentlyViewedVehicles, Vehicle } from '@/lib/local_recently_viewed';

const RecentlyViewedComponents = () => {

    const [recentlyViewedData, setRecentlyViewedData] = useState([]);
    const [recentlyViewedSession, setRecentlyViewedSession] = useState<Vehicle[]>([]);
    const [userloggedIn, setUserLoggedin] = useState(false);
    const [isDataPresentInAPI, SetisDataPresentInAPI] = useState(false);
    const [isDataPresentInSession, SetisDataPresentInSession] = useState(false);

    function handleClearRecentlyViewedVehicles() {
        // calling an api to clear the recently viewed all data. 
    }

    function handleClearRecentlyViewedVehiclesFromSession(){
        RecentlyViewedVehicles.clearVehicles();
        window.location.reload();
    }


    useEffect(() => {

        const id = localStorage.getItem("userId");
        const auth_token = localStorage.getItem("auth_token_login");


        console.log("getting data from session");
        console.log({ id, auth_token });


        console.log("getting recently viewed data");


        const fetchData = async () => {
            try {
                const data = await getAllRecentlyViewedVehicles(id, auth_token);
                console.log(data);
                setRecentlyViewedData(data);
                if(data.length > 0){
                    console.log("data is present");
                    SetisDataPresentInAPI(true);
                }else{
                    console.log("data not there");
                }

            } catch (error) {
                console.error('Error fetching data', error);
            } finally {
                // set loading state false;
                console.log("finally");
            }
        };

        if (id && auth_token) {
            setUserLoggedin(true);
            console.log("Valid utoken and userid");
            console.log({ id, auth_token });
            fetchData();
        } else {
            setUserLoggedin(false);
            console.log("user is not logged in , so fetching the recently viewed data form the cache")
            // get the data from session storage and display it. 
            const recentlyViewed = RecentlyViewedVehicles.getVehicles();
            console.log(recentlyViewed);
            if(recentlyViewed.length > 0){
                SetisDataPresentInSession(true);
            }
            setRecentlyViewedSession(recentlyViewed);
        }

    }, []);


    return (
        <>

            {( userloggedIn && isDataPresentInAPI ) &&  (
                <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8 sm:py-12 '>
                    <div className='flex justify-between'>
                        <h2 className='text-xl font-bold tracking-tight text-neutral-900'>Recently Viewed</h2>
                        <Button onClick={handleClearRecentlyViewedVehicles} variant='secondary'>Clear All</Button>
                    </div>

                    <div className='mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
                        {recentlyViewedData.map(car => (
                            <div className='group relative cursor-pointer' key={car.id}>
                                <div className='aspect-video w-full overflow-hidden rounded-md bg-neutral-200 lg:aspect-video group-hover:opacity-75 lg:h-44'>
                                    <img src={car.imageresponse[0].imagename} alt='' className='h-full w-full object-cover group-hover:scale-110 transition-all ease-in-out object-center lg:h-full lg:w-full' />
                                </div>
                                <div className='mt-3 flex justify-between items-center'>
                                    <div>
                                        <Link href='/' className='text-sm text-neutral-900 p-0 font-bold'>
                                            {`${car.make} ${car.model} ${car.year}`}
                                        </Link>


                                        <div className='flex items-center gap-2'>
                                            <p className='text-xs font-medium text-neutral-900 '>{car.rating}</p>
                                            <svg className='w-4 h-4 text-yellow-300' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 22 22'>
                                                <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
                                            </svg>

                                            <p className='text-xs font-medium text-neutral-900  '>({car.tripCount} Trips)</p>
                                        </div>
                                    </div>
                                    <p className='text-xs font-medium text-neutral-900'>${car.vehiclePrice}/Day</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {( ( userloggedIn == false ) && isDataPresentInSession ) && (
                <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8 sm:py-12 '>
                    <div className='flex justify-between'>
                        <h2 className='text-xl font-bold tracking-tight text-neutral-900'>Recently Viewed</h2>
                        <Button onClick={handleClearRecentlyViewedVehiclesFromSession} variant='secondary'>Clear All</Button>
                    </div>

                    <div className='mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
                        {recentlyViewedSession.map(car => (
                            <div className='group relative cursor-pointer' key={car.image}>
                                <div className='aspect-video w-full overflow-hidden rounded-md bg-neutral-200 lg:aspect-video group-hover:opacity-75 lg:h-44'>
                                    <img src={car.image} alt='' className='h-full w-full object-cover group-hover:scale-110 transition-all ease-in-out object-center lg:h-full lg:w-full' />
                                </div>
                                <div className='mt-3 flex justify-between items-center'>
                                    <div>
                                        <Link href='/' className='text-sm text-neutral-900 p-0 font-bold'>
                                            {`${car.make} ${car.model} ${car.year}`}
                                        </Link>


                                        <div className='flex items-center gap-2'>
                                            <p className='text-xs font-medium text-neutral-900 '>{car.tripCount}</p>
                                            <svg className='w-4 h-4 text-yellow-300' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 22 22'>
                                                <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
                                            </svg>

                                            <p className='text-xs font-medium text-neutral-900  '>({car.tripCount} Trips)</p>
                                        </div>
                                    </div>
                                    <p className='text-xs font-medium text-neutral-900'>${car.price}/Day</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default RecentlyViewedComponents;
