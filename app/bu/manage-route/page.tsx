"use client"

import React, { useState, useEffect } from 'react'
import { STATUS, FILTER } from '@/constants/enum'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'

//companent 
import TableRoute from '@/app/components/RoutePage/TableRoute'
import { ConfirmWithInput } from '@/app/components/Dialog/ConfirmWithInput'
import { Alert } from '@/app/components/Dialog/Alert'
import FormFilter from '@/app/components/Filter/FormFilter'
import TitlePageAndButton from '@/app/components/Title/TitlePageAndButton'

//mock
import { useCompanyStore } from '@/stores/companyStore'
import { useRouteStore } from '@/stores/routeStore'
import { useTicketStore } from '@/stores/routeTicketStore'
import { useTimeStore } from '@/stores/timeStore'
import { useScheduleStore } from '@/stores/scheduleStore'

//type
import { Route } from '@/types/types'

//toast
import { toast } from 'react-toastify'

function Page() {

    //mock
    // const { companyData, addCompany, updateCompany, deleteCompany } = useCompanyStore();
    const { companyData } = useCompanyStore();
    const { routeData, getRoutes, deleteRoute } = useRouteStore();
    const { ticketData } = useTicketStore();
    const { timeData } = useTimeStore();
    const { scheduleData } = useScheduleStore();

    const router = useRouter();
    const pathname = usePathname();

    const [routes, setRoutes] = useState<Route[]>(); // Data for routes
    const [searchStatus, setSearchStatus] = useState<string>(''); // Filter by status
    const [searchCompany, setSearchCompany] = useState<string>(''); // Filter by company
    const [search, setSearch] = useState<string>(''); // Search input

    const fetchRouteData = () => {
        getRoutes(1, 5, '');
    }
    useEffect(() => {
        fetchRouteData();
    }, []);

    useEffect(() => {
        setRoutes(routeData);
    }, [routeData]);

    // Function to create data for table
    const createData = (
        id: string,
        route: string,
        company: string,
        schedule: string,
        time: string,
        ticket_amount: string,
        status: STATUS,
        routeColor: string
    ) => {
        return { id, route, company, schedule, time, ticket_amount, status, routeColor };
    };

    // // Filter routes based on search values
    // const filteredRoutes = routes?.data?.filter((item) => {
    //     const company = companyData.find((com) => com.id === item.route_com_id)?.name || ''
    //     const matchesStatus = searchStatus && searchStatus !== FILTER.ALL_STATUS ? item.route_status === searchStatus : true;
    //     const matchesCompany = searchCompany && searchCompany !== FILTER.ALL_COMPANIES ? company.toLowerCase().includes(searchCompany.toLowerCase()) : true;
    //     const matchesSearch = search ? item.route.toLowerCase().includes(search.toLowerCase()) : true;

    //     return matchesStatus && matchesCompany && matchesSearch;
    // });


    // Generate rows for table
    const rows = routes?.data?.map((item) => {
        // //schedule 
        // const scheduleId = item.schedule_id
        // const realSchedule = scheduleData.find((value) => value.id === scheduleId)?.name || ''

        // //schedule 
        // const companyId = item.company_id
        // const realCompany = companyData.find((value) => value.id === companyId)?.name || ''

        // //time 
        // const timeId = item.times_id
        // const realTimes = timeData.find((value) => value.id === timeId)?.times.join(', ') || ''

        // //ticket amount 
        // const realTicketAmount = ticketData.filter((value) => value.route_id === item.id).length.toString();
        return createData(
            item.route_id,
            item.route_name_en,
            item.route_com_id,
            "1",
            item.route_time_id,
            "2", //realTicketAmount
            item.route_status,
            item.route_color
        )
    })

    // Handle delete route
    const handleDeleteRoute = async ({ route, id }: { route: string, id: number }) => {
        const inputName = await ConfirmWithInput({
            title: `Delete "${route}"?`,
            text: `Please type the route name below to confirm deletion.`,
            confirmText: "Delete",
            cancelText: "Cancel",
            placeholder: "Type route name here"
        });

        if (inputName === route) {
            const result = await deleteRoute(id);

            if (result.success) {
                fetchRouteData();
                toast.success("delete route successfully!");
            } else {
                toast.error(`Error: ${result.message}`);
            }
        } else if (inputName !== null) {
            await Alert({
                title: "Name mismatch!",
                text: "The typed name does not match the route name.",
                type: "error"
            });
        }
    };

    const RedirectoAdd = () => {
        router.push(`${pathname}/add`)
    }

    //filter
    const listCompany = companyData.map((item) => item.name)
    const listStatus = [
        STATUS.ACTIVE,
        STATUS.INACTIVE,
        STATUS.CANCELLED
    ]

    const filterSearch = [
        {
            defaulteValue: FILTER.ALL_STATUS,
            listValue: listStatus,
            setSearchValue: setSearchStatus,
            size: "w-[130px]"
        },
        {
            defaulteValue: FILTER.ALL_COMPANIES,
            listValue: listCompany,
            setSearchValue: setSearchCompany,
            size: "w-[170px]"
        },
    ]

    return (
        <>
            <TitlePageAndButton title='Manage Routes' description='View and manage bus routes' btnText='Add New Route' handleOpenModel={RedirectoAdd} />
            <FormFilter setSearch={setSearch} placeholderSearch='Search routes...' filter={filterSearch} />
            <div className='bg-white rounded-lg shadow-xs mt-5 flex items-center overflow-hidden'>
                <TableRoute rows={rows} handleDeleteRoute={handleDeleteRoute} />
            </div>
        </>
    )
}

export default Page
