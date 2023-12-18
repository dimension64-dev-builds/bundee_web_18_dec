"use client"

import Link from 'next/link';
import React from 'react';


const locations = [
    {
        id: 1,
        location: 'Austin, Texas',
        disabled: false,
        button_text: 'Search Now',
        imageUrl: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        link: '/vehicles?city=Austin,%20Texas,%20United%20States&latitude=-97.7437&longitude=30.271129'
    },
    {
        id: 2,
        location: 'Dalas, Texas',
        disabled: false,
        button_text: 'Search Now',
        imageUrl: 'https://images.pexels.com/photos/2579705/pexels-photo-2579705.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        link: '/vehicles?city=Dallas,%20Texas,%20United%20States&latitude=-96.796856&longitude=32.776272'
    },
    {
        id: 3,
        location: 'Huston,Texas',
        disabled: false,
        button_text: 'Search Now',
        imageUrl: 'https://images.pexels.com/photos/773471/pexels-photo-773471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        link: '/vehicles?city=Houston,%20Texas,%20United%20States&latitude=-95.367697&longitude=29.758938'
    },
    {
        id: 4,
        location: 'San Antonio',
        disabled: true,
        button_text: 'Comming Soon',
        imageUrl: 'https://images.pexels.com/photos/1209978/pexels-photo-1209978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        link: '/vehicles?city=San%20Antonio,%20Texas,%20United%20States&latitude=-98.495141&longitude=29.4246'
    },
];

const Available_Locations = () => {

    return (
        <>
            <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8 w-full'>
                <div className='flex justify-between'>
                    <h2 className='text-xl font-bold tracking-tight text-neutral-900'>Currently Servicable Locations</h2>
                </div>

                <div className='mt-6 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
                    {locations.map(location => (
                        <Link href={location.link} className='group relative cursor-pointer' key={location.id}>
                            <div className='aspect-video w-full overflow-hidden rounded-md bg-neutral-200 lg:aspect-square h-44'>
                                <img src={location.imageUrl} alt={location.location} className='h-full w-full object-cover group-hover:scale-110 group-hover:opacity-80 transition-all ease-in-out object-center lg:h-full lg:w-full' />
                                <div className='absolute inset-x-0 top-0 flex h-full items-end justify-end overflow-hidden rounded-lg p-4'>
                                    <div className='w-full flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center opacity-100 '>
                                        <p className='bg-black p-2 rounded-sm text-white'>{location.location}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Available_Locations;