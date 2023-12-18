'use client';

import { useEffect, useState } from 'react';

import { CalendarIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import SearchBox from '@/components/SearchBox';
import { useRouter } from 'next/navigation';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function search({ searchQuery, place }: any) {
    const router = useRouter();

    const currentDate = new Date();
    const newFromDate = new Date(currentDate);
    newFromDate.setDate(currentDate.getDate());

    const newToDate = new Date(currentDate);
    newToDate.setDate(currentDate.getDate() + 3);

    const from = new Date(searchQuery.startTs);

    const to = new Date(searchQuery.endTS);

    const [pickupDate, setPickupDate] = useState<Date>(from || newFromDate);
    const [dropDate, setDropDate] = useState<Date>(to || newToDate);
    const [pickupTime, setPickupTime] = useState(searchQuery.pickupTime || '10:00 AM');
    const [dropTime, setDropTime] = useState(searchQuery.dropTime || '9:30 PM');

    const [value, setValue] = useState({});

    const pushToSearch = () => {
        const loaction: any = value;

        const url = `/vehicles?city=${loaction.placeName}&pickupDate=${pickupDate}&pickupTime=${pickupTime}&dropDate=${dropDate}&dropTime=${dropTime}&latitude=${loaction.latitude}&longitude=${loaction.longitude}`;

        router.push(url);
    };

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

    return (
        <>
            <div className=' max-w-7xl px-4 mx-auto sm:px-0  md:px-8  '>
                <div className=' bg-white rounded-md shadow-lg'>
                    <div className='px-4 py-6 sm:px-8 sm:py-7  gap-4 lg:flex lg:items-end '>
                        <div className='flex w-full mb-4 lg:mb-0'>
                            <div className='flex flex-col gap-1 w-full '>
                                <label className='text-xs font-medium'>Search By City, Place and Zipcode</label>
                                <SearchBox setValue={setValue} place={place} />
                            </div>
                        </div>

                        <div className='flex flex-col md:flex-row  md:items-end w-full gap-4'>
                            <div className='flex flex-row md:flex-row gap-4'>
                                <div className='flex flex-col gap-1 w-3/4'>
                                    <label className='text-xs font-medium'>Pickup Date</label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant={'outline'} className={cn('w-full justify-start text-left font-normal', !pickupDate && 'text-muted-foreground')}>
                                                <CalendarIcon className='mr-2 h-4 w-4' />
                                                {pickupDate ? format(pickupDate, 'PPP') : <span>Pickup date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className='w-auto p-0'>
                                            <Calendar mode='single' selected={pickupDate} onSelect={setPickupDate} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className='flex flex-col gap-1 w-1/4 md:w-full '>
                                    <label className='text-xs font-medium'>Pickup Time</label>
                                    <Select
                                        onValueChange={time => {
                                            setPickupTime(time);
                                        }}
                                        defaultValue={searchQuery.pickupTime}>
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
                            </div>

                            <div className='flex flex-row   md:flex-row gap-4'>
                                <div className='flex flex-col gap-1 w-3/4 '>
                                    <label className='text-xs font-medium'>Drop Date</label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant={'outline'} className={cn('w-full justify-start text-left font-normal', !dropDate && 'text-muted-foreground')}>
                                                <CalendarIcon className='mr-2 h-4 w-4' />
                                                {dropDate ? format(dropDate, 'PPP') : <span>Pick an drop date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className='w-auto p-0'>
                                            <Calendar mode='single' selected={dropDate} onSelect={setDropDate} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className='flex flex-col gap-1 w-1/4 md:w-full'>
                                    <label className='text-xs font-medium'>Drop Time</label>
                                    <Select
                                        onValueChange={time => {
                                            setDropTime(time);
                                        }}
                                        defaultValue={searchQuery.dropTime}>
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
                            <Button onClick={pushToSearch}>Search</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
