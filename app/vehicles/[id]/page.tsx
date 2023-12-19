'use client';

import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogDemo } from '@/components/ui/popup';
import { getVehicleAllDetailsByVechicleId } from '@/app/_actions/get_vehicle_details_by_vehicle_id';
import Carousel from '@/components/ui/carousel/carousel';
import Link from 'next/link';
import { dateFormatter } from '@/lib/dateFormatter';
import { AlignRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { addHours, addMinutes, parse, differenceInDays } from 'date-fns';
import { getDeductionDetails } from '@/app/_actions/get_deduction_details';
import { RecentlyViewedVehicles, Vehicle } from '@/lib/local_recently_viewed';
import { useQueryState } from 'next-usequerystate';

export default function SingleVehicleDetails({ params }: { params: { id: string } }) {
    const [vehicleDetails, setvehicleDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [vehicleImages, setVehicleImages] = useState([]);
    const [vehicleHostDetails, setVehicleHostDetails] = useState(null);
    const [reserverList, setReserverList] = useState(null);

    const currentDate = new Date();

    const startDate = new Date(currentDate);

    startDate.setDate(currentDate.getDate());

    const endDate = new Date(currentDate);
    endDate.setDate(currentDate.getDate() + 3);

    const [pickupDate, setPickupDate] = useQueryState('pickupDate', { defaultValue: startDate.toString() });
    const [dropDate, setDropDate] = useQueryState('dropDate', { defaultValue: endDate.toString() });

    const [pickupTime, setPickupTime] = useQueryState('pickupTime', { defaultValue: '10:00 AM' });
    const [dropTime, setDropTime] = useQueryState('dropTime', { defaultValue: '9:30 PM' });

    const [authPercentage, setAuthPercentage] = useState<number>(0);

    const times = [];
    for (let hour = 10; hour <= 21; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            if (!(hour === 22 && minute === 30)) {
                const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
                const formattedMinute = minute === 0 ? '00' : minute;
                const period = hour < 12 ? 'AM' : 'PM';

                const time = `${formattedHour}:${formattedMinute} ${period}`;
                times.push(time);
            }
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('auth_token_login') || '';
                const data = await getVehicleAllDetailsByVechicleId({ vehicleid: params.id }, token);
                setvehicleDetails(data.vehicleAllDetails?.[0] || null);
                setVehicleImages(data.vehicleAllDetails?.[0]?.imageresponse || null);
                setVehicleHostDetails(data.vehicleHostDetails?.[0] || null);
                setReserverList(data.reserverList?.[0] || null);

                if (vehicleDetails && vehicleImages.length > 0) {
                    localSessionStorageHandler(vehicleDetails, vehicleImages);
                }

                if (vehicleHostDetails != null) {
                    const authPercentage = await getDeductionDetails(vehicleDetails.id, vehicleHostDetails.hostid, token);
                    console.log('auth % got from API ' + authPercentage);
                    if (authPercentage) {
                        setAuthPercentage(authPercentage);
                    }
                }
            } catch (error) {
                console.error('Error fetching data', error);
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        if (!pickupDate) {
            setPickupDate(startDate.toString());
        }
        console.log(startDate);

        fetchData();
    }, [params]);

    function calculateTimeDifference() {
        const startDate = new Date(pickupDate);
        const endDate = new Date(dropDate);

        // Set time to 00:00:00 for both dates
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        // Calculate the time difference in days
        const timeDifferenceInDays = differenceInDays(endDate, startDate);

        return timeDifferenceInDays + 1;
    }

    function totalAmount() {
        const timeDifferenceInDays = calculateTimeDifference();
        const amount = timeDifferenceInDays * vehicleDetails.price_per_hr;
        return amount;
    }

    function calTaxes() {
        const amount = totalAmount();
        const tax = amount * 0.082;
        return tax.toFixed(2);
    }

    function grandTotalAmount() {
        const amount = totalAmount();
        const tax = calTaxes();
        const total = Number(amount) + Number(tax);
        return total;
    }

    function localSessionStorageHandler(vehicleDetails: any, vehicleImageResponse: any) {
        const vehicle: Vehicle = {
            vehicleId: vehicleDetails.id ?? params.id,
            make: vehicleDetails.make,
            model: vehicleDetails.model,
            year: vehicleDetails.year,
            image: vehicleImageResponse[0].imagename,
            price: vehicleDetails.price_per_hr,
            tripCount: vehicleDetails.tripcount,
        };

        RecentlyViewedVehicles.addVehicle(vehicle);
        console.log('data added to the secure storage.');
    }

    function profileVerifiedStatus(): boolean {
        const isVerified = true;
        return isVerified;
    }

    function toLocalISOString(dateString) {
        var date = new Date(dateString);
        var localOffset = date.getTimezoneOffset() * 60000;
        var localTime = new Date(date.getTime() - localOffset);
        return localTime.toISOString().slice(0, -1);
    }

    function requestToCheckOutHandler(make:any, model:any, year:any, image:any, vehicleId:any) {
        const userid = localStorage.getItem('userId');
        // alert(userid);
    
        const vehicleName = make + " " + model + " " + year;
        const vehicleImage = image;
    
        if (userid != null && userid != '') {  // Corrected condition
    
            if (profileVerifiedStatus()) {

                // alert(pickupDate);
                // alert(dropDate);

                const vehicleId = vehicleDetails.id;
                // const formattedStartDate = encodeURIComponent(pickupDate.toString());
                // const formattedEndDate = encodeURIComponent(dropDate.toString());
                
                
                localStorage.setItem('checkOutInfo', JSON.stringify({
                    vehicleId: vehicleDetails.id,
                    startDate: toLocalISOString(pickupDate),
                    endDate: toLocalISOString(dropDate),
                    price: vehicleDetails.price_per_hr,
                    name: vehicleName,
                    image: vehicleImage,
                }));
    
                window.location.href = `/checkout/${vehicleId}?${pickupDate}?${dropDate}?${pickupTime}?${dropTime}?${vehicleDetails.price_per_hr}`;
    
                // console.log({ formattedStartDate, formattedEndDate });
            } else {
                alert('Your profile is not verified, please verify and checkout');
            }
        } else {
            localStorage.setItem('authCallbackSuccessUrl', `/vehicles/${vehicleId}`);
            window.location.href = '/auth/login';

        }
    }
    

    return (
        <div className='px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-2'>
            <div className='pt-6'>
                <nav aria-label='Breadcrumb' className='w-full lg:min-w-[80rem]'>
                    <div role='list' className='mr-auto flex items-center'>
                        <div>
                            <div className='flex items-center'>
                                <Link href='/' className='mr-2 text-sm font-medium text-neutral-900'>
                                    Home
                                </Link>
                                <svg width={16} height={20} viewBox='0 0 16 20' fill='currentColor' aria-hidden='true' className='h-5 w-4 text-neutral-300'>
                                    <path d='M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z' />
                                </svg>
                            </div>
                        </div>

                        <div>
                            <div className='flex items-center'>
                                <Link href={`/vehicles?`} className='mr-2 text-sm font-medium text-neutral-900'>
                                    Available Vehicles
                                </Link>
                                <svg width={16} height={20} viewBox='0 0 16 20' fill='currentColor' aria-hidden='true' className='h-5 w-4 text-neutral-300'>
                                    <path d='M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z' />
                                </svg>
                            </div>
                        </div>

                        {vehicleDetails ? (
                            <div className='text-sm'>
                                <Link href={`/vehicles/${params.id}`} aria-current='page' className='font-medium text-neutral-500 hover:text-neutral-600'>
                                    {vehicleDetails.make} {vehicleDetails.model} {vehicleDetails.year}
                                </Link>
                            </div>
                        ) : (
                            <div className='flex items-center justify-center'>....</div>
                        )}
                    </div>
                </nav>

                {vehicleDetails ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 mt-3 md:mt-6'>
                        <div className='flex-col flex lg:col-span-2'>
                            <div className='sm:overflow-hidden rounded-lg '>
                                <Carousel autoSlide={false}>
                                    {vehicleImages.map((s, i) => (
                                        <img key={i} src={s.imagename} className='max-h-fit min-w-full' alt={`vehicle image ${i}`} />
                                    ))}
                                </Carousel>
                            </div>

                            <div className='space-y-4 mt-6'>
                                <h1 className='text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl'>
                                    {vehicleDetails.make} {vehicleDetails.model} {vehicleDetails.year}
                                </h1>
                                {/* <span className='text-xs'>{vehicleDetails.vin}</span> */}
                                <p className='text-base text-neutral-700 max-w-3xl'>{vehicleDetails.desciption}</p>

                                <div className='grid '>
                                    <h3 className='text-sm font-medium text-neutral-900'>Highlights</h3>

                                    <div className='mt-4'>
                                        <ul role='list' className='list-disc space-y-2 pl-4 text-sm'>
                                            {vehicleDetails.manufacturename && vehicleDetails.manufacturename !== 'Not Applicable' && vehicleDetails.manufacturename !== 'NA' && <li className='text-neutral-600'>{vehicleDetails.manufacturename}</li>}
                                            {vehicleDetails.trim && vehicleDetails.trim !== 'Not Applicable' && vehicleDetails.trim !== 'NA' && <li className='text-neutral-600'>{vehicleDetails.trim}</li>}
                                            {vehicleDetails.vehicleType && vehicleDetails.vehicleType !== 'Not Applicable' && vehicleDetails.vehicleType !== 'NA' && <li className='text-neutral-600'>{vehicleDetails.vehicleType}</li>}
                                            {vehicleDetails.bodyclass && vehicleDetails.bodyclass !== 'Not Applicable' && vehicleDetails.bodyclass !== 'NA' && <li className='text-neutral-600'>{vehicleDetails.bodyclass}</li>}
                                            {vehicleDetails.doors && vehicleDetails.doors !== 'Not Applicable' && vehicleDetails.doors !== 'NA' && <li className='text-neutral-600'>{vehicleDetails.doors} Doors</li>}
                                            {vehicleDetails.fueltypeprimary && vehicleDetails.fueltypeprimary !== 'Not Applicable' && vehicleDetails.fueltypeprimary !== 'NA' && <li className='text-neutral-600'>{vehicleDetails.fueltypeprimary}</li>}
                                            {vehicleDetails.drivetype && vehicleDetails.drivetype !== 'Not Applicable' && vehicleDetails.drivetype !== 'NA' && <li className='text-neutral-600'>{vehicleDetails.drivetype}</li>}
                                            {vehicleDetails.wlectrificationlevel && vehicleDetails.wlectrificationlevel !== 'Not Applicable' && vehicleDetails.wlectrificationlevel !== 'NA' && <li className='text-neutral-600'>{vehicleDetails.wlectrificationlevel}</li>}
                                            {vehicleDetails.seatingCapacity && vehicleDetails.seatingCapacity !== 'Not Applicable' && vehicleDetails.seatingCapacity !== 'NA' && <li className='text-neutral-600'>{vehicleDetails.seatingCapacity} Seats</li>}
                                        </ul>
                                    </div>
                                </div>

                                <div className=' flex flex-col gap-2'>
                                    <h2 className='text-sm font-medium text-neutral-900'>Hosted By</h2>

                                    <div className='relative  flex items-center gap-x-4'>
                                        <img src={`data:image/png;base64, ${vehicleHostDetails.userimage}`} alt={vehicleHostDetails.firstname} className='h-14 w-14 rounded-full bg-neutral-50' />
                                        <div className='text-sm leading-6'>
                                            <Link href='' className='font-semibold text-neutral-900'>
                                                {vehicleHostDetails.firstname} {vehicleHostDetails.lastname}
                                            </Link>
                                            <p className='text-neutral-600'>Joined on {dateFormatter(vehicleHostDetails.createddate)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='mt-4 lg:row-span-3 lg:mt-0'>
                            <h2 className='sr-only'>Product information</h2>
                            <p className='text-3xl font-bold tracking-tight text-neutral-900'>{`$${vehicleDetails.price_per_hr} / day`}</p>
                            {/* Reviews */}

                            {reserverList?.rating && (
                                <div className='mt-6'>
                                    <div className='flex items-center'>
                                        <div className='flex items-center'>
                                            <Star className='h-5 w-5 text-neutral-900' fill='currentColor' />
                                            <span className='ml-2'>{reserverList.rating.toFixed(1)}</span>
                                        </div>
                                        <p className='ml-3 text-sm font-medium text-primary hover:text-primary'>({reserverList.tripcount} trips)</p>
                                    </div>
                                </div>
                            )}

                            <div className='mt-10'>
                                <div className='flex flex-col gap-1 w-full flex-2'>
                                    <label className='text-xs font-medium'>Trip Start Date & End Date</label>
                                    <DialogDemo vehicleid={params.id} setParentError={setError} setPickupDate={setPickupDate} setDropDate={setDropDate} pickupDate={pickupDate} dropDate={dropDate} />
                                </div>

                                <div className='flex mt-4'>
                                    <div className='flex flex-col gap-1 w-full flex-2'>
                                        <label className='text-xs font-medium'>Trip Start Time</label>
                                        <Select
                                            onValueChange={time => {
                                                setPickupTime(time);
                                            }}
                                            defaultValue={pickupTime}>
                                            <SelectTrigger className='w-full  '>
                                                <SelectValue placeholder='Select start time' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {times.map(time => (
                                                    <SelectItem key={time} value={time} className='cursor-pointer'>
                                                        {time}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className='ml-4 flex flex-col gap-1 w-full flex-2'>
                                        <label className='text-xs font-medium'>Trip End Time</label>
                                        <Select
                                            onValueChange={time => {
                                                setDropTime(time);
                                            }}
                                            defaultValue={dropTime}>
                                            <SelectTrigger className='w-full  '>
                                                <SelectValue placeholder='Select end time' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {times.map(time => (
                                                    <SelectItem key={time} value={time} className='cursor-pointer'>
                                                        {time}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className='mt-10'>
                                    <div className='flex items-center justify-between'>
                                        <h3 className='text-sm font-medium text-neutral-900'>Total : $ {error ? 0 : grandTotalAmount()}</h3>
                                    </div>
                                    <div className='mt-4'>
                                        {!error && (
                                            <ul role='list' className='list-disc space-y-2 pl-4 text-sm'>
                                                <li className='text-neutral-600'>
                                                    Total Rent Charge ${vehicleDetails.price_per_hr} X {calculateTimeDifference()} days = ${totalAmount()}
                                                </li>x
                                                <li className='text-neutral-600'>Taxes 8.2% equals $ {calTaxes()}</li>
                                                <li className='text-neutral-600'>Authorization Charges : {authPercentage || 20}%</li>
                                            </ul>
                                        )}
                                    </div>

                                    <div className='mt-4'>
                                        <ul role='list' className='list-disc space-y-2 pl-4 text-sm'>
                                            <span className='text-neutral-600'>You will not be charged untill the host accept the resarvation request.</span>
                                        </ul>
                                    </div>

                                    {/* <div className='mt-4'>
                                        <span className='inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10'>Free Cancellation till 3rd jan 2024</span>
                                    </div> */}
                                </div>

                                <Button
                                    type='submit'
                                    className='mt-10 flex w-full'
                                    disabled={!!error}
                                    onClick={() => requestToCheckOutHandler(vehicleDetails.make, vehicleDetails.model, vehicleDetails.year, vehicleImages[0].imagename, vehicleDetails.id)}>
                                    Request to checkout
                                </Button>

                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='text-center mt-10 py-12 md:py-20'>{isLoading ? <p>Loading...</p> : <p>Error: Failed to fetch vehicle details.</p>}</div>
                )}
            </div>
        </div>
    );
}
