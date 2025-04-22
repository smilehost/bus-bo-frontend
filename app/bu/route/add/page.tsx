"use client"

import React, { useState } from 'react'
import Navbar from '@/app/components/Navbar/Navbar'
import Header from '@/app/components/Header/Header'
import InputLabel from '@/app/components/Form/InputLabel'

function Page() {
    const [routeName, setRouteName] = useState<string>()

    console.log(routeName)
    return (
        <div className='flex'>
            <Navbar id={3} />
            <div className='w-full'>
                <Header />
                <div className='p-7 '>
                    <p className='text-[20px] font-bold'>Add New Route</p>
                    <div className='bg-white p-4 rounded-lg mt-5 w-full'>
                        <div className=' flex justify-center my-3'>
                            <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-x-6 lg:gap-x-30 gap-y-5">
                                <InputLabel
                                    label="Route Name"
                                    placeholder="Enter route name"
                                    type="text"
                                    setValue={setRouteName}
                                    size='w-[400px]'
                                />
                                <InputLabel
                                    label="Route Name"
                                    placeholder="Enter route name"
                                    type="text"
                                    setValue={setRouteName}
                                    size='w-[400px]'
                                />
                                <InputLabel
                                    label="Route Name"
                                    placeholder="Enter route name"
                                    type="text"
                                    setValue={setRouteName}
                                    size='w-[400px]'
                                />
                                <InputLabel
                                    label="Route Name"
                                    placeholder="Enter route name"
                                    type="text"
                                    setValue={setRouteName}
                                    size='w-[400px]'
                                />
                            </div>
                        </div>

                        <div className='flex flex-col justify-center items-center mt-8'>
                            <p className='text-[16px] font-bold'>Stations</p>
                            <p className='text-[12px] text-[#6B7280]'>Add stations in order from start to end</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page
