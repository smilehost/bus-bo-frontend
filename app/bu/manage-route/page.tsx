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
import { useRouteStore } from '@/stores/routeStore'
import { useDateStore } from '@/stores/dateStore'
import { useTimeStore } from '@/stores/timeStore'

//toast
import { toast } from 'react-toastify'

//const 
import { statusOptions } from '@/constants/options'
import { STATUS, FILTER } from '@/constants/enum'
import { Confirm } from '@/app/components/Dialog/Confirm';

//icons
import { SquarePen, Ticket, Trash2, Waypoints } from 'lucide-react';
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
  routeColor: string,
  route_date_name: string,
  route_date_start: string,
  route_date_end: string,
  route_date_mon: number,
  route_date_tue: number,
  route_date_wen: number,
  route_date_thu: number,
  route_date_fri: number,
  route_date_sat: number,
  route_date_sun: number,
}

function Page() {

  //api
  const { routeData, getRoutes, deleteRoute, updateRouteStatus } = useRouteStore();
  const { times, getTimes } = useTimeStore();
  const { dates, getDates } = useDateStore();

  const router = useRouter();
  const pathname = usePathname();

  const [searchStatus, setSearchStatus] = useState<string>(''); // Filter by status
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
    routeColor: string,
    route_date_name: string,
    route_date_start: string,
    route_date_end: string,
    route_date_mon: number,
    route_date_tue: number,
    route_date_wen: number,
    route_date_thu: number,
    route_date_fri: number,
    route_date_sat: number,
    route_date_sun: number,
  ): RouteTableData => {
    return { id, route, routeTH, company, schedule, time, ticket_amount, status, routeColor, route_date_name, route_date_start, route_date_end, route_date_mon, route_date_tue, route_date_wen, route_date_thu, route_date_fri, route_date_sat, route_date_sun };
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
            item.route_color,
            item.route_date.route_date_name,
            item.route_date.route_date_start,
            item.route_date.route_date_end,
            item.route_date.route_date_mon,
            item.route_date.route_date_tue,
            item.route_date.route_date_wen,
            item.route_date.route_date_thu,
            item.route_date.route_date_fri,
            item.route_date.route_date_sat,
            item.route_date.route_date_sun,
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
  const filterSearch = [
    {
      defaulteValue: FILTER.ALL_STATUS,
      listValue: statusOptions,
      setSearchValue: setSearchStatus,
      size: "w-[130px]",
    },
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
      width: '20%',
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
      key: 'schedule',
      label: 'Schedule',
      width: '20%',
      render: (_, row) => {
        type RouteDateRow = {
          route_date_name: string;
          route_date_start: string;
          route_date_end?: string;
          route_date_mon: number;
          route_date_tue: number;
          route_date_wen: number;
          route_date_thu: number;
          route_date_fri: number;
          route_date_sat: number;
          route_date_sun: number;
        };
        const getActiveDays = (row: RouteDateRow): string => {
          const dayMap = {
            route_date_mon: 'Monday',
            route_date_tue: 'Tuesday',
            route_date_wen: 'Wednesday',
            route_date_thu: 'Thursday',
            route_date_fri: 'Friday',
            route_date_sat: 'Saturday',
            route_date_sun: 'Sunday',
          };

          return Object.entries(dayMap)
            .filter(([key]) => row[key as keyof RouteDateRow] === 1)
            .map(([, day]) => day)
            .join(', ');
        };

        const activeDays = getActiveDays(row);

        const today = new Date();
        const endDate = new Date(row.route_date_end);
        const isExpired = endDate < today;

        return (
          <div className='flex gap-3'>
            <Tooltip title={activeDays} arrow>
              <div className='flex flex-col gap-1 cursor-default'>
                <p className={`whitespace-nowrap custom-ellipsis-style`}>
                  {row.route_date_name}
                </p>
                <p
                  className={`whitespace-nowrap custom-ellipsis-style ${isExpired ? 'text-red-500 font-semibold' : 'text-gray-500'
                    }`}
                >
                  {isExpired && `${STATUS.EXPIRE}:`} {row.route_date_start} - {row.route_date_end || "No End Date"}
                </p>
              </div>
            </Tooltip>
          </div>
        );
      },
    },
    {
      key: 'time', label: 'Departure Times', width: '20%', render: (row) => (
        <Tooltip title={row} arrow>
          <p className='custom-ellipsis-style cursor-default'>{row}</p>
        </Tooltip>
      )
    },
    { key: 'ticket_amount', label: 'Route Tickets', width: '15%', align: 'center' },
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
          <TableActionButton
            icon={<Ticket className={`custom-size-tableAction-btn text-green-500`} />}
            href={`${pathname}/routeTicket?id=${row?.id}&name=${row?.routeTH}`}
            bgColor="text-green-600 bg-green-100"
            hoverColor="hover:bg-green-200"
          />
          <TableActionButton
            icon={<SquarePen className={`custom-size-tableAction-btn text-blue-500`} />}
            href={`${pathname}/edit?id=${row?.id}&name=${row?.routeTH}`}
            bgColor="bg-blue-50 text-blue-600"
            hoverColor="hover:bg-blue-100"
          />
          <TableActionButton
            icon={<Trash2 className={`custom-size-tableAction-btn text-red-600`} />}
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
