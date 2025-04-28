"use client"

import React from 'react'
import Navbar from '@/app/components/Navbar/Navbar'
import Header from '@/app/components/Header/Header'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex h-screen">
        <Navbar />
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <Header />
  
          {/* Main Content */}
          <main className="flex-1 overflow-auto p-7 bg-gray-100">
            {children}
          </main>
        </div>
      </div>
    );
  }
  