"use client"

import React from 'react';

const FAQ = () => {
    return (
        <div>
            <section className='py-10 bg-white text-foreground sm:py-16 lg:py-20'>
                <div className='max-w-7xl px-4 mx-auto sm:px-6 lg:px-8'>
                    <div className='max-w-2xl mx-auto text-center'>
                        <h2 className='text-3xl font-bold leading-tight  sm:text-4xl lg:text-5xl'>FAQ's</h2>
                        <p className='max-w-xl mx-auto mt-4 text-base leading-relaxed text-neutral-400'>Explore the common questions and answers about Celebration</p>
                        
                    </div>

                    <div className='grid grid-cols-1 mt-12 md:mt-20 md:grid-cols-2 gap-y-16 gap-x-20'>
                        <div className='flex items-start'>
                            <div className='flex items-center justify-center flex-shrink-0 w-8 h-8 bg-neutral-700 rounded-full'>
                                <span className='text-lg font-semibold text-white '>?</span>
                            </div>
                            <div className='ml-4'>
                                <p className='text-xl font-semibold '>How to create an account?</p>
                                <p className='mt-4 text-base text-neutral-400'>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.</p>
                            </div>
                        </div>

                        <div className='flex items-start'>
                            <div className='flex items-center justify-center flex-shrink-0 w-8 h-8 bg-neutral-700 rounded-full'>
                                <span className='text-lg font-semibold text-white '>?</span>
                            </div>
                            <div className='ml-4'>
                                <p className='text-xl font-semibold '>How can I make payment?</p>
                                <p className='mt-4 text-base text-neutral-400'>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.</p>
                            </div>
                        </div>

                        <div className='flex items-start'>
                            <div className='flex items-center justify-center flex-shrink-0 w-8 h-8 bg-neutral-700 rounded-full'>
                                <span className='text-lg font-semibold text-white '>?</span>
                            </div>
                            <div className='ml-4'>
                                <p className='text-xl font-semibold '>Do you provide discounts?</p>
                                <p className='mt-4 text-base text-neutral-400'>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.</p>
                            </div>
                        </div>

                        <div className='flex items-start'>
                            <div className='flex items-center justify-center flex-shrink-0 w-8 h-8 bg-neutral-700 rounded-full'>
                                <span className='text-lg font-semibold text-white '>?</span>
                            </div>
                            <div className='ml-4'>
                                <p className='text-xl font-semibold '>How do you provide support?</p>
                                <p className='mt-4 text-base text-neutral-400'>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FAQ;
