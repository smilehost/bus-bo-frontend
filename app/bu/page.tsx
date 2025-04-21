import React from 'react'
import MenuItem from '../components/Menu/MenuItem'
import Image from 'next/image'
function page() {

    const menu = [
        {
            icon: "/icons/home.svg",
            text: "Dashboard",
            link: ""
        },
        {
            icon: "/icons/home.svg",
            text: "Sell Ticket",
            link: ""
        },
        {
            icon: "/icons/home.svg",
            text: "Manage Routes",
            link: ""
        },
        {
            icon: "/icons/home.svg",
            text: "Manage Tickets",
            link: ""
        },
        {
            icon: "/icons/home.svg",
            text: "Manage Times",
            link: ""
        },
        {
            icon: "/icons/home.svg",
            text: "Manage Date",
            link: ""
        },
        {
            icon: "/icons/home.svg",
            text: "Manage Members",
            link: ""
        },
        {
            icon: "/icons/home.svg",
            text: "Reports",
            link: ""
        },
    ]

    return (
        <div>
            <div className='w-[256px] bg-white h-screen flex flex-col justify-between'>
                <div>
                    {/* header */}
                    <div className='flex gap-2 items-center h-[64px] px-6 border-b-1 border-[#E5E7EB]'>
                        <div className='w-[32px] h-[32px] rounded-lg bg-main' />
                        <p className='font-bold'>BusTicket</p>
                    </div>
                    {/* menu */}
                    <div className='p-3 '>
                        <MenuItem text='Dashboard' icon="/icons/home.svg" status={false} />
                        {menu.map((item, index) => (
                            <MenuItem key={index} text={item.text} icon={item.icon} status={false} />
                        ))}
                    </div>
                </div>
                {/* footer */}
                <div className='h-[60px] flex justify-between items-center px-5 border-t-1 border-[#E5E7EB]'>
                    <div>
                        <Image src={"/icons/home.svg"}
                            priority
                            width={18}
                            height={18}
                            alt='icon-menu' />
                    </div>
                    <div className='text-red-500 flex gap-1 items-center'>
                        <Image src={"/icons/home.svg"}
                            priority
                            width={18}
                            height={18}
                            alt='icon-menu' />
                        <p className='text-xs'>Logout</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page
