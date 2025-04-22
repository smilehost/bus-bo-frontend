
import React, { useEffect, useState } from 'react'
import MenuItem from '../Menu/MenuItem';
import Image from 'next/image'
import { USER_TIER } from '@/constants/enum'
import { userData } from '@/provider/Provider';

function Navbar() {

  const user_tier = userData.user_tier;

  const allMenu = [
    { id: 1, icon: "/icons/home.svg", text: "Dashboard", link: "" },
    { id: 2, icon: "/icons/ticket.svg", text: "Sell Ticket", link: "" },
    { id: 3, icon: "/icons/route.svg", text: "Manage Routes", link: "" },
    { id: 4, icon: "/icons/ticket.svg", text: "Manage Tickets", link: "" },
    { id: 5, icon: "/icons/time.svg", text: "Manage Times", link: "" },
    { id: 6, icon: "/icons/date.svg", text: "Manage Date", link: "" },
    { id: 7, icon: "/icons/users.svg", text: "Manage Members", link: "" },
    { id: 8, icon: "/icons/report.svg", text: "Reports", link: "" },
    { id: 9, icon: "/icons/company.svg", text: "Manage Company", link: "" },
  ]

  const [roleMenu, setRoleMenu] = useState<number[]>()

  useEffect(() => {
    if (user_tier === USER_TIER.ADMIN) {
      setRoleMenu([1, 2, 3, 4, 5, 6, 7, 8])
    } else if (user_tier === USER_TIER.SUPER_ADMIN) {
      setRoleMenu([1, 2, 3, 4, 7, 8, 9])
    }
  }, [user_tier])

  const menu = allMenu.filter(item => roleMenu?.includes(item.id))

  return (
    <div className='w-[256px] flex-shrink-0 bg-white min-h-screen flex flex-col justify-between'>
      <div>
        {/* header */}
        <div className='flex gap-2 items-center h-[64px] px-6 border-b-1 border-[#E5E7EB]'>
          <div className='w-[32px] h-[32px] rounded-lg bg-main' />
          <p className='font-bold'>BusTicket</p>
        </div>
        {/* menu */}
        <div className='p-3 '>
          {menu.map((item, index) => (
            <MenuItem key={index} text={item.text} icon={item.icon} status={false} />
          ))}
        </div>
      </div>
      {/* footer */}
      <div className='h-[60px] flex justify-between items-center px-5 border-t-1 border-[#E5E7EB]'>
        <div>
          <Image src={"/icons/mode-dark.svg"}
            priority
            width={18}
            height={18}
            alt='icon-menu' />
        </div>
        <div className='text-red-500 flex gap-1 items-center'>
          <Image src={"/icons/exit.svg"}
            priority
            width={18}
            height={18}
            alt='icon-menu' />
          <p className='text-xs text-[#DC2626]'>Logout</p>
        </div>
      </div>
    </div>
  )
}

export default Navbar
