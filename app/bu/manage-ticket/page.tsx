"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { debounce } from "@/utils/debounce";

//mui
import Tooltip from '@mui/material/Tooltip';

//companent 
import FormFilter from '@/app/components/Filter/FormFilter'
import TableTemplate, { ColumnConfig } from '@/app/components/Table/TableTemplate'
import StatusText from '@/app/components/StatusText'
import { Confirm } from '@/app/components/Dialog/Confirm'
import SkeletonRoute from '@/app/components/Skeleton/SkeletonRoute'
import { withSkeletonDelay } from '@/app/components/Skeleton/withSkeletonDelay'

//store
import { useTicketStore } from '@/stores/routeTicketStore'

//toast
import { toast } from 'react-toastify'

//type
import { TicketProps } from '@/types/types'

//const 
import { FILTER } from '@/constants/enum'
import { statusOptions } from '@/constants/options';
import TitlePage from '@/app/components/Title/TitlePage';

////icons
import { Ticket, Trash2 } from "lucide-react";
import TableActionButton from '@/app/components/Table/TableActionButton/TableActionButton';
import {getTextTicketPage, useLanguageContext} from '@/app/i18n/translations'


export interface TicketTableData {
  id: number,
  ticketNameEN: string,
  ticketNameTH: string,
  ticketType: string,
  routeNameTH: string,
  routeNameEN: string,
  status: number,
  amount: number,
  ticketColor: string,
  route_status: number
}

function Page() {

  //stores
  const { ticketDataList, getTickets, deleteTicket, updateTicketStatus } = useTicketStore();
  const pathname = usePathname();

  const [searchStatus, setSearchStatus] = useState<string>(''); // Filter by status
  const [search, setSearch] = useState<string>(''); // Search input
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoadingskeleton, setIsLoadingskeleton] = useState(false);
  const [tickets, setTickets] = useState<TicketProps[]>([])

  //fetch tickets
  const fetchTicketData = async () => {
    const cancelSkeleton = withSkeletonDelay(setIsLoadingskeleton);
    await getTickets(currentPage, rowsPerPage, debouncedSearch, searchStatus);;
    cancelSkeleton();
  }

  useEffect(() => {
    if (ticketDataList) {
      setTickets(ticketDataList.data)
    }
  }, [ticketDataList])

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const {isTH} = useLanguageContext();
  const text = getTextTicketPage({isTH});

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    setRowsPerPage(newSize);
    setCurrentPage(1);
  };

  // useEffect(() => {
  //   fetchTicketData();
  // }, [currentPage, rowsPerPage]);

  // Function to create data for table
  const createData = (
    id: number,
    ticketNameEN: string,
    ticketNameTH: string,
    status: number,
    ticketType: string,
    amount: number,
    ticketColor: string,
    routeNameTH: string,
    routeNameEN: string,
    route_status: number,
  ): TicketTableData => {
    return { id, ticketType, ticketNameEN, ticketNameTH, status, amount, ticketColor, routeNameTH, routeNameEN, route_status };
  };

  // Generate rows for table
  const [rows, setRows] = useState<TicketTableData[]>([]);
  useEffect(() => {
    const isReady = tickets;
    if (!isReady) {
      setRows([])
      return
    };
    const fetchWithTicketCounts = async () => {
      const newRows = await Promise.all(
        tickets?.map(async (item) => {
          return createData(
            Number(item.id),
            item.ticketName_en,
            item.ticketName_th,
            Number(item.ticket_status),
            item.ticket_type,
            Number(item.ticket_amount),
            item.ticket_color,
            item?.route?.route_name_th || "-",
            item?.route?.route_name_en || "-",
            Number(item?.route?.route_status),

          );
        })
      );
      setRows(newRows);
    };
    fetchWithTicketCounts();
  }, [tickets]);

  // Handle delete route
  const handleDeleteRoute = async ({ ticketName, id }: { ticketName: string, id: number }) => {
    const isConfirmed = await Confirm({
      title: `Delete "${ticketName}"?`,
      text: `Are you sure you want to delete it.`,
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (isConfirmed) {
      const result = await deleteTicket(id);
      if (result.success) {
        fetchTicketData();
        toast.success("delete ticket successfully!");
      } else {
        toast.error(`Error: ${result.message}`);
      }
    }
  };

  // Handle Change Status
  const handleChangeStatus = async ({ idStatus, idTicket }: { idStatus: string | number, idTicket: number }) => {
    const currentStatus = Number(idStatus);
    const nextStatus = currentStatus === 1 ? 0 : 1;
    const statusText = nextStatus === 1 ? "Active" : "Inactive";

    const isStatusConfirmed = await Confirm({
      title: "Change Status?",
      text: `Do you want to change the status to "${statusText}"`,
      confirmText: "Confirm",
      cancelText: "Cancel",
    });


    if (isStatusConfirmed) {

      const result = await updateTicketStatus(idTicket, nextStatus);

      if (result.success) {
        toast.success("Status changed successfully!");
        fetchTicketData?.();
      } else {
        toast.error(`Failed to change status: ${result.message}`);
      }
    }
  };


  //filter
  const filterSearch = [
    {
      defaulteValue: FILTER.ALL_STATUS,
      listValue: statusOptions,
      setSearchValue: setSearchStatus,
      size: "w-[130px]"
    },

  ]

  //Search
  useEffect(() => {
    fetchTicketData();
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
  const columns: ColumnConfig<TicketTableData>[] = [
    {
      key: 'ticketNameEN', label: text.tableTitle, width: '25%',
      render: (_, row) => (
        <div className='flex gap-3'>
          <div>
            <Ticket size={24}
              style={{
                color: row.ticketColor
              }}
            />
          </div>
          <Tooltip title={row.ticketNameTH} arrow>
            <div className='flex flex-col gap-1 cursor-default custom-ellipsis-style'>
              <p className='whitespace-nowrap custom-ellipsis-style '>{row.ticketNameTH}</p>
              <p className='whitespace-nowrap custom-ellipsis-style text-gray-500'>{row.ticketNameEN}</p>
            </div>
          </Tooltip>
        </div>
      ),
    },
    {
      key: 'routeNameTH', label: text.route, width: '20%', align: 'left',
      render: (_, row) => {
        const isActive = row.route_status === 1 ? true : false
        return (
          <Tooltip title={isActive ? row.routeNameTH: "This route status is inactive"} arrow>
            <div className={`${!isActive && "text-red-500"} flex flex-col gap-1 cursor-default custom-ellipsis-style w-fit`}>
              <p className='whitespace-nowrap custom-ellipsis-style'>{row.routeNameTH}</p>
              <p className={`whitespace-nowrap custom-ellipsis-style ${!isActive ? "text-red-500": "text-gray-500"}`}>{row.routeNameEN}</p>
            </div>
          </Tooltip>
        )
      },
    },
    { key: 'amount', label: text.amount, width: '20%', align: 'center' },
    { key: 'ticketType', label: text.type, width: '20%', align: 'center' },
    // { key: 'ticketPrice', label: 'Ticket Price', width: '20%', align: 'center' },
    {
      key: 'status', label: text.status, width: '20%', align: 'center',
      render: (_, row) => (
        <div className='flex justify-center cursor-pointer' onClick={() => handleChangeStatus({ idStatus: row.status, idTicket: row.id })}>
          <StatusText id={Number(row.status)} />
        </div>
      ),
    },
    {
      key: 'id', label: text.action, width: '25%', align: 'right',
      render: (_, row) => (
        <div className='flex justify-end gap-2 min-w-max'>
          <TableActionButton
            icon={<Ticket className={`custom-size-tableAction-btn text-green-500`} />}
            href={`${pathname}/edit?id=${row?.id}&name=${row?.ticketNameTH}`}
            bgColor="text-green-600 bg-green-100"
            hoverColor="hover:bg-green-200"
            title='Edit'
          />
          <TableActionButton
            icon={<Trash2 className={`custom-size-tableAction-btn text-red-600`} />}
            onClick={() => handleDeleteRoute({ ticketName: row.ticketNameEN, id: Number(row?.id) })}
            bgColor="bg-red-50 text-red-600"
            hoverColor="hover:bg-red-100"
            title='Delete'
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <TitlePage title={text.title} description={text.description} />
      <div className='custom-frame-content p-5 mt-5'>
        <FormFilter
          setSearch={(value: string) =>
            handleSearchChange({
              target: { value },
            } as React.ChangeEvent<HTMLInputElement>)
          }
          placeholderSearch={text.search}
          filter={filterSearch}
          search={search}
        />
        {isLoadingskeleton ? <SkeletonRoute /> :
          <TableTemplate
            columns={columns}
            data={rows}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            totalPages={ticketDataList.totalPages}
            totalResults={ticketDataList.total}
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
