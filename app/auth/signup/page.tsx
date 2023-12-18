'use client';

import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';

const Signup = () => {
    const notify = () => toast('Registeration successfull, Redirecting to Login..');

    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
    });
    const [authError, setAuthError] = useState('');
    const [redirect, setRedirect] = useState(false);

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        if (redirect) {
            notify();
            setTimeout(() => {
                window.location.href = '/auth/verification';
            }, 100);
        }
    }, [redirect]);

    const isValidEmailAndPassword = () => {
        const { email, password, confirmPassword } = formData;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+{}|:;<>,.?~\\[\]-]{8,}$/;
        return emailPattern.test(email) && passwordPattern.test(password) && password === confirmPassword;
    };

    const firebaseAuthHandler = async () => {
        if (isValidEmailAndPassword()) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                await sendEmailVerification(userCredential.user);
                console.log('Verification email sent successfully');
                localStorage.setItem('user_first_name', formData.firstName);
                localStorage.setItem('user_last_name', formData.lastName);
                setRedirect(true);
            } catch (error) {
                if (error.code === 'auth/email-already-in-use') {
                    setAuthError('Account Already exist please login');
                } else {
                    setAuthError('An error occurred during sign up');
                }
            }
        } else {
            setAuthError('Invalid Credentials');
        }
    };

    return (
        <div>
            <ToastContainer className='h-20' />
            <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
                <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
                    <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>Sign up for your account</h2>
                </div>
                <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
                    <div>
                        <label className='block text-sm font-medium leading-6 text-gray-900'>First Name</label>
                        <div className='mt-2'>
                            <Input id='firstName' name='firstName' type='text' required value={formData.firstName} onChange={handleChange} className='block w-full' />
                        </div>
                    </div>

                    <div>
                        <label className='block text-sm font-medium leading-6 text-gray-900'>Last Name</label>
                        <div className='mt-2'>
                            <Input id='lastName' name='lastName' type='text' required value={formData.lastName} onChange={handleChange} className='block w-full' />
                        </div>
                    </div>

                    <div>
                        <label className='block text-sm font-medium leading-6 text-gray-900'>Mobile No.</label>
                        <div className='mt-2'>
                            <Input id='phoneNumber' name='phoneNumber' type='number' required value={formData.phoneNumber} onChange={handleChange} className='block w-full' />
                        </div>
                    </div>

                    <div>
                        <label className='block text-sm font-medium leading-6 text-gray-900'>Email address</label>
                        <div className='mt-2'>
                            <Input id='email' name='email' type='email' required value={formData.email} onChange={handleChange} className='block w-full' />
                        </div>
                    </div>

                    <div>
                        <div className='flex items-center justify-between'>
                            <label className='block text-sm font-medium leading-6 text-gray-900'>Password</label>
                        </div>
                        <div className='mt-2'>
                            <Input id='password' name='password' type='password' required value={formData.password} onChange={handleChange} className='block w-full' />
                        </div>
                    </div>

                    <div>
                        <div className='flex items-center justify-between'>
                            <label className='block text-sm font-medium leading-6 text-gray-900'>Confirm Password</label> {/* Correct label */}
                        </div>
                        <div className='mt-2'>
                            <Input id='confirmPassword' name='confirmPassword' type='password' required value={formData.confirmPassword} onChange={handleChange} className='block w-full' />
                        </div>
                    </div>

                    <div className=' mt-4 relative flex gap-x-3'>
                        <div className='flex h-6 items-center'>
                            <input id='candidates' name='candidates' type='checkbox' className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600' />
                        </div>
                        <div className='text-sm leading-6'>
                            <p className='text-gray-500'>I accept the terms and conditions of the Bundee</p>
                            <Link className='text-xs text-primary font-bold' href='/privacy'>
                                Read More About Policy
                            </Link>
                        </div>
                    </div>

                    <div>
                        <Button onClick={firebaseAuthHandler} className='mt-8 flex w-full justify-center'>
                            Sign Up
                        </Button>
                    </div>
                    {authError && <p className='mt-2 text-red-500 text-sm text-center'>{authError}</p>}

                    <Link href='/auth/login'>
                        <Button className='bg-white text-black  hover:bg-primary/10 mt-8 flex w-full justify-center'>Aleady have an account ? Login</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
