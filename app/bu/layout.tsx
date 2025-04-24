"use client"

import React from 'react'
import Navbar from '@/app/components/Navbar/Navbar'
import Header from '@/app/components/Header/Header'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex'>
            <Navbar />
            <div className='w-full'>
                <Header />
                <div className='p-7'>
                    {children}
                </div>
            </div>
        </div>
    )
}
