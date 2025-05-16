"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

//companent 
import TitlePageAndButton from '@/app/components/Title/TitlePageAndButton'
import TableTemplate, { ColumnConfig } from '@/app/components/Table/TableTemplate'
import { Confirm } from '@/app/components/Dialog/Confirm'
import SkeletonRoute from '@/app/components/Skeleton/SkeletonRoute'
import { withSkeletonDelay } from '@/app/components/Skeleton/withSkeletonDelay'

//store
import { useTicketPriceTypeStore } from '@/stores/routeTicketPriceTypeStore';

//toast
import { toast } from 'react-toastify'
import { ConfirmWithInput } from '@/app/components/Dialog/ConfirmWithInput'


export interface TicketTypeTableData {
  id: number,
  name: string,
  company_id: number
}

function Page() {

  //stores
  // const { companyData } = useCompanyStore();
  const { getTicketPriceType, ticketPriceTypeData, updateTicketPriceType, addTicketType } = useTicketPriceTypeStore();

  const [isLoadingskeleton, setIsLoadingskeleton] = useState(false);

  //fetch tickets
  const fetchTicketTypeData = async () => {
    const cancelSkeleton = withSkeletonDelay(setIsLoadingskeleton);
    await getTicketPriceType();
    cancelSkeleton();
  };

  useEffect(() => {
    fetchTicketTypeData();
  }, []);

  // Function to create data for table
  const createData = (
    id: number,
    name: string,
    company_id: number
  ): TicketTypeTableData => {
    return { id, name, company_id };
  };

  // Generate rows for table
  const [rows, setRows] = useState<TicketTypeTableData[]>([]);
  useEffect(() => {
    const isReady = ticketPriceTypeData;
    if (!isReady) {
      setRows([])
      return
    };
    const fetchWithTicketCounts = async () => {
      const newRows = await Promise.all(
        ticketPriceTypeData?.map(async (item) => {
          return createData(
            Number(item.id),
            item.name,
            Number(item.company_id),
          );
        })
      );
      setRows(newRows);
    };
    fetchWithTicketCounts();
  }, [ticketPriceTypeData]);

  const RedirecAdd = () => {
    console.log("ไปไหน")
  }

  //model
  const handleTicketTypeModel = async ({ id, name, comId }: { id?: number, name?: string, comId: number }) => {
    const isConfirmed = await ConfirmWithInput({
      title: `${id ? "Edit Price Type" : "Add New Price Type"}`,
      text: `Fill in the price type details below.`,
      confirmText: "Confirm",
      cancelText: "Cancel",
      placeholder: "Type route name here",
      defaultValue: name || ""  // ใส่ค่า name ถ้ามี, ไม่งั้นเป็น empty string
    });

    if (isConfirmed) {
      const inputName = isConfirmed.trim();

      if (!inputName) {
        toast.error("Name cannot be empty");
        return;
      }

      const formatPayload = {
        route_ticket_price_type_name: inputName,
        route_ticket_price_type_com_id: comId
      };

      if (id) {
        const result = await updateTicketPriceType(id, {
          ...formatPayload,
          route_ticket_price_type_id: id,
        });
        if (result.success) {
          toast.success("Updated successfully!");
        } else {
          toast.error(`Update failed: ${result.message}`);
        }
      } else {
        // เพิ่มใหม่ (ไม่ส่ง id)
        const result = await addTicketType(formatPayload);
        if (result.success) {
          toast.success("Created successfully!");
        } else {
          toast.error(`Creation failed: ${result.message}`);
        }
      }

      fetchTicketTypeData(); // รีเฟรชข้อมูล
    }
  };

  //table columns
  const columns: ColumnConfig<TicketTypeTableData>[] = [
    { key: 'id', label: '#', width: '20%', align: 'left' },
    { key: 'name', label: 'Price Type', width: '20%', align: 'left' },
    {
      key: 'company_id', label: 'Actions', width: '20%', align: 'right',
      render: (_, row) => (
        <div className='flex justify-end gap-2 min-w-max'>
          <div onClick={() => handleTicketTypeModel({ id: row.id, name: row.name, comId: row.company_id })} className='cursor-pointer'>
            <Image
              src={"/icons/edit.svg"}
              width={1000}
              height={1000}
              alt='icon'
              priority
              className='w-[16px] h-[16px]'
            />
          </div>
          <div className='cursor-pointer'>
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
      <TitlePageAndButton title='Manage Ticket Types' description='View and manage ticket type information' btnText='Add New Type'/>
      {isLoadingskeleton ? <SkeletonRoute /> :
        <TableTemplate
          columns={columns}
          data={rows}
          rowKey={(row) => row.id}
        />
      }

    </>
  )
}

export default Page
