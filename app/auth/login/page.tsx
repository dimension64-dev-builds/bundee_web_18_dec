"use client"

import React, { useEffect, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Adjust this import according to your project structure
import { Input } from '@/components/ui/input'; // Adjust this import according to your project structure
import { Button } from '@/components/ui/button'; // Adjust this import according to your project structure
import Link from 'next/link';
import { initializeAuthTokensAfterLogin } from '@/app/_actions/get_after_login_auth_token'; // Adjust this import according to your project structure
import { getUserExistOrNotConfirmation } from '@/app/_actions/check_user_exist';
import { createNewUser } from '@/app/_actions/create_new_user';

const LoginPage = () => {

    const [userEmail, setEmail] = useState('');


    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');


    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');

    const [callbackUrl , setCallBackUrl] = useState("/");

    useEffect(() => {

        const sessionUser = localStorage.getItem('session_user');
        const userFirstName = localStorage.getItem('user_first_name');
        const userLastName = localStorage.getItem('user_last_name');
        setCallBackUrl(localStorage.getItem('authCallbackSuccessUrl'));



        if (userFirstName) {
            setFirstName(userFirstName);
        }

        if (userLastName) {
            setLastName(userLastName);
        }

        if (sessionUser) {
            window.location.href = '/' // Change to your authenticated route
        }
    }, []);

    const isValidEmailAndPassword = (email, password) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+{}|:;<>,.?~\\[\]-]{8,}$/;

        if (!emailPattern.test(email) || !passwordPattern.test(password)) {
            setAuthError("Invalid email or password format.");
            return false;
        }

        return true;
    };

    const handleLogin = async () => {
        if (!isValidEmailAndPassword(userEmail, password)) {
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, userEmail, password);
            const user = userCredential.user;

            const token = await user.getIdToken();

            localStorage.setItem('session_user', user.email);
            localStorage.setItem('auth_token', token);


            const bundee_auth_token = localStorage.getItem('bundee_auth_token');

            if (user.emailVerified) {

                const userCheckData = {
                    channelName: "Bundee",
                    email: user.email
                }

                console.log(userCheckData);
                console.log(bundee_auth_token);

                const userData = await getUserExistOrNotConfirmation(userCheckData, bundee_auth_token);

                console.log("User exist or not data " + userData.isUserExist)

                console.log("User exist or not data " + userData.errorcode)

                if (userData.errorcode == "1") {

                    const dataToCreateUser = {
                        firstname: firstName,
                        lastname: lastName,
                        email: userEmail,
                        userRole: "Driver",
                        channelName: "Bundee"
                    }

                    const data = await createNewUser(dataToCreateUser, bundee_auth_token);

                    console.log("create new user data" + data)

                    if (data.errorcode == '0') {

                        const tokenAfterLogin = await initializeAuthTokensAfterLogin(token);

                        localStorage.setItem('auth_token_login', tokenAfterLogin);
                        localStorage.setItem('userId', data.userId);


                        window.location.href = callbackUrl || '/';

                    } else {
                        setAuthError("Sorry, Unable to create user");
                    }

                } else {

                    const tokenAfterLogin = await initializeAuthTokensAfterLogin(token);

                    localStorage.setItem('auth_token_login', tokenAfterLogin);
                    localStorage.setItem('session_user', user.email);
                    localStorage.setItem('userId', userData.userId);

                    window.location.href = callbackUrl || '/';
                }
            } else {
                setAuthError("Please Verify Your Email.");
                return;
            }

            // Change to your authenticated route
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                setAuthError("Account does not exist.");
            } else if (error.code === 'auth/wrong-password') {
                setAuthError("Incorrect password.");
            } else {
                setAuthError("An error occurred. Please try again.");
            }
        }
    };

    return (
        <div className='h-screen min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
            <div className='sm:mx-auto sm:w-full sm:max-w-md'>
                <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
                    Sign in to your account
                </h2>
            </div>
            <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
                <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
                    <div>
                        <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                            Email address
                        </label>
                        <div className='mt-1'>
                            <Input
                                id='email'
                                name='email'
                                type='email'
                                autoComplete='email'
                                required
                                value={userEmail}
                                onChange={(e) => setEmail(e.target.value)}
                                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                            />
                        </div>
                    </div>

                    <div className='mt-6'>
                        <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                            Password
                        </label>
                        <div className='mt-1'>
                            <Input
                                id='password'
                                name='password'
                                type='password'
                                autoComplete='current-password'
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                            />
                        </div>
                    </div>

                    {authError && <div className='mt-6 text-center text-sm text-red-500'>{authError}</div>}

                    <div className='mt-6'>
                        <Button
                            onClick={handleLogin}
                            className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        >
                            Sign in
                        </Button>
                    </div>
                </div>
                <div className='mt-6'>
                    <div className='relative'>
                        <div className='absolute inset-0 flex items-center'>
                            <div className='w-full border-t border-gray-300'></div>
                        </div>
                        <div className='relative flex justify-center text-sm'>
                            <span className='px-2 bg-white text-gray-500'>
                                Or
                            </span>
                        </div>
                    </div>

                    <div className='mt-6 gap-3'>
                        <div>
                            <Link href="/auth/signup">
                                <Button className='bg-white text-black  hover:bg-primary/10 mt-8 flex w-full justify-center'>
                                    Don't have an account ? Sign up
                                </Button>
                            </Link>
                        </div>
                        <div>
                            <Link href="/auth/reset_password">
                                <Button className='bg-white shadow-none text-primary hover:bg-white mt-4 flex w-full justify-center'>
                                    Forgot Password ? Reset Password
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

