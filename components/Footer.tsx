import React from 'react';
import { Button } from './ui/button';

const Footer = () => {
    return (
        <>
            <footer className='bg-primary/5 mt-auto'>
                <div className='max-w-7xl px-6 py-12 mx-auto'>
                    <div className='md:flex md:-mx-3 md:items-center md:justify-between'>
                        <h1 className='text-xl font-semibold tracking-tight text-gray-800 md:mx-3 xl:text-2xl '>Get the best riding experience with Bundee</h1>
                        <div className='mt-6 md:mx-3 shrink-0 md:mt-0 md:w-auto'>
                            <Button className='bg-foreground text-white'>
                                Explore Vechiles
                                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className='w-5 h-5 ml-4'>
                                    <path strokeLinecap='round' strokeLinejoin='round' d='M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3' />
                                </svg>
                            </Button>
                        </div>
                    </div>
                    <hr className='my-6 border-gray-200 md:my-10 ' />

                    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                        <div>
                            <p className='font-semibold text-gray-800 '>Bundee</p>

                            <div className='flex flex-col items-start mt-5 space-y-2'>
                                <a href='#' className='text-gray-600 transition-colors duration-300   hover:no-underline hover:text-primary'>
                                    Home
                                </a>
                                <a href='#' className='text-gray-600 transition-colors duration-300   hover:no-underline hover:text-primary'>
                                    About Us
                                </a>
                                <a href='#' className='text-gray-600 transition-colors duration-300   hover:no-underline hover:text-primary'>
                                    Policies
                                </a>
                            </div>
                        </div>

                        <div>
                            <p className='font-semibold text-gray-800 '>Locations</p>

                            <div className='flex flex-col items-start mt-5 space-y-2'>
                                <a href='#' className='text-gray-600 transition-colors duration-300   hover:no-underline hover:text-primary'>
                                    Dallas, Texas
                                </a>

                                <a href='#' className='text-gray-600 transition-colors duration-300   hover:no-underline hover:text-primary'>
                                    Austin, Texas
                                </a>
                                <a href='#' className='text-gray-600 transition-colors duration-300   hover:no-underline hover:text-primary'>
                                    Huston, Texas
                                </a>
                            </div>
                        </div>

                        <div>
                            <p className='font-semibold text-gray-800 '>Experiences</p>

                            <div className='flex flex-col items-start mt-5 space-y-2'>
                                <a href='#' className='text-gray-600 transition-colors duration-300   hover:no-underline hover:text-primary'>
                                    Book a car
                                </a>
                                <a href='#' className='text-gray-600 transition-colors duration-300   hover:no-underline hover:text-primary'>
                                    Become an host
                                </a>

                                <a href='#' className='text-gray-600 transition-colors duration-300   hover:no-underline hover:text-primary'>
                                    Insurance & Protection
                                </a>
                            </div>
                        </div>

                        <div>
                            <p className='font-semibold text-gray-800 '>Contact Us</p>

                            <div className='flex flex-col items-start mt-5 space-y-2'>
                                <a href='#' className='text-gray-600 transition-colors duration-300   hover:no-underline hover:text-primary'>
                                    +01 529 613
                                </a>
                                <a href='#' className='text-gray-600 transition-colors duration-300   hover:no-underline hover:text-primary'>
                                    suport@mybundee.com
                                </a>
                            </div>
                        </div>
                    </div>
                    <hr className='my-6 border-gray-200 md:my-10 ' />
                    <div className='flex flex-col items-center justify-between sm:flex-row'>
                        <a href='#'>
                            <img className='w-auto h-10' src='./bundee-logo.png' alt='' />
                        </a>

                        <p className='mt-4 text-sm text-gray-500 sm:mt-0 '>© Copyright 2023. MyBundee All Rights Reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
