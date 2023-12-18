import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Head from './head';
import DownloadBanner from '@/components/DownloadBanner';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'MyBundee',
    description: '',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en'>
            <Head />
            <body className={` ${inter.className} flex flex-col  w-full min-h-screen`}>
                <DownloadBanner />

                <Navbar />
                {children}
                <Toaster />
                <Footer />
            </body>
        </html>
    );
}
