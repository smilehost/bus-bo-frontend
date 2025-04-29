"use client"

import React, { useState } from 'react'
import { STATUS, FILTER } from '@/constants/enum'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'

//companent 
import TableRoute from '@/app/components/RoutePage/TableRoute'
import { confirmDialog } from '@/app/components/Dialog/Confirm'
import { Alert } from '@/app/components/Dialog/Alert'
import FormFilter from '@/app/components/Filter/FormFilter'
import TitlePageAndButton from '@/app/components/Title/TitlePageAndButton'

//mock
import { useCompanyStore } from '@/stores/companyStore'
import { useRouteStore } from '@/stores/routeStore'
import { useTicketStore } from '@/stores/ticketStore'
import { useTimeStore } from '@/stores/timeStore'
import { useScheduleStore } from '@/stores/scheduleStore'

function Page() {

    //mock
    // const { companyData, addCompany, updateCompany, deleteCompany } = useCompanyStore();
    const { companyData } = useCompanyStore();
    const { routeData } = useRouteStore();
    const { ticketData } = useTicketStore();
    const { timeData } = useTimeStore();
    const { scheduleData } = useScheduleStore();

    const router = useRouter();
    const pathname = usePathname();

    const [routes, setRoutes] = useState(routeData); // Data for routes
    const [searchStatus, setSearchStatus] = useState<string>(''); // Filter by status
    const [searchCompany, setSearchCompany] = useState<string>(''); // Filter by company
    const [search, setSearch] = useState<string>(''); // Search input

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

    // Filter routes based on search values
    const filteredRoutes = routes.filter((item) => {
        const company = companyData.find((com) => com.id === item.company_id)?.name || ''
        const matchesStatus = searchStatus && searchStatus !== FILTER.ALL_STATUS ? item.status === searchStatus : true;
        const matchesCompany = searchCompany && searchCompany !== FILTER.ALL_COMPANIES ? company.toLowerCase().includes(searchCompany.toLowerCase()) : true;
        const matchesSearch = search ? item.route.toLowerCase().includes(search.toLowerCase()) : true;

        return matchesStatus && matchesCompany && matchesSearch;
    });


    // Generate rows for table
    const rows = filteredRoutes.map((item) => {
        //schedule 
        const scheduleId = item.schedule_id
        const realSchedule = scheduleData.find((value) => value.id === scheduleId)?.name || ''

        //schedule 
        const companyId = item.company_id
        const realCompany = companyData.find((value) => value.id === companyId)?.name || ''

        //time 
        const timeId = item.times_id
        const realTimes = timeData.find((value) => value.id === timeId)?.times.join(', ') || ''


        //ticket amount 
        const realTicketAmount = ticketData.filter((value) => value.route_id === item.id).length.toString();

        return createData(
            item.id,
            item.route,
            realCompany,
            realSchedule,
            realTimes,
            realTicketAmount,
            item.status,
            item.routeColor
        )
    })

    // Handle delete route
    const handleDeleteRoute = async ({ route, index }: { route: string, index: number }) => {
        const confirmed = await confirmDialog({
            title: `Delete "${route}"?`,
            text: "Do you want to delete this route?",
            confirmText: "Delete",
            cancelText: "Cancel"
        })

        if (confirmed) {
            setRoutes(prev => prev.filter((_, i) => i !== index))
            await Alert({
                title: "Deleted!",
                text: "The route has been deleted.",
                type: "success"
            })
        }
    }

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
            <TitlePageAndButton title='Manage Routes' description='View and manage bus routes' btnText='Add New Route' handleOpenModel={RedirectoAdd}/>
            <FormFilter setSearch={setSearch} placeholderSearch='Search routes...' filter={filterSearch} />
            <div className='bg-white rounded-lg shadow-xs mt-5 flex items-center overflow-hidden'>
                <TableRoute rows={rows} handleDeleteRoute={handleDeleteRoute} />
            </div>

        </>
    )
}

export default Page
