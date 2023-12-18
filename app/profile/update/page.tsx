'use client';
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';
import { updateExistUser } from '@/app/_actions/update_profile';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

const ProfileUpdatePage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [userID, setuserId] = useState('');
    const [bundeeToken, setToken] = useState('');
    var email;
    useEffect(() => {
        const bundee_auth_token = localStorage.getItem('bundee_auth_token');
        setToken(bundee_auth_token);
        const userId = localStorage.getItem('userId');
        setuserId(userId);
        email = localStorage.getItem('session_user');
    }, []);

    const initialFormData = {
        firstName: searchParams.get('firstName') || '',
        middleName: searchParams.get('middleName') || '',
        lastName: searchParams.get('lastName') || '',
        phoneNumber: searchParams.get('phoneNumber') || '',
        email: searchParams.get('email') || '',
        zipCode: searchParams.get('postCode') || '',
        city: searchParams.get('city') || '',
        state: searchParams.get('state') || '',
        country: searchParams.get('country') || '',
        base64Image: searchParams.get('image') || '',
        address1: searchParams.get('address1') || '',
        address2: searchParams.get('address2') || '',
        address3: searchParams.get('address3') || '',
    };

    const [formData, setFormData] = useState(initialFormData);

    const handleInputChange = (key, event) => {
        setFormData(prevData => ({
            ...prevData,
            [key]: event.target.value,
        }));
    };

    const handleFileChange = event => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const resultAsString = reader.result as string;
                setFormData(prevData => ({
                    ...prevData,
                    base64Image: resultAsString,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    async function onUploadEvent() {
        const body = {
            iduser: userID,
            firstname: formData.firstName,
            middlename: formData.middleName,
            lastname: formData.lastName,
            mobilePhone: formData.phoneNumber,
            address_1: formData.address1,
            address_2: formData.address2,
            address_3: formData.address3,
            city: formData.city,
            state: formData.state,
            postcode: formData.zipCode,
            country: formData.country,
            language: 'NA',
            driverlisense: 'NA',
            vehicleowner: 'NA',
            userimage: formData.base64Image,
            fromValue: 'completeProfile',
        };
        const data = await updateExistUser(body, bundeeToken);

        router.push('/profile');
    }

    async function onCancelEvent() {
        router.push('/profile');
    }

    return (
        <>
            <form className='mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8 sm:py-16 lg:py-20'>
                <div className='space-y-12'>
                    <div className='border-b border-gray-900/10 pb-12'>
                        <div className='px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
                            <button type='button' className='inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto' onClick={onUploadEvent}>
                                Update
                            </button>
                            <button type='button' className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto' onClick={onCancelEvent}>
                                Cancel
                            </button>
                        </div>

                        <h2 className='text-base font-semibold leading-7 text-gray-900'>Account Details</h2>
                        <p className='mt-1 text-sm leading-6 text-gray-600'>Your Profile Information will be used for the host to identify yourself. Your profile data will not be shared to the public users. You can edit and customize your profile information any time.</p>
                        <div className='border-b border-gray-900/10 pb-12 mt-4'>
                            <h2 className='text-base font-semibold leading-7 text-gray-900'>Personal Information</h2>
                            <p className='mt-1 text-sm leading-6 text-gray-600'>The same information you provided will be used for the communication Purpose, through out the Trip Jouney with Bundee.</p>

                            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
                                <div className='sm:col-span-2'>
                                    <label htmlFor='first-name' className='block text-sm font-medium leading-6 text-gray-900'>
                                        First Name
                                    </label>
                                    <div className='mt-2'>
                                        <Input placeholder='' type='text' name='first-name' value={formData.firstName} id='first-name' onChange={e => handleInputChange('firstName', e)} />
                                    </div>
                                </div>
                                <div className='sm:col-span-2'>
                                    <label htmlFor='middle-name' className='block text-sm font-medium leading-6 text-gray-900'>
                                        Middle Name
                                    </label>
                                    <div className='mt-2'>
                                        <Input placeholder='' type='text' name='middle-name' value={formData.middleName} id='middle-name' onChange={e => handleInputChange('middleName', e)} />
                                    </div>
                                </div>
                                <div className='sm:col-span-2'>
                                    <label htmlFor='last-name' className='block text-sm font-medium leading-6 text-gray-900'>
                                        Last Name
                                    </label>
                                    <div className='mt-2'>
                                        <Input placeholder='' type='text' name='last-name' value={formData.lastName} id='last-name' onChange={e => handleInputChange('lastName', e)} />
                                    </div>
                                </div>

                                <div className='sm:col-span-2'>
                                    <label htmlFor='phone-number' className='block text-sm font-medium leading-6 text-gray-900'>
                                        Phone Number
                                    </label>

                                    <div className='mt-2'>
                                        <Input type='text' value={formData.phoneNumber} onChange={e => handleInputChange('phoneNumber', e)} name='phone-number' id='phone-number' autoComplete='family-name' />
                                    </div>
                                </div>

                                <div className='sm:col-span-2'>
                                    <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
                                        Email Address
                                    </label>
                                    <div className='mt-2'>
                                        <Input type='email' value={formData.email} onChange={e => handleInputChange('email', e)} name='last-name' id='last-name' autoComplete='family-name' disabled readOnly />
                                    </div>
                                </div>
                                <div className='sm:col-span-2'>
                                    <label htmlFor='zip-code' className='block text-sm font-medium leading-6 text-gray-900'>
                                        Zip code
                                    </label>
                                    <div className='mt-2'>
                                        <Input type='text' value={formData.zipCode} onChange={e => handleInputChange('zipCode', e)} name='zip-code' id='zip-code' autoComplete='given-name' />
                                    </div>
                                </div>
                            </div>

                            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
                                <div className='sm:col-span-2'>
                                    <label htmlFor='city' className='block text-sm font-medium leading-6 text-gray-900'>
                                        City / District Name
                                    </label>
                                    <div className='mt-2'>
                                        <Input type='text' value={formData.city} onChange={e => handleInputChange('city', e)} name='city' id='city' autoComplete='given-name' />
                                    </div>
                                </div>

                                <div className='sm:col-span-2'>
                                    <label htmlFor='state' className='block text-sm font-medium leading-6 text-gray-900'>
                                        State / Provinence
                                    </label>

                                    <div className='mt-2'>
                                        <Input type='text' value={formData.state} onChange={e => handleInputChange('state', e)} name='state' id='state' autoComplete='family-name' />
                                    </div>
                                </div>

                                <div className='sm:col-span-2'>
                                    <label htmlFor='country' className='block text-sm font-medium leading-6 text-gray-900'>
                                        Country
                                    </label>
                                    <div className='mt-2'>
                                        <Input type='text' value={formData.country} onChange={e => handleInputChange('country', e)} name='country' id='country' autoComplete='family-name' />
                                    </div>
                                </div>
                                <div className='sm:col-span-2'>
                                    <label htmlFor='address1' className='block text-sm font-medium leading-6 text-gray-900'>
                                        Address 1
                                    </label>
                                    <div className='mt-2'>
                                        <Input type='text' value={formData.address1} onChange={e => handleInputChange('address1', e)} name='address1' id='address1' autoComplete='family-name' />
                                    </div>
                                </div>
                                <div className='sm:col-span-2'>
                                    <label htmlFor='address2' className='block text-sm font-medium leading-6 text-gray-900'>
                                        Address 2
                                    </label>
                                    <div className='mt-2'>
                                        <Input type='text' value={formData.address2} onChange={e => handleInputChange('address2', e)} name='address2' id='address2' autoComplete='family-name' />
                                    </div>
                                </div>
                                <div className='sm:col-span-2'>
                                    <label htmlFor='address3' className='block text-sm font-medium leading-6 text-gray-900'>
                                        Address 3
                                    </label>
                                    <div className='mt-2'>
                                        <Input type='text' value={formData.address3} onChange={e => handleInputChange('address3', e)} name='address3' id='address3' autoComplete='family-name' />
                                    </div>
                                </div>

                                <div className='flex flex-col col-span-full'>
                                    <h2 className='text-base font-semibold leading-7 text-gray-900'>
                                        Insurance Details<span className='text-primary text-xs'> ( Optional ) </span>
                                    </h2>
                                    <p className='mt-1 text-sm leading-6 text-gray-600'>If you have any personal insurance details against the vehicle rental and driving, You can enter here, Your data will not be shared and used within the bundee network.</p>
                                </div>
                            </div>

                            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
                                <div className='sm:col-span-3'>
                                    <label htmlFor='first-name' className='block text-sm font-medium leading-6 text-gray-900'>
                                        Insurance Company Name
                                    </label>
                                    <div className='mt-2'>
                                        <Input type='text' name='first-name' id='first-name' autoComplete='given-name' />
                                    </div>
                                </div>

                                <div className='sm:col-span-3'>
                                    <label htmlFor='last-name' className='block text-sm font-medium leading-6 text-gray-900'>
                                        Insurance Carrier Number
                                    </label>

                                    <div className='mt-2'>
                                        <Input type='text' name='last-name' id='last-name' autoComplete='family-name' />
                                    </div>
                                </div>
                            </div>

                            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
                                <div className='col-span-full'>
                                    <label htmlFor='photo' className='block text-sm font-medium leading-6 text-gray-900'>
                                        Your Photo
                                    </label>
                                </div>

                                <div className='aspect-w-1 aspect-h-1 w-full rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80 border-2 border-gray-300 overflow-hidden'>
                                    <img src={formData.base64Image || 'https://via.placeholder.com/900'} alt='user Image Loading' className='h-full w-full object-cover object-center lg:h-full lg:w-full aspect-none' style={{ maxWidth: '100%', maxHeight: '100%' }} />
                                </div>
                                <div className='mt-4 flex justify-between'>
                                    <div className='col-span-full'>
                                        <label htmlFor='cover-photo' className='block text-sm font-medium leading-6 text-gray-900'>
                                            Uplaod your profile Image
                                        </label>
                                        <div className='mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10'>
                                            <div className='text-center'>
                                                <PhotoIcon className='mx-auto h-12 w-12 text-gray-300' aria-hidden='true' />
                                                <div className='mt-4 flex text-sm leading-6 text-gray-600'>
                                                    <label htmlFor='file-upload' onChange={handleFileChange} className='relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500'>
                                                        <span>Upload a file</span>
                                                        <Input id='file-upload' name='file-upload' type='file' className='sr-only' />
                                                    </label>
                                                    <p className='pl-1'>or drag and drop</p>
                                                </div>
                                                <p className='text-xs leading-5 text-gray-600'>PNG, JPG, GIF up to 10MB</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};
export default ProfileUpdatePage;
