"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { debounce } from "@/utils/debounce";

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
import { Ticket } from "lucide-react";
import TableActionButton from '@/app/components/Table/TableActionButton/TableActionButton';


export interface TicketTableData {
  id: number,
  ticketNameEN: string,
  ticketNameTH: string,
  ticketType: string,
  status: number,
  amount: number,
  ticketColor: string
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
    ticketColor: string
  ): TicketTableData => {
    return { id, ticketType, ticketNameEN, ticketNameTH, status, amount, ticketColor };
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
            item.ticket_color
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
      key: 'ticketNameEN', label: 'Ticket', width: '25%',
      render: (_, row) => (
        <div className='flex gap-3'>
          <div>
            <Ticket size={24}
              style={{
                color: row.ticketColor
              }}
            />
          </div>
          <div className='flex flex-col gap-1'>
            <p className='whitespace-nowrap custom-ellipsis-style '>{row.ticketNameTH}</p>
            <p className='whitespace-nowrap custom-ellipsis-style text-gray-500'>{row.ticketNameEN}</p>
          </div>
        </div>
      ),
    },
    { key: 'amount', label: 'Amount', width: '20%', align: 'center' },
    { key: 'ticketType', label: 'Ticket Type', width: '20%', align: 'center' },
    {
      key: 'status', label: 'Status', width: '20%', align: 'center',
      render: (_, row) => (
        <div className='flex justify-center cursor-pointer' onClick={() => handleChangeStatus({ idStatus: row.status, idTicket: row.id })}>
          <StatusText id={Number(row.status)} />
        </div>
      ),
    },
    {
      key: 'id', label: 'Action', width: '25%', align: 'right',
      render: (_, row) => (
        <div className='flex justify-end gap-2 min-w-max'>
          {/* <TableActionButton
            iconSrc="/icons/money.svg"
            href={`${pathname}/${row?.id}`}
            bgColor="bg-green-100"
            hoverColor="hover:bg-green-200"
          />
          <TableActionButton
            iconSrc="/icons/garbage.svg"
            onClick={() => handleDeleteRoute({ ticketName: row.ticketNameEN, id: Number(row?.id) })}
            bgColor="bg-red-50"
            hoverColor="hover:bg-red-100"
          /> */}
          <TableActionButton
            iconSrc="M1.5 6.375c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v3.026a.75.75 0 0 1-.375.65 2.249 2.249 0 0 0 0 3.898.75.75 0 0 1 .375.65v3.026c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 17.625v-3.026a.75.75 0 0 1 .374-.65 2.249 2.249 0 0 0 0-3.898.75.75 0 0 1-.374-.65V6.375Zm15-1.125a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Zm.75 4.5a.75.75 0 0 0-1.5 0v.75a.75.75 0 0 0 1.5 0v-.75Zm-.75 3a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0v-.75a.75.75 0 0 1 .75-.75Zm.75 4.5a.75.75 0 0 0-1.5 0V18a.75.75 0 0 0 1.5 0v-.75ZM6 12a.75.75 0 0 1 .75-.75H12a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 12Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z"
            href={`${pathname}/${row?.id}`}
            bgColor="text-green-600 bg-green-100"
            hoverColor="hover:bg-green-200"
          />
          <TableActionButton
            iconSrc="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            onClick={() => handleDeleteRoute({ ticketName: row.ticketNameEN, id: Number(row?.id) })}
            bgColor="bg-red-50 text-red-600"
            hoverColor="hover:bg-red-100"
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <TitlePage title='Manage Route Tickets' description='View and manage route ticket information.' />
      <div className='custom-frame-content p-5 mt-5'>
        <FormFilter
          setSearch={(value: string) =>
            handleSearchChange({
              target: { value },
            } as React.ChangeEvent<HTMLInputElement>)
          }
          placeholderSearch='Search route tickets...'
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
