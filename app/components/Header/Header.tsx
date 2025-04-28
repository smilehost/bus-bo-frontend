import React from 'react'
import { useDataStore } from "@/stores/appStore";
import Profile from '../Profile'

function Header() {

    const userData = useDataStore(state => state.userData);

    const name = userData.name
    const user_tier = userData.user_tier

    return (
        <div className='flex gap-3 items-center h-[64px] px-7 bg-white'>
            <Profile size='w-[32px] h-[32px]' charactor={name[0]} />
            <div className='flex flex-col '>
                <p className='text-[12px]'>{name}</p>
                <p className='text-[10px] text-[#6B7280]'>{user_tier}</p>
            </div>
        </div>
    )
}

export default Header
