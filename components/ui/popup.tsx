'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { Calendar } from './calendar';
import React from 'react';
import { addDays, format, set } from 'date-fns';
import { DialogClose } from '@radix-ui/react-dialog';
import { CalendarIcon } from '@heroicons/react/20/solid';
import { getAvailabilityDatesByVehicleId } from '@/app/_actions/get_availability_dates_by_vehicle_id';

export function DialogDemo({ vehicleid, setParentError, setPickupDate, setDropDate, pickupDate, dropDate }) {
    const [vehicleUnavailableDates, setVehicleUnavailableDates] = useState([]);
    const [error, setError] = useState('');
    const [isMobile, setIsMobile] = useState(false);

    const today = new Date();

    const [date, setDate] = useState({
        from: new Date(pickupDate) || today,
        to: new Date(dropDate) || addDays(today, 2),
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('auth_token_login') || '';
                const data = await getAvailabilityDatesByVehicleId({ vehicleid: vehicleid }, token);
                setVehicleUnavailableDates(convertDates(data.unAvailabilityDate));
            } catch (error) {
                console.error('Error fetching Availability dates', error);
                setError('Error fetching Availability dates');
            }
        };

        // const vehicleUnavailableDatesDates = convertDates(data);
        // setVehicleUnavailableDates(vehicleUnavailableDatesDates);

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 600);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);

            fetchData();
        };
    }, []);

    const handleDateSelect = newDate => {
        let newError = '';
        setDate(newDate);

        if (newDate?.from) {
            if (!newDate.to) {
                newError = 'Please pick an End day.';
                setErrorDates();
            } else if (newDate.to) {
                const fromDate = newDate.from.toISOString() || '';
                const toDate = newDate.to.toISOString() || '';

                if (fromDate === toDate) {
                    newError = 'Start date and End date cannot be the same.';
                        setErrorDates();
                } else {
                    // Check if the selected date range overlaps with unavailable dates
                    if (isDateRangeUnavailable(fromDate, toDate, vehicleUnavailableDates)) {
                        newError = 'Selected date range overlaps with unavailable dates.';
                        setErrorDates();
                    } else {
                        console.log('dates are available');
                        setNewDate(newDate.from, newDate.to);
                    }
                }
            }
        } else {
            newError = 'Please pick a Start day.';
            setErrorDates();
        }

        setError(newError);
        setParentError(newError);
    };

    const setNewDate = (from, to) => {
        setPickupDate(from);
        setDropDate(to);
    };

    const setErrorDates = ()=>{
        setPickupDate(null);
        setDropDate(null);
    }

    return (
        <Dialog>
            <DialogTrigger>
                <div className='w-full inline-flex items-center  whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-input bg-transparent shadow-sm  hover:text-accent-foreground h-9 px-4 py-2'>
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {error ? (
                        <span className='text-red-500'>{error}</span>
                    ) : (
                        <span>
                            {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                        </span>
                    )}
                </div>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[800px] sm:max-h-[800px]'>
                <DialogHeader>
                    <DialogTitle>Vehicle Availability Calendar</DialogTitle>
                    <DialogDescription>
                        {error ? (
                            <span className='text-red-500 mt-4'>{error}</span>
                        ) : (
                            <span>
                                <span className='font-bold'>Selected Trip Dates : </span> {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                            </span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <div className='flex justify-center w-full'>
                    <Calendar
                        initialFocus
                        mode='range'
                        defaultMonth={today}
                        selected={date}
                        onSelect={handleDateSelect}
                        numberOfMonths={isMobile ? 1 : 3}
                        disabled={date => {
                            const yesterdate = new Date();
                            yesterdate.setDate(yesterdate.getDate() - 1);
                            return vehicleUnavailableDates.includes(date.toISOString().split('T')[0]) || date < yesterdate;
                        }}
                    />
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type='button' className={`bg-primary ${error ? 'cursor-not-allowed opacity-50' : ''}`} disabled={!!error}>
                            Save and continue
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

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
