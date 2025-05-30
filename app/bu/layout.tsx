"use client";

import React, { useEffect, useState } from "react";
import { XIcon, MenuIcon, LogOutIcon } from "lucide-react";
import MenuItemLink from "../components/Menu/MenuItem";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
} from 'lucide-react'

//component
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { Confirm } from "../components/Dialog/Confirm";

//store
import { useUserStore } from "@/stores/userStore";

//enum
import { USER_TIER } from "@/constants/enum";


export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [hasMounted, setHasMounted] = useState(false);
    const { userData } = useUserStore();

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const account_role = userData.account_role;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const allMenu = [
        {
            id: 1,
            icon: House,
            text: "Dashboard",
            link: `dashboard`,
        },
        {
            id: 2,
            icon: Ticket,
            text: "Sell Ticket",
            link: "sell-ticket",
        },
        {
            id: 3,
            icon: Route,
            text: "Manage Routes",
            link: "manage-route",
        },
        {
            id: 4,
            icon: Ticket,
            text: "Manage Route Ticket",
            link: "manage-ticket",
        },
        {
            id: 5,
            icon: Map,
            text: "Manage Location",
            link: "manage-location",
        },
        {
            id: 6,
            icon: Clock,
            text: "Manage Times",
            link: "manage-times",
        },
        {
            id: 7,
            icon: Calendar,
            text: "Manage Date",
            link: "manage-dates",
        },
        {
            id: 8,
            icon: Users,
            text: "Manage Employees",
            link: "manage-members",
        },
        {
            id: 11,
            icon: DollarSign,
            text: "Manage Promotion",
            link: "manage-price-type",
        },
        {
            id: 9,
            icon: FileBarChart,
            text: "Reports",
            link: "reports",
        },
        {
            id: 10,
            icon: Building,
            text: "Manage Company",
            link: "manage-company",
        },
    ];

    const [roleMenu, setRoleMenu] = useState<number[]>();
    const logOut = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    useEffect(() => {
        if (account_role === 2) {
            // setRoleMenu([1, 2, 3, 4, 5, 6, 7, 8, 9, 11]);
            setRoleMenu([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 10, 8]);
        } else if (account_role === 1) {
            // setRoleMenu([1, 10, 8]);
            setRoleMenu([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 10, 8]);
        }
    }, [account_role]);

    const menu = allMenu.filter((item) => roleMenu?.includes(item.id));
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
                        <span className="ml-2 text-lg font-semibold text-gray-800">BusTicket</span>
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
                        <div className="flex items-center">
                            <div className="relative">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-full custom-bg-main flex items-center justify-center text-white font-medium">
                                        {userData?.name.substring(0, 1).toUpperCase()}
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="text-sm font-medium text-black ">
                                            {userData?.name}
                                        </div>
                                        <div className="text-xs text-gray-500  capitalize">
                                            {userData.account_role === 2 ? USER_TIER.SUPER_ADMIN : USER_TIER.ADMIN}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-auto bg-gray-100 ">
                    <div className="container mx-auto px-4 sm:px-6 ">
                        <div className="mt-3">
                            <Breadcrumb />
                        </div>
                        <div className="py-4 md:py-6">
                            {children}
                        </div>
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
