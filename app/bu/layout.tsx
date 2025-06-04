"use client";

import React, { useEffect, useState } from "react";
import { XIcon, MenuIcon, LogOutIcon } from "lucide-react";
import MenuItemLink from "../components/Menu/MenuItem";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//icon
import {
  House,
  Ticket,
  Map,
  Route,
  Clock,
  Calendar,
  Users,
  DollarSign,
  FileBarChart,
  Building,
} from "lucide-react";

//component
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { Confirm } from "../components/Dialog/Confirm";

//store
import { useUserStore } from "@/stores/userStore";

//enum
import { USER_TIER } from "@/constants/enum";
import { store } from "@/stores/store";
import { getTextMenu, useLanguageContext } from "../i18n/translations";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasMounted, setHasMounted] = useState(false);
  const { userData } = useUserStore();
  const lang = store.Translation.use(); // ✅ re-render เมื่อเปลี่ยนภาษา

  const setLang = (value: 'TH' | 'EN') => {
    if (value !== lang) {
      store.Translation.set(value);
    }
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const account_role = userData.account_role;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const toggleGroup = (groupName: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };
  const role = store.account_role.use();
  const { isTH, isSuperAdmin } = useLanguageContext();
  const menuText = getTextMenu({ isTH, isSuperAdmin });


  const allMenu = [
    {
      group: menuText.overview,
      items: [
        { id: 1, icon: House, text: menuText.dashboard, link: "dashboard" },
        { id: 9, icon: FileBarChart, text: menuText.reports, link: "reports" },
        { id: 2, icon: Ticket, text: menuText.sellTicket, link: "sell-ticket" },
      ],
    },
    {
      group: menuText.setup,
      items: [
        { id: 3, icon: Route, text: menuText.manageRoute, link: "manage-route" },
        { id: 4, icon: Ticket, text: menuText.manageTicket, link: "manage-ticket" },
      ],
    },
    {
      group: menuText.template,
      items: [
        { id: 5, icon: Map, text: menuText.manageLocation, link: "manage-location" },
        { id: 11, icon: DollarSign, text: menuText.managePromo, link: "manage-price-type" },
        { id: 7, icon: Calendar, text: menuText.manageDate, link: "manage-dates" },
        { id: 6, icon: Clock, text: menuText.manageTime, link: "manage-times" },
      ],
    },
    {
      group: menuText.users,
      items: [
        { id: 8, icon: Users, text: menuText.manageUser, href: "manage-members", as: isSuperAdmin ? "manage-admin" : "manage-employee", },
        { id: 10, icon: Building, text: menuText.manageCompany, link: "manage-company", },
      ],
    },
  ];



  const [roleMenu, setRoleMenu] = useState<number[]>();
  const logOut = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  useEffect(() => {
    if (account_role === 1) {
      setRoleMenu([1, 2, 3, 4, 5, 6, 7, 8, 9, 11]);
    } else if (account_role === 2) {
      // setRoleMenu([1, 10, 8]);
      setRoleMenu([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 10, 8]);
    }
  }, [account_role]);

  const filteredMenu = allMenu
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => roleMenu?.includes(item.id)),
    }))
    .filter((group) => group.items.length > 0);

  // const MenuList = React.memo(function MenuList({ menu }: { menu: MenuItem[] })

  if (!hasMounted) return null;
  return (
    <div className="flex h-screen bg-white ">
      <ToastContainer />
      <aside
        className={`fixed inset-y-0 left-0 z-10 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out 
    flex flex-col
    lg:translate-x-0 lg:static lg:inset-0 
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white shrink-0">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-md custom-bg-main"></div>
            <span className="ml-2 text-lg font-semibold text-gray-800">
              BusTicket
            </span>
          </div>
          <button
            className="p-1 rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-orange-500"
            onClick={() => setSidebarOpen(false)}
          >
            <XIcon size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Menu with scroll */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-4">
            {filteredMenu.map((group, index) => {
              const isOpen = openGroups[group.group] ?? true; // default open
              return (
                <div key={index}>
                  {/* Group Title with toggle */}
                  <button
                    onClick={() => toggleGroup(group.group)}
                    className="w-full flex justify-between items-center py-2 bg-gray-100 rounded-sm px-2 hover:bg-gray-200 transition cursor-pointer"
                  >
                    <span className="text-xs text-black font-semibold uppercase">
                      {group.group}
                    </span>
                    <svg
                      className={`w-4 h-4 transform transition-transform duration-200 ${
                        isOpen ? "rotate-90" : "rotate-0"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Group Items (toggle visibility) */}
                  {isOpen && (
                    <div className="space-y-1 mt-1">
                    {group.items.map((item) => (
                      <MenuItemLink
                        key={item.id}
                        text={item.text}
                        icon={item.icon}
                        href={item.href ?? `/bu/${item.link}`} // ✅ ใช้ href ถ้ามี, ไม่งั้นใช้ link
                        as={item.as ? `/bu/${item.as}` : undefined} // ✅ สร้าง as path ถ้ามี
                      />
                    ))}
                  </div>

                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 shrink-0">
          <div className="flex items-end justify-end px-4 py-3">
            <button
              onClick={async () => {
                const confirmed = await Confirm({
                  title: "Are you sure?",
                  text: "Do you want to log out?",
                  confirmText: "Confirm",
                  cancelText: "Cancel",
                  type: "question",
                });

                if (confirmed) {
                  logOut();
                }
              }}
              className="flex items-center text-sm text-gray-700 hover:text-orange-600 cursor-pointer"
            >
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
            <div className="flex items-center space-x-4 w-full">
              <div className="relative flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full custom-bg-main flex items-center justify-center text-white font-medium">
                  {userData?.name.substring(0, 1).toUpperCase()}
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-black">
                    {userData?.name}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {userData.account_role === 2
                      ? USER_TIER.SUPER_ADMIN
                      : USER_TIER.ADMIN}
                  </div>
                </div>
              </div>

              {/* ปุ่มเปลี่ยนภาษา */}
              <div className="flex gap-2 ml-auto">
                {['TH', 'EN'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setLang(item as 'TH' | 'EN')}
                    className={`px-3 py-1.5 text-sm rounded-md border cursor-pointer
                      ${lang === item ? 'bg-orange-500 text-white ring-2 ring-orange-500' : 'text-gray-600 bg-white'} 
                      transition focus:outline-none`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-gray-100 ">
          <div className="container mx-auto px-4 sm:px-6 ">
            <div className="mt-3">
              <Breadcrumb />
            </div>
            <div className="py-4 md:py-6">{children}</div>
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
