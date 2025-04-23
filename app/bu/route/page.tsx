"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { STATUS, FILTER } from '@/constants/enum'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'

//sweet alert
import Swal from 'sweetalert2'

//companent 
import SelectFilter from '@/app/components/RoutePage/SelectFilter'
import ButtonBG from '@/app/components/Form/ButtonBG'
import TableRoute from '@/app/components/RoutePage/TableRoute'
import Navbar from '@/app/components/Navbar/Navbar'
import Header from '@/app/components/Header/Header'
import Title from '@/app/components/Title'

//mock
import { companyData, routeData } from '@/provider/Provider'

function Page() {

    const router = useRouter();
    const pathname = usePathname();

    const listCompany = companyData.map((item) => item.name)
    const listStatus = [
        STATUS.ACTIVE,
        STATUS.INACTIVE
    ]


    const [routes, setRoutes] = useState(routeData); // Data for routes
    const [searchStatus, setSearchStatus] = useState<string>(''); // Filter by status
    const [searchCompany, setSearchCompany] = useState<string>(''); // Filter by company
    const [search, setSearch] = useState<string>(''); // Search input

    // Function to create data for table
    const createData = (
        route: string,
        company: string,
        schedule: string,
        time: string,
        status: string,
        routeColor: string
    ) => {
        return { route, company, schedule, time, status, routeColor };
    };

    // Filter routes based on search values
    const filteredRoutes = routes.filter((item) => {
        const matchesStatus = searchStatus && searchStatus !== FILTER.ALL_STATUS ? item.status === searchStatus : true;
        const matchesCompany = searchCompany && searchCompany !== FILTER.ALL_COMPANIES ? item.company.toLowerCase().includes(searchCompany.toLowerCase()) : true;
        const matchesSearch = search ? item.route.toLowerCase().includes(search.toLowerCase()) : true;

        return matchesStatus && matchesCompany && matchesSearch;
    });


    // Generate rows for table
    const rows = filteredRoutes.map((item) => {
        return createData(
            item.route,
            item.company,
            item.schedule,
            item.times.join(', '),
            item.status,
            item.routeColor
        );
    });

    // Handle delete route
    const handleDeleteRoute = ({ route, index }: { route: string, index: number }) => {
        Swal.fire({
            title: "Are you sure?",
            text: `Do you want delete ${route}!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                });
                setRoutes(prev => prev.filter((_, i) => i !== index)); // Remove route by index
            }
        });
    };

    const RedirectoAdd = () => {
        router.push(`${pathname}/add`)
    }
    
    return (
        <div className='flex'>
            <Navbar id={3} />
            <div className='w-full'>
                <Header />
                <div className='p-7'>
                    <div className='flex justify-between items-end'>
                        <Title title="Manage Routes" description="View and manage bus routes" />
                        <ButtonBG size='h-[38px]' text='Add New Route' icon='/icons/plus.svg' onClick={RedirectoAdd} />
                    </div>
                    <div className='bg-white rounded-lg shadow-xs mt-5 p-3 flex items-center'>
                        <div className='flex-1'>
                            <input
                                type="text"
                                className='rounded-lg border-[#D1D5DB] border-1 h-[38px] px-5 w-full'
                                placeholder='Search routes...'
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className='flex items-center mx-4 gap-2'>
                            <Image
                                src={"/icons/filter.svg"}
                                width={18}
                                height={18}
                                priority
                                alt='icon'
                            />
                            <p className='text-[12px] text-[#6B7280]'>Filters:</p>
                        </div>
                        <div className='flex gap-3'>
                            <SelectFilter width='w-[130px]' defaultValue={FILTER.ALL_STATUS} listValue={listStatus} onChange={(e) => setSearchStatus(e.target.value)} />
                            <SelectFilter width='w-[170px]' defaultValue={FILTER.ALL_COMPANIES} listValue={listCompany} onChange={(e) => setSearchCompany(e.target.value)} />
                        </div>
                    </div>
                    <div className='bg-white rounded-lg shadow-xs mt-5 flex items-center overflow-hidden'>
                        <TableRoute rows={rows} handleDeleteRoute={handleDeleteRoute} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page
