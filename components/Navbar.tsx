'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { auth } from '@/app/auth/firebase';
import NotificationPopoverItem from './Notifications';

const Navbar = () => {
    const [userLoggedin, setuserLoggedin] = useState(false);

    // const [userLastName, setUserLastName] = useState("");

    const currentPathName = usePathname();

    useEffect(() => {
        const sessionEmail = localStorage.getItem('session_user');
        console.log('sessionEmail got from the session' + sessionEmail);

        if (sessionEmail != null) {
            setuserLoggedin(true);
        }
    }, []);

    function setAuthSuccessURLHandler() {
        // alert("going to login page");
        console.log('onclick');
        console.log(currentPathName);
        localStorage.setItem('authCallbackSuccessUrl', currentPathName);
    }

    function firebaseLogoutHandler() {
        localStorage.setItem('authCallbackSuccessUrl', currentPathName);

        localStorage.removeItem('session_user');
        localStorage.removeItem('user_first_name');
        localStorage.removeItem('user_last_name');
        localStorage.removeItem('email_veirfy_status');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_token_login');
        localStorage.removeItem('userId');

        localStorage.removeItem('checkOutInfo');

        const redirectURI = localStorage.getItem('authCallbackSuccessUrl');

        auth.signOut();

        window.location.href = redirectURI || '/';
    }

    return (
        <header className=' bg-white sticky top-0 z-20 shadow-sm'>
            <div className='px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-2'>
                <nav className='flex items-center justify-between '>
                    <div className='flex-shrink-0'>
                        <Link href='/' title=''>
                            <svg xmlns='http://www.w3.org/2000/svg' className='w-20 h-10' viewBox='0 0 200 103' fill='none'>
                                <path
                                    d='M59.9463 101.857V81.7449H69.3148C70.8415 81.7449 72.1501 81.9788 73.2406 82.4468C74.3312 82.9147 75.1639 83.5896 75.7389 84.4715C76.3139 85.3354 76.6014 86.3882 76.6014 87.6301C76.6014 88.512 76.3337 89.3578 75.7984 90.1677C75.2631 90.9596 74.3807 91.6255 73.1514 92.1655V90.1137C74.3212 90.5277 75.2234 91.0226 75.8579 91.5985C76.4924 92.1745 76.9286 92.8044 77.1665 93.4883C77.4044 94.1542 77.5234 94.8561 77.5234 95.594C77.5234 97.5737 76.7997 99.1125 75.3523 100.21C73.9049 101.308 71.8924 101.857 69.3148 101.857H59.9463ZM64.5562 98.2126H69.8501C70.782 98.2126 71.5256 97.9697 72.0807 97.4837C72.6359 96.9978 72.9135 96.3679 72.9135 95.594C72.9135 94.8021 72.6359 94.1632 72.0807 93.6773C71.5256 93.1913 70.782 92.9484 69.8501 92.9484H64.5562V98.2126ZM64.5562 89.3039H69.642C70.3557 89.3039 70.9208 89.1239 71.3372 88.7639C71.7734 88.386 71.9915 87.891 71.9915 87.2791C71.9915 86.6672 71.7734 86.1813 71.3372 85.8213C70.9208 85.4434 70.3557 85.2544 69.642 85.2544H64.5562V89.3039Z'
                                    fill='black'
                                />
                                <path
                                    d='M89.284 102.181C87.5392 102.181 85.9827 101.848 84.6146 101.182C83.2465 100.516 82.1659 99.6075 81.3728 98.4556C80.5995 97.2858 80.2129 95.963 80.2129 94.4872V81.7449H84.8228V94.2172C84.8228 95.0091 85.0111 95.729 85.3879 96.3769C85.7844 97.0068 86.3198 97.5017 86.9939 97.8617C87.668 98.2216 88.4314 98.4016 89.284 98.4016C90.1564 98.4016 90.9198 98.2216 91.5741 97.8617C92.2482 97.5017 92.7736 97.0068 93.1504 96.3769C93.5469 95.729 93.7452 95.0091 93.7452 94.2172V81.7449H98.3551V94.4872C98.3551 95.963 97.9585 97.2858 97.1654 98.4556C96.3922 99.6075 95.3215 100.516 93.9534 101.182C92.5853 101.848 91.0288 102.181 89.284 102.181Z'
                                    fill='black'
                                />
                                <path d='M102.002 101.857V81.7449H105.542L117.438 95.972L115.535 96.3769V81.7449H120.145V101.857H116.576L104.887 87.5221L106.612 87.1171V101.857H102.002Z' fill='black' />
                                <path
                                    d='M124.076 101.857V81.7449H131.303C133.702 81.7449 135.784 82.1768 137.549 83.0407C139.313 83.9046 140.682 85.0924 141.653 86.6042C142.625 88.116 143.11 89.8438 143.11 91.7875C143.11 93.7313 142.625 95.468 141.653 96.9978C140.682 98.5096 139.313 99.6974 137.549 100.561C135.784 101.425 133.702 101.857 131.303 101.857H124.076ZM128.686 98.2126H131.422C132.869 98.2126 134.119 97.9517 135.169 97.4298C136.22 96.8898 137.033 96.1429 137.608 95.1891C138.203 94.2172 138.5 93.0833 138.5 91.7875C138.5 90.4737 138.203 89.3398 137.608 88.386C137.033 87.4321 136.22 86.6942 135.169 86.1723C134.119 85.6503 132.869 85.3894 131.422 85.3894H128.686V98.2126Z'
                                    fill='black'
                                />
                                <path d='M146.062 101.857V81.7449H160.963V85.3894H150.672V89.9518H160.368V93.5963H150.672V98.2126H160.963V101.857H146.062Z' fill='black' />
                                <path d='M163.576 101.857V81.7449H178.476V85.3894H168.186V89.9518H177.882V93.5963H168.186V98.2126H178.476V101.857H163.576Z' fill='black' />
                                <path d='M150.627 73.6199C133.586 69.01 122.085 64.09 113.728 64.043C110.573 63.9351 83.7299 72.9534 70.3504 73.6199C39.3663 71.0288 41.1972 51.3209 45.9856 41.7907C63.2241 16.3275 98.3299 25.1721 113.728 32.7772C127.474 36.7206 144.055 31.1342 150.627 27.848C180.147 16.6937 195.836 31.6882 195.836 41.7907C194.371 67.9301 165.087 73.9016 150.627 73.6199Z' fill='#F96435' />
                                <path d='M83.8708 15.1728C93.5603 11.9054 113.259 21.6982 121.897 27.0031C91.5886 15.1728 66.2191 21.7921 56.5484 27.0031H35.4229L56.5484 23.341C110.742 -13.2766 148.468 1.27686 161.331 12.9194C204.033 13.1447 205.789 34.3265 201.329 44.8893C204.484 21.9047 173.537 17.4732 157.669 18.1304C131.417 -3.05143 97.5319 7.3329 83.8708 15.1728Z' fill='#F96435' />
                                <path d='M97.3912 48.5887C89.9268 43.6124 72.4912 36.6458 62.4636 48.5887C65.6558 53.9405 77.1107 61.4331 97.3912 48.5887Z' fill='white' />
                                <path d='M142.741 49.0864C150.205 54.0627 167.641 61.0294 177.668 49.0864C174.476 43.7346 163.021 36.2421 142.741 49.0864Z' fill='white' />
                                <path d='M21.7987 35.0577L43.2568 32.6979V37.4175L40.8725 35.0579L21.7987 35.0577Z' fill='#F96435' />
                                <path d='M0 44.2786L39.5101 42.235V46.3223L35.1201 44.2788L0 44.2786Z' fill='#F96435' />
                            </svg>
                        </Link>
                    </div>

                    <div className='flex gap-3'>
                        {userLoggedin == false && (
                            <div className='fle'>
                                <Link href='/auth/login'>
                                    <Button onClick={setAuthSuccessURLHandler} variant='outline'>
                                        Login
                                    </Button>
                                </Link>

                                <Link href='/auth/signup'>
                                    <Button className='ml-4 bg-black'>Sign Up</Button>
                                </Link>
                            </div>
                        )}
                        {/* {userLoggedin == true && (
                            <div className="flex flex-col">
                                <p>Sundar Raj Sharma</p>
                                <p>sundarsharma469@gmail.com</p>
                            </div>
                        )} */}

                        <div className='z-50'>{userLoggedin == true && <NotificationPopoverItem />}</div>

                        {/* {userLoggedin == true && (
                            <img className=" border-spacing-0 shadow-md h-8 w-8 flex-none rounded-full bg-gray-50" src="/neutral_image_avatar.png" alt="" />
                        )} */}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button type='button' className='inline-flex p-2 text-black transition-all duration-200 rounded-md  focus:bg-gray-100 hover:bg-gray-100'>
                                    <svg className='block w-6 h-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 8h16M4 16h16' />
                                    </svg>

                                    <svg className='hidden w-6 h-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                                    </svg>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='w-56'>
                                <DropdownMenuLabel>Menu</DropdownMenuLabel>

                                <DropdownMenuSeparator />

                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <Link href='/' className='flex '>
                                            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className='w-4 h-4 mr-2'>
                                                <path strokeLinecap='round' strokeLinejoin='round' d='M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' />
                                            </svg>
                                            Home
                                        </Link>
                                    </DropdownMenuItem>

                                    {userLoggedin && (
                                        <DropdownMenuItem>
                                            <Link href='/profile' className='flex '>
                                                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1} stroke='currentColor' className='w-4 h-4 mr-2'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z' />
                                                </svg>
                                                Profile
                                            </Link>
                                        </DropdownMenuItem>
                                    )}

                                    {userLoggedin && (
                                        <DropdownMenuItem>
                                            <Link href='/trips' className='flex '>
                                                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className='w-4 h-4 mr-2'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12' />
                                                </svg>
                                                Trips
                                            </Link>
                                        </DropdownMenuItem>
                                    )}

                                    {userLoggedin && (
                                        <DropdownMenuItem>
                                            <Link href='/wishlists' className='flex '>
                                                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className='w-4 h-4 mr-2'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' />
                                                </svg>
                                                Wishlist
                                            </Link>
                                        </DropdownMenuItem>
                                    )}

                                    <DropdownMenuItem>
                                        <Link href='/terms' className='flex '>
                                            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-4 h-4 mr-2'>
                                                <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' />
                                            </svg>
                                            Terms & conditions
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem>
                                        <Link href='/terms' className='flex '>
                                            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-4 h-4 mr-2'>
                                                <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' />
                                            </svg>
                                            FAQ's
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link href='/privacy' className='flex '>
                                            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className='w-4 h-4 mr-2'>
                                                <path strokeLinecap='round' strokeLinejoin='round' d='M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' />
                                            </svg>
                                            Privacy Policy
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>

                                <DropdownMenuSeparator />

                                {userLoggedin && (
                                    <button onClick={firebaseLogoutHandler}>
                                        <DropdownMenuItem>
                                            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className='w-4 h-4 mr-2 '>
                                                <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75' />
                                            </svg>
                                            Log out
                                        </DropdownMenuItem>
                                    </button>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
