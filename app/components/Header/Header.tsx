import React from 'react'
import { userData } from '@/provider/Provider'
function Header() {

    return (
        <div className='flex gap-3 items-center h-[64px] px-7 bg-white'>
            <div className='w-[32px] h-[32px] rounded-lg bg-main' />
            <div className='flex flex-col '>
                <p className='text-[12px]'>{userData.name}</p>
                <p className='text-[10px] text-[#6B7280]'>{userData.user_tier}</p>
            </div>
        </div>
    )
}

export default Header
