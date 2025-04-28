import React, { useEffect, useState } from "react";
import MenuItem from "../Menu/MenuItem";
import Image from "next/image";
import { USER_TIER } from "@/constants/enum";
import { XIcon, MenuIcon } from "lucide-react"; 
import { useDataStore } from "@/stores/appStore";

type NavbarProps = {
  id?: number;
};

function Navbar({ id }: NavbarProps) {

  const userData = useDataStore((state: { userData: any; }) => state.userData);
  const user_tier = userData.user_tier;
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="flex h-screen bg-white border-r border-[#E5E7EB]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 w-[256px] transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 h-[64px] px-6 border-b border-[#E5E7EB]">
              <Image src="/logo.svg" width={32} height={32} priority alt="logo" />
              <p className="font-bold text-gray-800">BusTicket</p>
              {/* Close button */}
              <button
                className="ml-auto p-1 rounded-md lg:hidden focus:outline-none"
                onClick={() => setSidebarOpen(false)}
              >
                <XIcon size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Menu */}
            <div className="p-3 space-y-1">
              {menu.map((item, index) => (
                <MenuItem
                  key={index}
                  link={item.link}
                  text={item.text}
                  icon={item.icon}
                  // status={id === item?.id}
                />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-[#E5E7EB] flex items-center justify-between h-[60px] px-5">
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Image
                src="/icons/mode-dark.svg"
                width={18}
                height={18}
                priority
                alt="dark-mode"
              />
            </button>
            <button className="flex items-center text-xs font-medium text-[#DC2626] hover:bg-red-50 rounded-lg px-4 py-2">
              <Image
                src="/icons/exit.svg"
                width={18}
                height={18}
                priority
                alt="logout"
                className="mr-2"
              />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center justify-between h-[64px] lg:hidden px-4 sm:px-6">
          {/* Open sidebar button */}
          <button
            className="block lg:hidden p-1 rounded-md focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon size={24} className="text-gray-500" />
          </button>
        </div>
      </div>


      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-gray-600 opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default Navbar;
