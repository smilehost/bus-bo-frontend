import React, { useEffect, useState } from 'react'
import MenuItem from '../Menu/MenuItem';
import Image from 'next/image'
import { USER_TIER } from '@/constants/enum'
import { userData } from '@/provider/Provider';
import { useRouter, usePathname } from 'next/navigation';

<<<<<<< HEAD
function Navbar() {
  const router = useRouter();
  const pathname = usePathname(); // เพิ่มการใช้ usePathname เพื่อรับ path ปัจจุบัน
=======
type NavbarProps = {
  id?: number
}

function Navbar({ id }: NavbarProps) {

>>>>>>> 134f96cabf407a9290194d8070608e6ce8b8c93a
  const user_tier = userData.user_tier;

  const path = "/bu"
  const allMenu = [
<<<<<<< HEAD
    { id: 1, icon: "/icons/home.svg", text: "Dashboard", link: "/bu/dashboard" },
    { id: 2, icon: "/icons/ticket.svg", text: "Sell Ticket", link: "/bu/sell-ticket" },
    { id: 3, icon: "/icons/route.svg", text: "Manage Routes", link: "/bu/manage-routes" },
    { id: 4, icon: "/icons/ticket.svg", text: "Manage Tickets", link: "/bu/manage-tickets" },
    { id: 5, icon: "/icons/time.svg", text: "Manage Times", link: "/bu/manage-times" },
    { id: 6, icon: "/icons/date.svg", text: "Manage Date", link: "/bu/manage-dates" },
    { id: 7, icon: "/icons/users.svg", text: "Manage Members", link: "/bu/manage-members" },
    { id: 8, icon: "/icons/report.svg", text: "Reports", link: "/bu/report" },
    { id: 9, icon: "/icons/company.svg", text: "Manage Company", link: "/bu/manage-company" },
    { id: 10, icon: "/icons/route.svg", text: "Manage Location", link: "/bu/manage-location" },
    
=======
    { id: 1, icon: "/icons/home.svg", text: "Dashboard", link: `${path}` },
    { id: 2, icon: "/icons/ticket.svg", text: "Sell Ticket", link: "" },
    { id: 3, icon: "/icons/route.svg", text: "Manage Routes", link: `${path}/manage-route` },
    { id: 4, icon: "/icons/ticket.svg", text: "Manage Tickets", link: `${path}/manage-ticket` },
    { id: 5, icon: "/icons/time.svg", text: "Manage Times", link: "" },
    { id: 6, icon: "/icons/date.svg", text: "Manage Date", link: "" },
    { id: 7, icon: "/icons/users.svg", text: "Manage Members", link: `${path}/manage-members` },
    { id: 8, icon: "/icons/report.svg", text: "Reports", link: "" },
    { id: 9, icon: "/icons/company.svg", text: "Manage Company", link: "" },
>>>>>>> 134f96cabf407a9290194d8070608e6ce8b8c93a
  ]

  const [roleMenu, setRoleMenu] = useState<number[]>()

  useEffect(() => {
    if (user_tier === USER_TIER.ADMIN) {
      setRoleMenu([1, 2, 3, 4, 5, 6, 7, 8, 10])
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
          <Image
            src={"/logo.svg"}
            width={32}
            height={32}
            priority
            alt='logo'
          />
          <p className='font-bold'>BusTicket</p>
        </div>
        {/* menu */}
        <div className='p-3 '>
          {menu.map((item, index) => (
<<<<<<< HEAD
            <MenuItem
              key={index}
              text={item.text}
              icon={item.icon}
              status={pathname === item.link} // ตรวจสอบว่า path ปัจจุบันตรงกับ link ของเมนูหรือไม่
              onClick={() => router.push(item.link)}
            />
=======
            <MenuItem key={index} link={item.link} text={item.text} icon={item.icon} status={id === item?.id} />
>>>>>>> 134f96cabf407a9290194d8070608e6ce8b8c93a
          ))}
        </div>
      </div>
      {/* footer */}
      <div className='h-[60px] flex justify-between items-center px-5 border-t-1 border-[#E5E7EB]'>
<<<<<<< HEAD
        <div>
          <Image src={"/icons/mode-dark.svg"} priority width={18} height={18} alt='icon-menu' />
        </div>
        <div className='text-red-500 flex gap-1 items-center'>
          <Image src={"/icons/exit.svg"} priority width={18} height={18} alt='icon-menu' />
=======
        <div className='cursor-pointer'>
          <Image src={"/icons/mode-dark.svg"}
            priority
            width={18}
            height={18}
            alt='icon-menu' />
        </div>
        <div className='text-red-500 flex gap-1 items-center cursor-pointer'>
          <Image src={"/icons/exit.svg"}
            priority
            width={18}
            height={18}
            alt='icon-menu' />
>>>>>>> 134f96cabf407a9290194d8070608e6ce8b8c93a
          <p className='text-xs text-[#DC2626]'>Logout</p>
        </div>
      </div>
    </div>
  )
}

export default Navbar