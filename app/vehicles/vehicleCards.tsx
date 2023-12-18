import Link from 'next/link';
import React from 'react';

const VehicleCards = ({ carDetails, searchQuery }: any) => {
    return (
        <div>
            <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8 sm:py-12 '>
                <div className='flex justify-between'>
                    <h2 className='text-xl font-bold tracking-tight text-neutral-900'>Available Cars</h2>
                    <p className='font-medium text-sm'>
                        {carDetails.length} vehicles available in {carDetails[0].cityname}, {carDetails[0].state}.
                    </p>
                </div>
                <div className='mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3  xl:gap-x-8'>
                    {carDetails.map(car => (
                        <Link href={`/vehicles/${car.id}?${searchQuery}`} className='group relative cursor-pointer bg-white border-neutral-200 border rounded-md select-none' key={car.id}>
                            <div className='aspect-video w-full overflow-hidden rounded-t-md bg-neutral-200 lg:aspect-video group-hover:opacity-75 lg:h-44'>{car.imageresponse[0]?.imagename ? <img src={car.imageresponse[0].imagename} alt={car.make} className='h-full w-full object-cover group-hover:scale-110 transition-all ease-in-out object-center lg:h-full lg:w-full' /> : <img src='./image_not_available.png' alt='image_not_found' className='h-full w-full object-cover scale-75  object-center lg:h-full lg:w-full' />}</div>
                            <div className='p-3 flex justify-between items-center gap-3'>
                                <div className='space-y-1'>
                                    <p className='text-sm text-neutral-900 p-0 font-bold select-text'>
                                        {car.make} {car.model} {car.year}
                                    </p>

                                    <div className='flex items-center gap-1'>
                                        <p className='text-xs font-medium text-neutral-900 '>{car.rating}</p>

                                        <svg className='w-4 h-4 text-yellow-300 mr-2' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 22 22'>
                                            <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
                                        </svg>
                                        <p className='text-xs font-medium text-neutral-900 '>({car.tripcount} Trips)</p>
                                    </div>

                                    <div className='flex gap-1'>
                                        <svg className='w-4 h-4 text-orange-500 inline-block -ml-1' viewBox='0 0 384 512' fill='currentColor'>
                                            <path d='M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z' />
                                        </svg>
                                        <p className='text-xs font-medium  '>
                                            {car.cityname}, {car.state}
                                        </p>
                                    </div>
                                </div>
                                <p className='text-base font-medium text-neutral-900'>${car.price_per_hr}/Day</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VehicleCards;

const shimmer = `relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-black/10 before:to-transparent`;

function VehicleCardSkeleton() {
    return (
        <div className='col-span-4 space-y-4 lg:col-span-1'>
            <div className={`relative h-[167px] rounded-xl bg-neutral-400 ${shimmer}`} />

            <div className='h-4 w-full rounded-lg bg-neutral-400' />
            <div className='h-6 w-1/3 rounded-lg bg-neutral-400' />
        </div>
    );
}

export function VehiclesCardsSkeleton() {
    return (
        <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8 sm:py-12'>
            <div className='my-3 space-y-3'>
                <div className={`h-8 w-1/3 rounded-lg bg-neutral-400 ${shimmer}`} />
                <div className={`h-4 w-1/2 rounded-lg bg-neutral-400 ${shimmer}`} />
            </div>

            <div className='mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3  xl:gap-x-8'>
                <VehicleCardSkeleton />
                <VehicleCardSkeleton />
                <VehicleCardSkeleton />
                <VehicleCardSkeleton />
                <VehicleCardSkeleton />
            </div>
        </div>
    );
}
