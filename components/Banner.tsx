"use client"

import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';

const Banner = () => {
    return (
        <>
            {/* <div className='bg-white'>
                <div className='mx-auto max-w-7xl py-10 sm:py-16 lg:py-20'>
                    <div className=' flex flex-col md:flex-row md:justify-between md:items-center overflow-hidden bg-primary/10 px-6 pt-16  sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0'>
                        <div className='mx-auto max-w-md md:text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left'>
                            <h1 className='text-3xl font-bold tracking-tight text-foreground sm:text-6xl'>Ride like a local</h1>
                            <p className='mt-6 text-md leading-6 text-foreground/70'>Step into the world of Bundee, where you can discover a diverse range of vehicles tailored to your interests. Embark on a journey to explore and experience your dream destinations.</p>
                            <div className='mt-10 flex items-center md:justify-center gap-x-6 lg:justify-start'>
                                <Button className='bg-foreground hover:bg-foreground/80'>Explore Now</Button>
                                <Link href='#' className='text-sm font-semibold leading-6 text-foreground underline-offset-2 underline'>
                                    Download the mobile app
                                </Link>
                            </div>
                        </div>
                        <img className=' w-[80%] sm:w-[50%] h-[50%] max-w-none rounded-md bg-white/5 ring-1 ring-white/10' src='./banner-circle.png' alt='App screenshot' width={1824} height={1080} />
                    </div>
                </div>
            </div> */}

            <section className=' 2xl:py-24 px-6 pt-16 bg-white '>
                <div className='px-4 mx-auto overflow-hidden bg-primary/10 rounded-lg sm:rounded-3xl max-w-7xl sm:px-6 lg:px-8'>
                    <div className='py-10 sm:py-16 lg:py-24 2xl:pl-24'>
                        <div className='grid items-center grid-cols-1 gap-y-12 lg:grid-cols-2 lg:gap-x-8 2xl:gap-x-20'>
                            <div>
                                <h2 className='text-3xl font-bold leading-tight  sm:text-4xl lg:text-5xl lg:leading-tight'>Ride like a local</h2>
                                <p className='mt-4 text-base '>Step into the world of Bundee, where you can discover a diverse range of vehicles tailored to your interests. Embark on a journey to explore and experience your dream destinations.</p>

                                <div className='flex flex-row items-center mt-8 space-x-4 lg:mt-12'>
                                    <Button className='bg-foreground hover:bg-foreground/80'>Explore Now</Button>
                                    <Link href='#' className='text-sm font-semibold leading-6 text-foreground underline-offset-2 underline'>
                                        Download the mobile app
                                    </Link>
                                </div>
                            </div>

                            <div className='relative '>
                                <img className='relative w-full max-w-lg mx-auto  ' src='./banner-circle.png' alt='App screenshot' />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Banner;
