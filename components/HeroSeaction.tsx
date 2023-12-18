'use client';
import { useEffect, useState } from 'react';

import { CalendarIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { format } from 'date-fns';
import { Calendar } from './ui/calendar';
import SearchBox from './SearchBox';
import { useRouter } from 'next/navigation';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const HeroSeaction = () => {
    const router = useRouter();

    const currentDate = new Date();
    const from = new Date(currentDate);
    from.setDate(currentDate.getDate());

    const to = new Date(currentDate);
    to.setDate(currentDate.getDate() + 3);

    const [pickupDate, setPickupDate] = useState<Date>(from);
    const [dropDate, setDropDate] = useState<Date>(to);
    const [pickupTime, setPickupTime] = useState('10:00 AM');
    const [dropTime, setDropTime] = useState('9:30 PM');

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
            <section className="bg-[url('https://images.unsplash.com/photo-1496055401924-5e7fdc885742?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-no-repeat      py-16 bg-gray-900 sm:py-16 lg:py-24 h-[70vh] bg-blend-lighten opacity-90">
                <div className=' max-w-7xl px-4 mx-auto sm:px-0 mb-10 md:px-8 '>
                    <div className=' bg-white rounded-md shadow-md'>
                        <div className='px-4 py-6 sm:px-8 sm:py-7  gap-4 lg:flex lg:items-end '>
                            <div className='flex w-full mb-4 lg:mb-0'>
                                <div className='flex flex-col gap-1 w-full '>
                                    <label className='text-xs font-medium'>Search By City, Place and Zipcode</label>
                                    <SearchBox setValue={setValue} />
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
                                                <Calendar mode='single' selected={pickupDate} onSelect={setPickupDate} initialFocus disabled={date => date < new Date()} />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className='flex flex-col gap-1 w-1/4 md:w-full '>
                                        <label className='text-xs font-medium'>Pickup Time</label>
                                        <Select
                                            onValueChange={time => {
                                                setPickupTime(time);
                                            }}
                                            defaultValue={times[0]}>
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
                                                <Calendar mode='single' selected={dropDate} onSelect={setDropDate} initialFocus disabled={date => date < new Date()} />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className='flex flex-col gap-1 w-1/4 md:w-full'>
                                        <label className='text-xs font-medium'>Drop Time</label>
                                        <Select
                                            onValueChange={time => {
                                                setDropTime(time);
                                            }}
                                            defaultValue={times[times.length - 1]}>
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
            </section>
        </>
    );
};

export default HeroSeaction;
