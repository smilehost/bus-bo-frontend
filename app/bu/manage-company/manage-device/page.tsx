"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { debounce } from "@/utils/debounce";

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
import { useDeviceStore } from '@/stores/deviceStore';

//toast
import { toast } from 'react-toastify'

//const 
import { statusOptions } from '@/constants/options'
import { STATUS, FILTER } from '@/constants/enum'
import { Confirm } from '@/app/components/Dialog/Confirm';

//icons
import TitlePage from '@/app/components/Title/TitlePage';
import TableActionButton from '@/app/components/Table/TableActionButton/TableActionButton';

export interface RouteTableData {
  id: number,
  no: number,
  com_id: number,
  com_name: string,
  dv_serial: string,
  dv_status: number,
}

function Page() {

  //api
  const { routeData, getRoutes, deleteRoute, updateRouteStatus } = useRouteStore();
  const { devices } = useDeviceStore();
  const { times, getTimes } = useTimeStore();
  const { dates, getDates } = useDateStore();

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
    no: number,
    id: number,
    com_id: number,
    com_name: string,
    dv_serial: string,
    dv_status: number,
  ): RouteTableData => {
    return { no, id, com_id, com_name, dv_serial, dv_status };
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
        devices?.map(async (item, index) => {
          return createData(
            index + 1, // no
            item.id, //id
            item.com_id, // company id (example)
            item.com_name, // company name (example)
            item.serial, // serial number (example)
            item.status // status
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
    console.log("add")
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
      key: 'no',
      label: 'No',
      width: '5%',
    },
    {
      key: 'com_name', label: 'Company Name', width: '20%',
    },
    {
      key: 'dv_serial', label: 'Serial Number', width: '20%'
    },
    {
      key: 'dv_status',
      label: 'Status',
      width: '15%',
      render: (_, row) => (
        <div className='cursor-pointer'>
          <StatusText id={Number(row.dv_status)} />
        </div>
      ),
    },
    {
      key: 'id',
      label: 'Action',
      width: '25%',
      align: 'right',
      render: (_, row) => (
        <div className='flex gap-2 min-w-max justify-end'>
          <TableActionButton
            iconSrc="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
            bgColor="bg-blue-50 text-blue-600"
            hoverColor="hover:bg-blue-100"
          />
          <TableActionButton
            iconSrc="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            bgColor="bg-red-50 text-red-600"
            hoverColor="hover:bg-red-100"
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <TitlePage title='Manage Device' description='View and manage device' btnText='Add New Device' handleOpenModel={RedirectoAdd} />
      <div className='custom-frame-content p-5 mt-5'>
        <FormFilter
          setSearch={(value: string) =>
            handleSearchChange({
              target: { value },
            } as React.ChangeEvent<HTMLInputElement>)
          }
          placeholderSearch='Search device...'
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
