
import React, { useEffect, useState } from 'react'
import MenuItem from '../Menu/MenuItem';
import Image from 'next/image'
import { USER_TIER } from '@/constants/enum'
import { useDataStore } from "@/stores/dataStore";

type NavbarProps = {
  id?: number;
};

function Navbar({ id }: NavbarProps) {

  const userData = useDataStore((state: { userData: any; }) => state.userData);
  const user_tier = userData.user_tier;

  const path = "/bu";
  const allMenu = [
    { id: 1, icon: "/icons/home.svg", text: "Dashboard", link: `${path}` },
    { id: 2, icon: "/icons/ticket.svg", text: "Sell Ticket", link: "" },
    {
      id: 3,
      icon: "/icons/route.svg",
      text: "Manage Routes",
      link: `${path}/manage-route`,
    },
    {
      id: 4,
      icon: "/icons/ticket.svg",
      text: "Manage Tickets",
      link: `${path}/manage-ticket`,
    },
    {
      id: 5,
      icon: "/icons/route.svg",
      text: "Manage Location",
      link: `${path}/manage-location`,
    },
    {
      id: 6,
      icon: "/icons/time.svg",
      text: "Manage Times",
      link: `${path}/manage-times`,
    },
    {
      id: 7,
      icon: "/icons/date.svg",
      text: "Manage Date",
      link: `${path}/manage-dates`,
    },
    {
      id: 8,
      icon: "/icons/users.svg",
      text: "Manage Members",
      link: `${path}/manage-members`,
    },
    { id: 9, icon: "/icons/report.svg", text: "Reports", link: "" },
    { id: 10, icon: "/icons/company.svg", text: "Manage Company", link: "" },
  ];

  const [roleMenu, setRoleMenu] = useState<number[]>();

  useEffect(() => {
    if (user_tier === USER_TIER.ADMIN) {
      setRoleMenu([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    } else if (user_tier === USER_TIER.SUPER_ADMIN) {
      setRoleMenu([1, 2, 3, 4, 7, 8, 10]);
    }
  }, [user_tier]);

  const menu = allMenu.filter((item) => roleMenu?.includes(item.id));

  return (
    <div className="w-[256px] flex-shrink-0 bg-white min-h-screen flex flex-col justify-between">
      <div>
        {/* header */}
        <div className="flex gap-2 items-center h-[64px] px-6 border-b-1 border-[#E5E7EB]">
          <Image src={"/logo.svg"} width={32} height={32} priority alt="logo" />
          <p className="font-bold">BusTicket</p>
        </div>
        {/* menu */}
        <div className="p-3 ">
          {menu.map((item, index) => (
            <MenuItem
              key={index}
              link={item.link}
              text={item.text}
              icon={item.icon}
              status={id === item?.id}
            />
          ))}
        </div>
      </div>
      {/* footer */}
      <div className="h-[60px] flex justify-between items-center px-5 border-t-1 border-[#E5E7EB]">
        <div className="cursor-pointer">
          <Image
            src={"/icons/mode-dark.svg"}
            priority
            width={18}
            height={18}
            alt="icon-menu"
          />
        </div>
        <div className="text-red-500 flex gap-1 items-center cursor-pointer">
          <Image
            src={"/icons/exit.svg"}
            priority
            width={18}
            height={18}
            alt="icon-menu"
          />
          <p className="text-xs text-[#DC2626]">Logout</p>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
