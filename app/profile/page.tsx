'use client';
import { Button } from '@/components/ui/button';
import { CheckCircleIcon, PhotoIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { fetchProfileDetails } from '@/app/_actions/fetchprofiledetails';
import { getUserExistOrNotConfirmation } from '@/app/_actions/check_user_exist';
import { DNA } from 'react-loader-spinner';

const UserProfilePage = () => {
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [city, setCity] = useState('');
    const [postCode, setpostCode] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [isVerified, setIsVerfied] = useState('');
    const [address1, setaddress1] = useState('');
    const [address2, setaddress2] = useState('');
    const [address3, setaddress3] = useState('');
    const [image, setImage] = useState('');
    const [errorCode, seterrorCode] = useState('');

    useEffect(() => {
        const bundee_auth_token = localStorage.getItem('bundee_auth_token');
        const userId = localStorage.getItem('userId');
        const email = localStorage.getItem('session_user');
        const userCheckData = {
            channelName: 'Bundee',
            email: email,
        };

        const body = {
            iduser: userId,
        };
        const fetchData = async () => {
            try {
                const userData = await getUserExistOrNotConfirmation(userCheckData, bundee_auth_token);

                const data = await fetchProfileDetails(body, bundee_auth_token);
                setFirstName(data['firstName']);
                setMiddleName(data['middleName']);
                setLastName(data['lastName']);
                setEmail(data['email']);
                setPhoneNumber(data['phoneNumber']);
                setState(data['state']);
                setCity(data['city']);
                setCountry(data['country']);
                setpostCode(data['postCode']);
                setIsVerfied(userData['isPersonaVerified']);
                setaddress1(data['address1']);
                setaddress2(data['address2']);
                setaddress3(data['address3']);
                setImage(data['userImage']);
                seterrorCode(data['errorcode']);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    if (errorCode === '0') {
        return (
            <div className='mx-auto max-w-2xl px-4 py-4 sm:px-6 lg:max-w-7xl lg:px-8 sm:py-12 lg:py-12'>
                <div className='px-4 sm:px-0'>
                    <h2 className='text-2xl font-semibold leading-7 text-neutral-900'>Profile</h2>
                    <p className='mt-1 max-w-2xl text-sm leading-6 text-neutral-500'>Personal details will be shared to the host for better experiences.</p>
                    <Link
                        href={{
                            pathname: '/profile/update',
                            query: {
                                firstName: firstName,
                                middleName: middleName,
                                lastName: lastName,
                                email: email,
                                phoneNumber: phoneNumber,
                                city: city,
                                postCode: postCode,
                                state: state,
                                country: country,
                                address1: address1,
                                address2: address2,
                                address3: address3,
                            },
                        }}>
                        <Button className='mt-4' variant='outline'>
                            Edit Profile Information
                        </Button>
                    </Link>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-3 w-full'>
                    <div className=' border-t border-neutral-100'>
                        <dl className='divide-y divide-neutral-100'>
                            <div className='px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                                <dt className='text-sm font-medium leading-6 text-neutral-900'>Full name</dt>
                                <dd className='mt-1 text-sm leading-6 text-neutral-700 sm:col-span-2 sm:mt-0'>{`${firstName} ${middleName} ${lastName}`}</dd>
                            </div>
                            <div className='px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                                <dt className='text-sm font-medium leading-6 text-neutral-900'>Phone Number</dt>
                                <dd className='mt-1 text-sm leading-6 text-neutral-700 sm:mt-0'>{`${phoneNumber}`}</dd>
                                <dd className='mt-1 text-cente text-sm leading-6 text-black sm:mt-0'>
                                    {/* <Link href="/profile/personaverification" title="" className="flex">
                                <button className='bg-black text-white rounded-lg px-4'>Verify Now</button>
                            </Link> */}
                                </dd>
                            </div>
                            <div className='px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                                <dt className='text-sm font-medium leading-6 text-neutral-900'>Email address</dt>
                                <dd className='mt-1 text-sm leading-6 text-neutral-700 sm:mt-0'>{`${email}`}</dd>
                                <dd className='mt-1 text-cente text-sm leading-6 text-black sm:mt-0'>
                                    <button className='text-green-600 px-4 rounded-lg'></button>
                                </dd>
                            </div>

                            <div className='px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                                <dt className='text-sm font-medium leading-6 text-neutral-900'>Driving Licence</dt>
                                <dd className='mt-1 text-sm leading-6 text-neutral-700 sm:mt-0'>
                                    {isVerified === 'true' ? (
                                        <div className='flex items-center space-x-1 text-green-600'>
                                            <CheckCircleIcon className='h-5 w-5' />
                                            <p className='text-sm font-medium'>Verified</p>
                                        </div>
                                    ) : (
                                        <Link href='/profile/personaverification' title='' className='flex'>
                                            <button className='bg-black text-white rounded-lg px-4 py-2 hover:bg-neutral-800'>Verify Now</button>{' '}
                                        </Link>
                                    )}
                                </dd>
                                <dd className='mt-1 text-cente text-sm leading-6 text-black sm:mt-0'></dd>
                            </div>

                            <div className='px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                                <dt className='text-sm font-medium leading-6 text-neutral-900'>Zip Code</dt>
                                <dd className='mt-1 text-sm leading-6 text-neutral-700 sm:col-span-2 sm:mt-0'>{`${postCode}`}</dd>
                            </div>
                            <div className='px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                                <dt className='text-sm font-medium leading-6 text-neutral-900'>City</dt>
                                <dd className='mt-1 text-sm leading-6 text-neutral-700 sm:col-span-2 sm:mt-0'>{`${city}`}</dd>
                            </div>
                            <div className='px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                                <dt className='text-sm font-medium leading-6 text-neutral-900'>State</dt>
                                <dd className='mt-1 text-sm leading-6 text-neutral-700 sm:col-span-2 sm:mt-0'>{`${state}`}</dd>
                            </div>
                            <div className='px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                                <dt className='text-sm font-medium leading-6 text-neutral-900'>Country</dt>
                                <dd className='mt-1 text-sm leading-6 text-neutral-700 sm:col-span-2 sm:mt-0'>{`${country}`}</dd>
                            </div>
                            <div className='px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                                <dt className='text-sm font-medium leading-6 text-neutral-900'>Full Address</dt>
                                <dd className='mt-1 text-sm leading-6 text-neutral-700 sm:col-span-2 sm:mt-0'>{`${address1} ${address2} ${address3}`}</dd>
                            </div>
                        </dl>
                    </div>

                    <div className='flex flex-col gap-4 '>
                        <div className='col-span-full'>
                            <label htmlFor='photo' className='block text-sm font-medium leading-6 text-neutral-900'>
                                Your Photo
                            </label>
                        </div>

                        {image ? (
                            <div className='sm:w-1/2 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-neutral-200 lg:aspect-none group-hover:opacity-75 lg:h-80 border'>
                                <img src={image} alt='Image Not Found' className='h-full w-full object-cover object-center lg:h-full lg:w-full' />
                            </div>
                        ) : (
                            <div className='sm:w-1/2  p-4 text-center flex flex-col gap-3 border rounded-md'>
                                <PhotoIcon className='mx-auto h-8 w-8 text-neutral-300' aria-hidden='true' />
                                <p className='font-medium text-muted-foreground/60 text-xl'>Photo not uploaded</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className='text-center mt-10 py-12 md:py-20'>
                {' '}
                <p>Loading profile details...</p>{' '}
            </div>
        );
    }
};
export default UserProfilePage;
