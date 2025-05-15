"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { debounce } from "@/utils/debounce";
import Link from 'next/link'
import Image from 'next/image'

//companent 
import { ConfirmWithInput } from '@/app/components/Dialog/ConfirmWithInput'
import { Alert } from '@/app/components/Dialog/Alert'
import FormFilter from '@/app/components/Filter/FormFilter'
import TitlePageAndButton from '@/app/components/Title/TitlePageAndButton'
import TableTemplate, { ColumnConfig } from '@/app/components/Table/TableTemplate'
import StatusText from '@/app/components/StatusText'
import SkeletonRoute from '@/app/components/Skeleton/SkeletonRoute'
import { withSkeletonDelay } from '@/app/components/Skeleton/withSkeletonDelay'

//api
// import { useCompanyStore } from '@/stores/companyStore'
import { useRouteStore } from '@/stores/routeStore'
import { useDateStore } from '@/stores/dateStore'
import { useTimeStore } from '@/stores/timeStore'
import { useTicketStore } from '@/stores/routeTicketStore'

//toast
import { toast } from 'react-toastify'

//const 
import { statusOptions } from '@/constants/options'
import { STATUS, FILTER } from '@/constants/enum'
import { Confirm } from '@/app/components/Dialog/Confirm';

export interface RouteTableData {
  id: string,
  route: string,
  company: string,
  schedule: string,
  time: string,
  ticket_amount: string,
  status: STATUS,
  routeColor: string
}

function Page() {

  //api
  // const { companyData } = useCompanyStore();
  const { routeData, getRoutes, deleteRoute, updateRouteStatus } = useRouteStore();
  const { times, getTimes } = useTimeStore();
  const { dates, getDates } = useDateStore();
  const { getTicketByRouteId } = useTicketStore();

  const router = useRouter();
  const pathname = usePathname();

  const [searchStatus, setSearchStatus] = useState<string>(''); // Filter by status
  // const [searchCompany, setSearchCompany] = useState<string>(''); // Filter by company
  const [search, setSearch] = useState<string>(''); // Search input
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoadingskeleton, setIsLoadingskeleton] = useState(false);

  //fetch routes from store
  const fetchRouteData = async () => {
    const cancelSkeleton = withSkeletonDelay(setIsLoadingskeleton);
    await getRoutes(currentPage, rowsPerPage, debouncedSearch, searchStatus);
    cancelSkeleton();
  }
  //fetch dates, times from store
  useEffect(() => {
    getDates(1, 9999, '');
    getTimes(1, 9999, '');
  }, [])

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    setRowsPerPage(newSize);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchRouteData();
  }, [currentPage, rowsPerPage]);

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
  ): RouteTableData => {
    return { id, route, company, schedule, time, ticket_amount, status, routeColor };
  };

  // Generate rows for table
  const [rows, setRows] = useState<RouteTableData[]>([]);
  useEffect(() => {
    const isReady = routeData?.data?.length && dates.length && times.length;
    if (!isReady) {
      setRows([])
      return
    };
    const fetchWithTicketCounts = async () => {
      const newRows = await Promise.all(
        routeData.data.map(async (item) => {
          const dateName = dates.find(d => d.id === Number(item.route_date_id))?.name || '';
          const timeName = times.find(t => t.id === Number(item.route_time_id))?.schedule.join(', ') || '';

          const tickets = await getTicketByRouteId(Number(item.route_id));
          const ticketAmount = tickets?.length?.toString() || '0';

          return createData(
            item.route_id,
            item.route_name_en,
            item.route_com_id,
            dateName,
            timeName,
            ticketAmount,
            item.route_status,
            item.route_color
          );
        })
      );
      setRows(newRows);
    };
    fetchWithTicketCounts();
  }, [routeData?.data, dates, times]);

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

  // Handle Change Status
  const handleChangeStatus = async ({ idStatus, idRoute }: { idStatus: string, idRoute: number }) => {
    const currentStatus = Number(idStatus);
    const nextStatus = currentStatus === 1 ? 2 : 1;
    const statusText = nextStatus === 1 ? "Active" : "Inactive";

    const isStatusConfirmed = await Confirm({
      title: "Change Status?",
      text: `Do you want to change the status to "${statusText}"`,
      confirmText: "Confirm",
      cancelText: "Cancel",
    });

    if (isStatusConfirmed) {
      const result = await updateRouteStatus(idRoute, nextStatus);
      if (result.success) {
        toast.success("Change status sucessfuly!")
        fetchRouteData();
      } else {
        toast.error(`Change status error: ${result.message}`)
      }
    }
  };

  const RedirectoAdd = () => {
    router.push(`${pathname}/add`)
  }

  //filter
  // const listCompany = companyData.map((item) => {
  //     return {
  //         key: 1,
  //         value: item.name
  //     }
  // })
  const filterSearch = [
    {
      defaulteValue: FILTER.ALL_STATUS,
      listValue: statusOptions,
      setSearchValue: setSearchStatus,
      size: "w-[130px]"
    },
    // {
    //     defaulteValue: FILTER.ALL_COMPANIES,
    //     listValue: listCompany,
    //     setSearchValue: setSearchCompany,
    //     size: "w-[170px]"
    // },
  ]

  //search
  useEffect(() => {
    if (!debouncedSearch) {
      fetchRouteData();
    };
    getRoutes(currentPage, rowsPerPage, debouncedSearch, searchStatus);
  }, [debouncedSearch, searchStatus])

  const debouncedFetch = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 350),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debouncedFetch(e.target.value);
  };

  //table columns
  const columns: ColumnConfig<RouteTableData>[] = [
    {
      key: 'route',
      label: 'Route',
      width: '25%',
      render: (_, row) => (
        <div className='flex gap-3 items-center'>
          <div className='w-[8px] h-[32px] rounded-lg flex-shrink-0' style={{ backgroundColor: row.routeColor }} />
          <p className='whitespace-nowrap custom-ellipsis-style'>{row.route}</p>
        </div>
      ),
    },
    // { key: 'company', label: 'Company', width: '20%' },
    { key: 'schedule', label: 'Schedule', width: '20%' },
    { key: 'time', label: 'Departure Times', width: '20%' },
    { key: 'ticket_amount', label: 'Tickets', width: '15%', align: 'center' },
    {
      key: 'status',
      label: 'Status',
      width: '15%',
      render: (_, row) => (
        <div className='cursor-pointer' onClick={() => handleChangeStatus({ idStatus: String(row.status), idRoute: Number(row.id) })}>
          <StatusText id={Number(row.status)} />
        </div>
      ),
    },
    {
      key: 'id',
      label: 'Action',
      width: '25%',
      render: (_, row) => (
        <div className='flex gap-2 min-w-max'>
          <Link href={`${pathname}/routeTicket/${row?.id}`} className='cursor-pointer'>
            <Image
              src={"/icons/money.svg"}
              width={1000}
              height={1000}
              alt='icon'
              priority
              className='w-[16px] h-[16px]'
            />
          </Link>
          <Link href={`${pathname}/edit/${row?.id}`} className='cursor-pointer'>
            <Image
              src={"/icons/edit.svg"}
              width={1000}
              height={1000}
              alt='icon'
              priority
              className='w-[16px] h-[16px]'
            />
          </Link>
          <div onClick={() => handleDeleteRoute({ route: row?.route, id: Number(row?.id) })} className='cursor-pointer'>
            <Image
              src={"/icons/garbage.svg"}
              width={1000}
              height={1000}
              alt='icon'
              priority
              className='w-[16px] h-[16px]'
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <TitlePageAndButton title='Manage Routes' description='View and manage bus routes' btnText='Add New Route' handleOpenModel={RedirectoAdd} />
      <FormFilter
        setSearch={(value: string) =>
          handleSearchChange({
            target: { value },
          } as React.ChangeEvent<HTMLInputElement>)
        }
        placeholderSearch='Search routes...'
        filter={filterSearch}
        search={search}
      />
      {isLoadingskeleton ? <SkeletonRoute /> :
        <TableTemplate
          columns={columns}
          data={rows}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalPages={routeData?.totalPages}
          totalResults={routeData?.total}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowKey={(row) => row.id}
        />
      }

    </>
  )
}

export default Page
