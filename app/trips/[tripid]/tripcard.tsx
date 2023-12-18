import { useEffect, useState } from 'react';
import Carousel from '@/components/ui/carousel/carousel';
import { getAvailabilityDatesByVehicleId } from '@/app/_actions/get_availability_dates_by_vehicle_id';
import { Button } from '@/components/ui/button';

import { differenceInCalendarDays, format, isWithinInterval } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { getVehicleAllDetailsByVechicleId } from '@/app/_actions/get_vehicle_details_by_vehicle_id';
import { CalendarIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import { swapRequest } from '@/app/_actions/swap_request';
import { reservationCancel } from '@/app/_actions/reservation_cancel';

const TripsDetails = ({ tripsData }) => {
    const [modifyCalenderOpen, setModifyCalenderOpen] = useState(false);

    const [swapRequestedModalOpen, setSwapRequestedModalOpen] = useState(false);
    const [swapRequestDetails, setSwapRequestDetails] = useState(null);
    const [swapDataLoading, setSwaopDataLoading] = useState(false);

    const [TripCancellationModalOpen, setTripCancellationModalOpen] = useState(false);

    const [vehicleDetails, setvehicleDetails] = useState(null);
    const [vehicleImages, setVehicleImages] = useState(null);
    const [comments, setComments] = useState('');
    const [vehicleId, setVehicleId] = useState(0);

    const [vehicleUnavailableDates, setVehicleUnavailableDates] = useState([]);
    const [error, setError] = useState('');
    const [isMobile, setIsMobile] = useState(false);

    const [vehiclePrice, setVehiclePrice] = useState(0);

    const [modifyNoDays, setModifyNodays] = useState(0);

    // const [a, sa] = useState();

    const [startdate, setStartDate] = useState();

    const [sm, setsm] = useState({
        from: undefined,
        to: undefined,
    });

    useEffect(() => {
        console.log('tripdata', tripsData);

        setSwapRequestDetails(tripsData[0].swapDetails[0]);

        const initlizeVehicleId = () => {
            setVehiclePrice(tripsData[0].vehicleDetails[0].price_per_hr);
            const st = tripsData[0].starttime;
            const et = tripsData[0].endtime;
            setStartDate(st);
            setsm({ from: new Date(st), to: new Date(et) });
        };

        initlizeVehicleId();
    }, []);

    if (!Array.isArray(tripsData) || tripsData.length === 0) {
        return <div>No trips available.</div>;
    }

    function handleCancelTrip() {
        setTripCancellationModalOpen(true);
    }

    const handleAvailabilityCalender = vehicleId => {
        setVehicleId(vehicleId);
        // setDate({
        //     from: undefined,
        //     to: undefined,
        // });
        setError('Please pick a Start day.');

        const fetchData = async () => {
            try {
                console.log(vehicleId);
                const token = localStorage.getItem('auth_token_login') || '';
                const data = await getAvailabilityDatesByVehicleId({ vehicleid: vehicleId }, token);
                setVehicleUnavailableDates(convertDates(data.unAvailabilityDate));
            } catch (error) {
                console.error('Error fetching Availability dates', error);
                setError('Error fetching Availability dates');
            }
        };

        const VehicleId = tripsData[0].vehicleDetails[0].id;
        setVehicleId(VehicleId);

        fetchData();
        console.log('start date' + tripsData[0].starttime);
        const st = tripsData[0].starttime;
        const et = tripsData[0].endtime;
        setStartDate(st);
        setsm({ from: new Date(st), to: new Date(et) });
        const body = document.querySelector('body');
        body.style.overflow = 'hidden';
        setModifyCalenderOpen(true);
    };

    const handleDateSelect = newDate => {
        let newError = '';
        const originalStartDate = new Date(tripsData[0].starttime);
        const originalEndDate = new Date(tripsData[0].endtime);

        setsm(newDate);

        if (newDate?.from) {
            if (!newDate.to) {
                newError = 'Please pick an End day.';
            } else if (newDate.to) {
                const fromDate = newDate.from.toISOString() || '';
                const toDate = newDate.to.toISOString() || '';

                if (fromDate === toDate) {
                    newError = 'Start date and End date cannot be the same.';
                } else {
                    const newStartDate = new Date(newDate.from);
                    const newEndDate = new Date(newDate.to);
                    if (!((originalStartDate >= newStartDate && originalStartDate <= newEndDate) || (originalEndDate >= newStartDate && originalEndDate <= newEndDate) || (originalStartDate <= newStartDate && originalEndDate >= newEndDate) || (originalStartDate <= newEndDate && originalEndDate >= newEndDate))) {
                        newError = 'Invalid date range. Please ensure that at least one of the original start or end dates is within the new date range.';
                    } else {
                        // Check if the selected date range overlaps with unavailable dates
                        if (isDateRangeUnavailable(fromDate, toDate, vehicleUnavailableDates)) {
                            newError = 'Selected date range overlaps with unavailable dates.';
                        } else {
                            console.log('dates are available');
                            const newDiff = differenceInCalendarDays(newDate.to, newDate.from);
                            const originalDiff = differenceInCalendarDays(originalEndDate, originalStartDate);
                            const modifiedDiff = newDiff - originalDiff;
                            if (modifiedDiff == 0) {
                                newError = 'Please select different dates';
                            } else {
                                setModifyNodays(modifiedDiff);
                            }
                        }
                    }
                }
            }
        } else {
            newError = 'Please pick a Start day.';
        }
        setError(newError);
    };

    const closeModifyDialog = () => {
        setsm(sm);
        setModifyCalenderOpen(false);
        const body = document.querySelector('body');
        body.style.overflow = 'auto';
    };

    const closeSwapDialog = () => {
        setSwapRequestedModalOpen(false);
    };

    const closeCancelDialog = () => {
        setTripCancellationModalOpen(false);
    };

    const reduction = async () => {};

    const extension = () => {};

    async function handleSwap() {
        setSwaopDataLoading(true);
        const fetchData = async () => {
            try {
                setSwapRequestedModalOpen(true);
                const token = localStorage.getItem('auth_token_login') || '';
                const id: any = swapRequestDetails.toVehicleId;
                const data = await getVehicleAllDetailsByVechicleId({ vehicleid: id }, token);
                setvehicleDetails(data.vehicleAllDetails?.[0]);
                setVehicleImages(data.vehicleAllDetails?.[0]?.imageresponse);
            } catch (error) {
                console.error('Error fetching vehicle data data', error);
                setError(error);
            } finally {
                setSwaopDataLoading(false);
            }
        };

        fetchData();
    }

    function TripCancellationByUser() {
        // console.log(first)
        const cancelTrip = async () => {
            try {
                const token = localStorage.getItem('auth_token_login') || '';
                const tripId = tripsData[0].tripid;
                console.log('tripId', tripId);
                const data = await reservationCancel(tripId, token);
                console.log('cancel trip response', data);
                if (data.errorCode == 0) {
                    setTripCancellationModalOpen(false);
                    window.location.reload();
                }
            } catch (error) {
                console.error('Error cencelling the trip', error);
            } finally {
            }
        };

        cancelTrip();
    }

    const handleSwapAcceptOrReject = async statuscode => {
        const data = {
            tripId: swapRequestDetails.tripId,
            userId: swapRequestDetails.userId,
            hostID: swapRequestDetails.hostId,
            statusCode: statuscode,
            toVehicleid: swapRequestDetails.toVehicleId,
            fromVehicleId: swapRequestDetails.fromVehicleId,
            message: 'NA',
        };

        try {
            const token = localStorage.getItem('auth_token_login') || '';
            const response = await swapRequest(data, token);
            window.location.replace('/trips');
        } catch (error) {
            console.error('Error updating the swap Request', error);
            setError(error);
        } finally {
            setSwapRequestedModalOpen(false);
        }
    };

    const calFreeCancellationDate = () => {
        const freeCancellationDate = new Date(tripsData[0].starttime);
        freeCancellationDate.setDate(freeCancellationDate.getDate() - Number(tripsData[0].cancellationDays));
        return freeCancellationDate;
    };

    return (
        <>
            {tripsData ? (
                <div className='px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-2'>
                    {tripsData.map((item, index) => (
                        <div key={index} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 mt-3 md:mt-6'>
                            <div className='flex-col flex lg:col-span-2'>
                                <div className='sm:overflow-hidden rounded-lg '>
                                    <Carousel autoSlide={true}>
                                        {item.vehicleImages.map((s, i) => (
                                            <img key={i} src={s.imagename} className='max-h-fit min-w-full' alt={`vehicle image ${i}`} />
                                        ))}
                                    </Carousel>
                                </div>

                                <div className='space-y-4 mt-6'>
                                    <h1 className='text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl'>
                                        {item.vehmake} {item.vehmodel} {item.vehyear}
                                    </h1>
                                    {/* <span className='text-xs'>{vehicleDetails.vin}</span> */}
                                    <p className='text-base text-neutral-700 max-w-3xl'>{item.vehicleDetails[0].desciption}</p>

                                    <div className='grid '>
                                        <h3 className='text-sm font-medium text-neutral-900'>Highlights</h3>

                                        <div className='mt-4'>
                                            <ul role='list' className='list-disc space-y-2 pl-4 text-sm'>
                                                {item.vehicleDetails[0].manufacturename && item.vehicleDetails[0].manufacturename !== 'Not Applicable' && item.vehicleDetails[0].manufacturename !== 'NA' && <li className='text-neutral-600'>{item.vehicleDetails[0].manufacturename}</li>}
                                                {item.vehicleDetails[0].trim && item.vehicleDetails[0].trim !== 'Not Applicable' && item.vehicleDetails[0].trim !== 'NA' && <li className='text-neutral-600'>{item.vehicleDetails[0].trim}</li>}
                                                {item.vehicleDetails[0].vehicleType && item.vehicleDetails[0].vehicleType !== 'Not Applicable' && item.vehicleDetails[0].vehicleType !== 'NA' && <li className='text-neutral-600'>{item.vehicleDetails[0].vehicleType}</li>}
                                                {item.vehicleDetails[0].bodyclass && item.vehicleDetails[0].bodyclass !== 'Not Applicable' && item.vehicleDetails[0].bodyclass !== 'NA' && <li className='text-neutral-600'>{item.vehicleDetails[0].bodyclass}</li>}
                                                {item.vehicleDetails[0].doors && item.vehicleDetails[0].doors !== 'Not Applicable' && item.vehicleDetails[0].doors !== 'NA' && <li className='text-neutral-600'>{item.vehicleDetails[0].doors} Doors</li>}
                                                {item.vehicleDetails[0].fueltypeprimary && item.vehicleDetails[0].fueltypeprimary !== 'Not Applicable' && item.vehicleDetails[0].fueltypeprimary !== 'NA' && <li className='text-neutral-600'>{item.vehicleDetails[0].fueltypeprimary}</li>}
                                                {item.vehicleDetails[0].drivetype && item.vehicleDetails[0].drivetype !== 'Not Applicable' && item.vehicleDetails[0].drivetype !== 'NA' && <li className='text-neutral-600'>{item.vehicleDetails[0].drivetype}</li>}
                                                {item.vehicleDetails[0].wlectrificationlevel && item.vehicleDetails[0].wlectrificationlevel !== 'Not Applicable' && item.vehicleDetails[0].wlectrificationlevel !== 'NA' && <li className='text-neutral-600'>{item.vehicleDetails[0].wlectrificationlevel}</li>}
                                                {item.vehicleDetails[0].seatingCapacity && item.vehicleDetails[0].seatingCapacity !== 'Not Applicable' && item.vehicleDetails[0].seatingCapacity !== 'NA' && <li className='text-neutral-600'>{item.vehicleDetails[0].seatingCapacity} Seats</li>}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className='mt-10'>
                                        <div className='space-y-6'>
                                            <label className='font-bold'>Parking Details</label>
                                            <p className='text-base text-gray-900'>{item.vehicleDetails[0].parkingDetails}</p>
                                        </div>
                                    </div>

                                    <div className='mt-10'>
                                        <div className='space-y-6'>
                                            <label className='font-bold'> Additional GuideLines</label>
                                            <p className='text-base text-gray-900'>{item.vehicleDetails[0].guideLines}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='mt-4 lg:row-span-3 lg:mt-0'>
                                <div className='flex flex-col gap-3'>
                                    <p className='text-3xl font-bold tracking-tight text-neutral-900'>{`$${item.vehicleDetails[0].price_per_hr} / day`}</p>
                                    <p className='text-base text-gray-900'>${item.tripPaymentTokens[0].totalamount} Total</p>

                                    <p className='font-bold'>
                                        No of Days : <span className='text-base text-gray-900'>{item.tripPaymentTokens[0].totaldays}</span>
                                    </p>
                                </div>

                                <div className='mt-10 flex flex-col gap-4'>
                                    <div className=' flex justify-between'>
                                        <label className='font-bold'>Trip Start Date</label>
                                        <p className='text-base text-gray-600'>{format(new Date(item.starttime), 'PPP')}</p>
                                    </div>
                                    <div className=' flex justify-between'>
                                        <label className='font-bold'>Trip End Date</label>
                                        <p className='text-base text-gray-600'>{format(new Date(item.endtime), 'PPP')}</p>
                                    </div>
                                    <div className=' flex justify-between'>
                                        <label className='font-bold'>Trip Status</label>
                                        <span className={`text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:text-red-300 ${item.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900' : item.status === 'Requested' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900' : item.status === 'Started' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900' : 'bg-red-100 text-red-800 dark:bg-red-900'}`}>{item.status}</span>
                                    </div>

                                    {swapRequestDetails && (
                                        <div className='mt-4 flex justify-between'>
                                            <label className='font-bold'>Swap Status</label>
                                            <div>
                                                {swapRequestDetails?.statuscode.toLowerCase() === 'swappr' && <span className='mx-4 inline-flex items-center rounded-md bg-yellow-50 px-1 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20'> Swap Praposal Requested</span>}

                                                {swapRequestDetails?.statuscode.toLowerCase() === 'swaprej' && <span className='mx-4 inline-flex items-center rounded-md bg-red-50 px-1 py-1 text-xs font-medium text-red-800 ring-1 ring-inset ring-red-600/20'> Swap Praposal Requested</span>}

                                                {swapRequestDetails?.statuscode.toLowerCase() === 'swapacc' && <span className='mx-4 inline-flex items-center rounded-md bg-green-50 px-1 py-1 text-xs font-medium text-green-800 ring-1 ring-inset ring-green-600/20'> Swap Praposal Approved</span>}
                                            </div>
                                            <div className=''>
                                                {swapRequestDetails?.statuscode.toLowerCase() === 'swappr' && (
                                                    <Button onClick={handleSwap} variant='outline' className='bg-white p-1 border border-gray-200'>
                                                        See Details
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {item.status.toLowerCase() === 'requested' && (
                                        <div className='mt-4'>
                                            <span className='inline-flex items-center rounded-md bg-red-50 px-2 py-3 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10'>
                                                Free Cancellation till <b className='ml-2'> {format(calFreeCancellationDate(), 'PPP')}</b>
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {item.status.toLowerCase() === 'approved' || item.status.toLowerCase() === 'started' || item.status.toLowerCase() === 'requested' ? (
                                    <div className='mt-10 flex'>
                                        <button onClick={() => handleAvailabilityCalender(item.vehicleid)} className='mt-4 flex w-full items-center justify-center rounded-md border border-transparent bg-black px-8 py-3 text-base font-medium text-white '>
                                            Modify
                                        </button>
                                        <button onClick={handleCancelTrip} className='mt-4 ml-4 flex w-full items-center justify-center rounded-md border border-transparent bg-red-400 px-8 py-3 text-base font-medium text-white'>
                                            Cancel
                                        </button>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='text-center mt-10 py-12 md:py-20'>{<p>Loading trip details...</p>}</div>
            )}

            {modifyCalenderOpen && (
                <div>
                    <div className='fixed inset-0 z-40 flex items-end bg-black bg-opacity-20 sm:items-center sm:justify-center appear-done enter-done backdrop-blur-[4px]'>
                        <div className='w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg sm:rounded-lg sm:m-4 md:max-w-3xl md:p-7 appear-done enter-done' role='dialog'>
                            <div data-focus-guard={true} tabIndex={0} style={{ width: '1px', height: '0px', padding: '0px', overflow: 'hidden', position: 'fixed', top: '1px', left: '1px' }}></div>
                            <div data-focus-guard={true} tabIndex={1} style={{ width: '1px', height: '0px', padding: '0px', overflow: 'hidden', position: 'fixed', top: '1px', left: '1px' }}></div>
                            <div data-focus-lock-disabled='false'>
                                <header className='flex justify-between gap-2'>
                                    <div>
                                        {error ? (
                                            <span className='text-red-500 mt-4'>{error}</span>
                                        ) : (
                                            <div className=''>
                                                <span>
                                                    <span className='font-bold'>Modified Trip </span>
                                                    {sm?.from && sm?.to ? `${format(sm?.from, 'LLL dd, y')} - ${format(sm?.to, 'LLL dd, y')}` : 'Dates not selected'}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <Button variant='ghost' className='inline-flex items-center justify-center p-2 text-neutral-600' aria-label='close' onClick={closeModifyDialog}>
                                        <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20' role='img' aria-hidden='true'>
                                            <path d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' clipRule='evenodd' fillRule='evenodd'></path>
                                        </svg>
                                    </Button>
                                </header>
                                <div className='flex justify-center w-full'>
                                    <Calendar
                                        initialFocus
                                        mode='range'
                                        defaultMonth={new Date(startdate)}
                                        selected={sm}
                                        onSelect={handleDateSelect}
                                        numberOfMonths={isMobile ? 1 : 3}
                                        disabled={date => {
                                            const yesterdate = new Date();
                                            yesterdate.setDate(yesterdate.getDate() - 1);
                                            return vehicleUnavailableDates.includes(date.toISOString().split('T')[0]) || date < yesterdate;
                                        }}
                                    />
                                </div>
                                <div className='sm:col-span-2 mt-4 mb-4'>
                                    <label htmlFor='address1' className='block text-xs font-medium leading-6 text-gray-900'>
                                        Write a message to the host. ( Optional )
                                    </label>
                                    <div className='mt-2'>
                                        <Input
                                            type='text'
                                            onChange={e => {
                                                setComments(e.target.value);
                                            }}
                                            value={comments}
                                            name='address1'
                                            id='address1'
                                            autoComplete='family-name'
                                            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2'
                                        />
                                    </div>
                                </div>
                                {!error && (
                                    <div>
                                        {modifyNoDays >= 0 ? (
                                            <div>
                                                <div className='sm:col-span-2 mt-4 mb-4'>
                                                    <label htmlFor='address1' className='block text-xs font-medium leading-6 text-gray-900'>
                                                        Selected Days
                                                    </label>
                                                    <p className='text-xs'>{modifyNoDays}</p>
                                                </div>

                                                <div className='sm:col-span-2 mt-4 mb-4'>
                                                    <label htmlFor='address1' className='block text-xs font-medium leading-6 text-gray-900'>
                                                        Payment Information
                                                    </label>
                                                    <p className='text-xs'> $ {vehiclePrice * modifyNoDays} in Total</p>
                                                    <p className='text-xs'> $ {(vehiclePrice * modifyNoDays * 0.0825).toFixed(2)} Taxes will apply</p>
                                                    <p className='text-xs'>Authorization of 20% will be applied</p>
                                                </div>

                                                <footer className='flex items-center justify-end   gap-4 select-none'>
                                                    <Button type='button' onClick={closeModifyDialog} variant='outline'>
                                                        Cancel
                                                    </Button>
                                                    <Button type='button' onClick={extension} className={`bg-primary ${error ? 'cursor-not-allowed opacity-50' : ''}`} disabled={!!error}>
                                                        Continue to checkout
                                                    </Button>
                                                </footer>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className='sm:col-span-2 mt-4 mb-4'>
                                                    <label htmlFor='address1' className='block text-xs font-medium leading-6 text-gray-900'>
                                                        Todays Number of Days Reduced : <span className='text-xs'>{Math.abs(modifyNoDays)}</span>
                                                    </label>
                                                </div>

                                                <footer className='flex items-center justify-end   gap-4 select-none'>
                                                    <Button type='button' onClick={closeModifyDialog} variant='outline'>
                                                        Cancel
                                                    </Button>
                                                    <Button type='button' onClick={reduction} className={`bg-primary ${error ? 'cursor-not-allowed opacity-50' : ''}`} disabled={!!error}>
                                                        Continue
                                                    </Button>
                                                </footer>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div data-focus-guard='true' tabIndex={0} style={{ width: '1px', height: '0px', padding: '0px', overflow: 'hidden', position: 'fixed', top: '1px', left: '1px' }}></div>
                        </div>
                    </div>
                </div>
            )}

            {swapRequestedModalOpen && (
                <div>
                    <div className='fixed inset-0 z-40 flex items-end bg-black bg-opacity-20 sm:items-center sm:justify-center appear-done enter-done backdrop-blur-[4px]'>
                        <div className='w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg sm:rounded-lg sm:m-4 md:max-w-xl md:p-7 appear-done enter-done' role='dialog'>
                            <div data-focus-guard={true} tabIndex={0} style={{ width: '1px', height: '0px', padding: '0px', overflow: 'hidden', position: 'fixed', top: '1px', left: '1px' }}></div>
                            <div data-focus-guard={true} tabIndex={1} style={{ width: '1px', height: '0px', padding: '0px', overflow: 'hidden', position: 'fixed', top: '1px', left: '1px' }}></div>
                            <div data-focus-lock-disabled='false'>
                                <div className='flex flex-col gap-3'>
                                    <header className='flex justify-between gap-2'>
                                        <div>
                                            <h1>Swap Request Proposal from Host</h1>
                                        </div>

                                        <Button variant='ghost' className='inline-flex items-center justify-center p-2 text-neutral-600' aria-label='close' onClick={closeSwapDialog}>
                                            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20' role='img' aria-hidden='true'>
                                                <path d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' clipRule='evenodd' fillRule='evenodd'></path>
                                            </svg>
                                        </Button>
                                    </header>

                                    {!swapDataLoading ? (
                                        <div className='flex flex-col gap-3'>
                                            <div className=' mb-4'>
                                                <p className='font-medium text-sm'>Message from host</p>

                                                <div className='mt-1 bg-primary/10 p-4 rounded-3xl rounded-tl-none'>
                                                    <p className='text-xs text-black'>{swapRequestDetails.message}</p>
                                                </div>
                                            </div>

                                            <div className=' border rounded-sm '>
                                                <div className='group relative cursor-pointer bg-white border-neutral-200 border rounded-md select-none'>
                                                    <Carousel autoSlide={false}>
                                                        {vehicleImages.map((s, i) => (
                                                            <img key={i} src={s.imagename} className='max-h-fit' alt={`vehicle image ${i}`} />
                                                        ))}
                                                    </Carousel>
                                                    <div className='p-3 flex justify-between items-center gap-3'>
                                                        <div className='space-y-1'>
                                                            <p className='text-sm text-neutral-900 p-0 font-bold select-text '>
                                                                {vehicleDetails.make} {vehicleDetails.model} {vehicleDetails.year}
                                                            </p>

                                                            <div className='flex items-center gap-1'>
                                                                <p className='text-xs font-medium text-neutral-900 '>{vehicleDetails.rating}</p>

                                                                <svg className='w-4 h-4 text-yellow-300 mr-2' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 22 22'>
                                                                    <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
                                                                </svg>
                                                                <p className='text-xs font-medium text-neutral-900 '>({vehicleDetails.tripcount} Trips)</p>
                                                            </div>

                                                            <div className='flex gap-1'>
                                                                <svg className='w-4 h-4 text-orange-500 inline-block -ml-1' viewBox='0 0 384 512' fill='currentColor'>
                                                                    <path d='M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z' />
                                                                </svg>
                                                                <p className='text-xs font-medium  '>
                                                                    {vehicleDetails.cityname}, {vehicleDetails.state}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {/* <p className='text-base font-medium text-neutral-900'>${vehicleDetails.price_per_hr}/Day</p> */}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='flex gap-2 flex-col'>
                                                <p className='font-medium text-sm'>Pickup & Return </p>

                                                <div className='w-full inline-flex items-center  whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-input bg-transparent shadow-sm  hover:text-accent-foreground h-9 px-4 py-2'>
                                                    <CalendarIcon className='mr-2 h-4 w-4' />
                                                    {error ? (
                                                        <span className='text-red-500'>{error}</span>
                                                    ) : (
                                                        <span>
                                                            {format(sm.from, 'LLL dd, y')} - {format(sm.to, 'LLL dd, y')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className=' mt-4 relative flex gap-x-3'>
                                                <div className='text-sm leading-6'>
                                                    <p className='text-gray-500'>
                                                        Terms and conditions applied.
                                                        <span>
                                                            <Link className='ml-1 underline' href='/privacy'>
                                                                Read More About Policy
                                                            </Link>
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>

                                            <footer className='flex items-center justify-end  gap-4  mt-4 '>
                                                <Button
                                                    variant='outline'
                                                    onClick={() => {
                                                        handleSwapAcceptOrReject('SWAPREJ');
                                                    }}>
                                                    No, Reject
                                                </Button>
                                                <Button
                                                    type='button'
                                                    onClick={() => {
                                                        handleSwapAcceptOrReject('SWAPACC');
                                                    }}
                                                    disabled={!!error}>
                                                    Yes, Accept
                                                </Button>
                                            </footer>
                                        </div>
                                    ) : (
                                        <p className='py-6 text-center font-bold text-base'>Swap details Loading...</p>
                                    )}
                                </div>
                            </div>
                            <div data-focus-guard='true' tabIndex={0} style={{ width: '1px', height: '0px', padding: '0px', overflow: 'hidden', position: 'fixed', top: '1px', left: '1px' }}></div>
                        </div>
                    </div>
                </div>
            )}

            {TripCancellationModalOpen && (
                <div>
                    <div className='fixed inset-0 z-40 flex items-end bg-black bg-opacity-20 sm:items-center sm:justify-center appear-done enter-done backdrop-blur-[4px]'>
                        <div className='w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg sm:rounded-lg sm:m-4 md:max-w-3xl md:p-7 appear-done enter-done' role='dialog'>
                            <div data-focus-guard={true} tabIndex={0} style={{ width: '1px', height: '0px', padding: '0px', overflow: 'hidden', position: 'fixed', top: '1px', left: '1px' }}></div>
                            <div data-focus-guard={true} tabIndex={1} style={{ width: '1px', height: '0px', padding: '0px', overflow: 'hidden', position: 'fixed', top: '1px', left: '1px' }}></div>
                            <div data-focus-lock-disabled='false'>
                                <header className='flex justify-between gap-2'>
                                    <div>
                                        <h1>Cancel Request</h1>
                                    </div>

                                    <Button variant='ghost' className='inline-flex items-center justify-center p-2 text-neutral-600' aria-label='close' onClick={closeCancelDialog}>
                                        <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20' role='img' aria-hidden='true'>
                                            <path d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' clipRule='evenodd' fillRule='evenodd'></path>
                                        </svg>
                                    </Button>
                                </header>
                                <div className='flex justify-center w-full'></div>
                                <div className='sm:col-span-2 mt-4 mb-4'>
                                    <label htmlFor='address1' className='block text-md font-bold  leading-6 text-gray-900'>
                                        Are you sure, You would like to cancel this Trip ?
                                    </label>
                                </div>

                                <footer className='flex items-center justify-end gap-3  '>
                                    <Button type='button' onClick={closeCancelDialog} variant='outline'>
                                        Back to Trip
                                    </Button>
                                    <Button type='button' onClick={TripCancellationByUser} variant='destructive'>
                                        Yes, Cancel
                                    </Button>
                                </footer>
                            </div>
                            <div data-focus-guard='true' tabIndex={0} style={{ width: '1px', height: '0px', padding: '0px', overflow: 'hidden', position: 'fixed', top: '1px', left: '1px' }}></div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TripsDetails;

function convertDates(unAvailabilityDate: string[]): string[] {
    const result: string[] = [];

    for (const dateStr of unAvailabilityDate) {
        const currentDate = new Date(dateStr);
        currentDate.setDate(currentDate.getDate()); // Subtract one day

        const formattedDate = currentDate.toISOString().split('T')[0];
        result.push(formattedDate);
    }

    return result;
}

function isDateRangeUnavailable(from: string, to: string, unavailableDates: string[]): boolean {
    const startDate = new Date(from);
    const endDate = new Date(to);

    for (const unavailableDateStr of unavailableDates) {
        const unavailableDate = new Date(unavailableDateStr);
        if (startDate <= unavailableDate && unavailableDate <= endDate) {
            return true;
        }
    }
    return false;
}
