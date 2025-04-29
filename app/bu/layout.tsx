"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { USER_TIER } from "@/constants/enum";
import { XIcon, MenuIcon, LogOutIcon } from "lucide-react";
import MenuItemLink from "../components/Menu/MenuItem";
import { useUserStore } from "@/stores/userStore";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userData = useUserStore((state) => state.userData);
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
    { 
      id: 10, 
      icon: "/icons/company.svg",
      text: "Manage Company", 
      link: `${path}/manage-company`, 
    }
  ];

  const [roleMenu, setRoleMenu] = useState<number[]>();

  useEffect(() => {
    if (user_tier === USER_TIER.ADMIN) {
      setRoleMenu([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    } else if (user_tier === USER_TIER.SUPER_ADMIN) {
      setRoleMenu([1, 2, 3, 4, 7, 8, 10]);
    }
  }, [user_tier]);

  const menu = allMenu.filter((item) => roleMenu?.includes(item.id));

  return (
    <div className="flex h-screen bg-white ">
      <aside
        className={`fixed inset-y-0 left-0 z-10 w-64 transform bg-white  shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-gradient-to-r from-yellow-500 to-orange-500"></div>
            <span className="ml-2 text-lg font-semibold text-gray-800">
              BusTicket
            </span>
          </div>
          <button
            className="p-1 rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-orange-500"
            onClick={() => setSidebarOpen(false)}
          >
            <XIcon size={24} className="text-gray-500 " />
          </button>
        </div>
        <div className="px-3 py-4">
          <div className="space-y-1">
            {menu.map((item, index) => (
              <MenuItemLink
                key={index}
                link={item.link}
                text={item.text}
                icon={item.icon}
              />
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 w-full border-t border-gray-200   ">
          <div className="flex items-end justify-between px-4 py-3">
            <button>
              <LogOutIcon size={18} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </aside>
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <button
              className="p-1 rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-orange-500"
              onClick={() => setSidebarOpen(true)}
            >
              <MenuIcon size={24} className="text-gray-500 " />
            </button>
            <div className="flex items-center">
              <div className="relative">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-white font-medium">
                    {userData?.name.substring(0, 1).toUpperCase()}
                  </div>
                  <div className="hidden md:block">
                    <div className="text-sm font-medium text-black ">
                      {userData?.name}
                    </div>
                    <div className="text-xs text-gray-500  capitalize">
                      {userData?.user_tier}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-gray-100 ">
          <div className="container mx-auto px-4 sm:px-6 py-4 md:py-6">
            {children}
          </div>
        </main>
      </div>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-0 bg-gray-600 opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
