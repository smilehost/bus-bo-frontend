"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { debounce } from "@/utils/debounce";

//mui
import Tooltip from '@mui/material/Tooltip';

//companent 
import { ConfirmWithInput } from '@/app/components/Dialog/ConfirmWithInput'
import { Alert } from '@/app/components/Dialog/Alert'
import FormFilter from '@/app/components/Filter/FormFilter'
import TableTemplate, { ColumnConfig } from '@/app/components/Table/TableTemplate'
import StatusText from '@/app/components/StatusText'
import SkeletonRoute from '@/app/components/Skeleton/SkeletonRoute'
import { withSkeletonDelay } from '@/app/components/Skeleton/withSkeletonDelay'

//store
import { useCompanyStore } from '@/stores/companyStore'
import { useRouteStore } from '@/stores/routeStore'
import { useDateStore } from '@/stores/dateStore'
import { useTimeStore } from '@/stores/timeStore'
import { useUserStore } from '@/stores/userStore';

//toast
import { toast } from 'react-toastify'

//const 
import { statusOptions } from '@/constants/options'
import { STATUS, FILTER } from '@/constants/enum'
import { Confirm } from '@/app/components/Dialog/Confirm';

//icons
import { Waypoints } from 'lucide-react';
import TitlePage from '@/app/components/Title/TitlePage';
import TableActionButton from '@/app/components/Table/TableActionButton/TableActionButton';

export interface RouteTableData {
  id: string,
  route: string,
  routeTH: string,
  company: string,
  schedule: string,
  time: string,
  ticket_amount: string,
  status: STATUS,
  routeColor: string
}

function Page() {

  //api
  const { companies, getCompanies } = useCompanyStore();
  const { routeData, getRoutes, deleteRoute, updateRouteStatus } = useRouteStore();
  const { times, getTimes } = useTimeStore();
  const { dates, getDates } = useDateStore();
  const { userData } = useUserStore();

  const router = useRouter();
  const pathname = usePathname();

  const [searchStatus, setSearchStatus] = useState<string>(''); // Filter by status
  const [searchCompany, setSearchCompany] = useState<string>(''); // Filter by company
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
    getCompanies(1, 9999, '');
  }, [])

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    setRowsPerPage(newSize);
    setCurrentPage(1);
  };


  // Function to create data for table
  const createData = (
    id: string,
    route: string,
    routeTH: string,
    company: string,
    schedule: string,
    time: string,
    ticket_amount: string,
    status: STATUS,
    routeColor: string
  ): RouteTableData => {
    return { id, route, routeTH, company, schedule, time, ticket_amount, status, routeColor };
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

          return createData(
            item.route_id,
            item.route_name_en,
            item.route_name_th,
            item.route_com_id,
            dateName,
            timeName,
            item.route_ticket_count.toString(),
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
    const nextStatus = currentStatus === 1 ? 0 : 1;
    const statusText = nextStatus === 1 ? STATUS.ACTIVE : STATUS.INACTIVE;

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
  const listCompany = companies?.map((item) => {
    return {
      key: Number(item.id),
      value: item.name
    }
  })

  const filterSearch = [
    {
      defaulteValue: FILTER.ALL_STATUS,
      listValue: statusOptions,
      setSearchValue: setSearchStatus,
      size: "w-[130px]",
    },
    ...(userData?.account_role === 2
      ? [
        {
          defaulteValue: FILTER.ALL_COMPANIES,
          listValue: listCompany,
          setSearchValue: setSearchCompany,
          size: "w-[170px]",
        },
      ]
      : []),
  ];

  //search
  useEffect(() => {
    fetchRouteData();
  }, [debouncedSearch, searchStatus, currentPage, rowsPerPage])

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
        <div className='flex gap-3'>
          <div>
            <Waypoints strokeWidth={1.5}
              style={{
                color: row.routeColor
              }}
            />
          </div>
          <Tooltip title={row.routeTH} arrow>
            <div className='flex flex-col gap-1 cursor-default'>
              <p className='whitespace-nowrap custom-ellipsis-style '>{row.routeTH}</p>
              <p className='whitespace-nowrap custom-ellipsis-style text-gray-500'>{row.route}</p>
            </div>
          </Tooltip>
        </div>
      ),
    },
    // { key: 'company', label: 'Company', width: '20%' },
    {
      key: 'schedule', label: 'Schedule', width: '20%',
    },
    {
      key: 'time', label: 'Departure Times', width: '20%', render: (row) => (
        <Tooltip title={row} arrow>
          <p className='custom-ellipsis-style cursor-default'>{row}</p>
        </Tooltip>
      )
    },
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
          {/* <TableActionButton
            iconSrc="/icons/money.svg"
            href={`${pathname}/routeTicket/${row?.id}`}
            bgColor="bg-green-100"
            hoverColor="hover:bg-green-200"
          />
          <TableActionButton
            iconSrc="/icons/edit.svg"
            href={`${pathname}/edit/${row?.id}`}
            bgColor="bg-blue-50"
            hoverColor="hover:bg-blue-100"
          />
          <TableActionButton
            iconSrc="/icons/garbage.svg"
            onClick={() => handleDeleteRoute({ route: row?.route, id: Number(row?.id) })}
            bgColor="bg-red-50"
            hoverColor="hover:bg-red-100"
          /> */}
          <TableActionButton
            iconSrc="M1.5 6.375c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v3.026a.75.75 0 0 1-.375.65 2.249 2.249 0 0 0 0 3.898.75.75 0 0 1 .375.65v3.026c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 17.625v-3.026a.75.75 0 0 1 .374-.65 2.249 2.249 0 0 0 0-3.898.75.75 0 0 1-.374-.65V6.375Zm15-1.125a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Zm.75 4.5a.75.75 0 0 0-1.5 0v.75a.75.75 0 0 0 1.5 0v-.75Zm-.75 3a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0v-.75a.75.75 0 0 1 .75-.75Zm.75 4.5a.75.75 0 0 0-1.5 0V18a.75.75 0 0 0 1.5 0v-.75ZM6 12a.75.75 0 0 1 .75-.75H12a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 12Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z"
            href={`${pathname}/routeTicket/${row?.id}`}
            bgColor="text-green-600 bg-green-100"
            hoverColor="hover:bg-green-200"
          />
          <TableActionButton
            iconSrc="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
            href={`${pathname}/edit/${row?.id}`}
            bgColor="bg-blue-50 text-blue-600"
            hoverColor="hover:bg-blue-100"
          />
          <TableActionButton
            iconSrc="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            onClick={() => handleDeleteRoute({ route: row?.route, id: Number(row?.id) })}
            bgColor="bg-red-50 text-red-600"
            hoverColor="hover:bg-red-100"
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <TitlePage title='Manage Routes' description='View and manage bus routes' btnText='Add New Route' handleOpenModel={RedirectoAdd} />
      <div className='custom-frame-content p-5 mt-5'>
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
      </div>

    </>
  )
}

export default Page
