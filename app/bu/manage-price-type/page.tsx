"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

//companent 
import TableTemplate, { ColumnConfig } from '@/app/components/Table/TableTemplate'
import SkeletonRoute from '@/app/components/Skeleton/SkeletonRoute'
import { withSkeletonDelay } from '@/app/components/Skeleton/withSkeletonDelay'

//store
import { useTicketPriceTypeStore } from '@/stores/routeTicketPriceTypeStore';

//toast
import { toast } from 'react-toastify'
import { ConfirmWithInput } from '@/app/components/Dialog/ConfirmWithInput'

//Alert
import { Alert } from '@/app/components/Dialog/Alert'

//utils
import { getComId } from '@/utils/getComId'
import TitlePage from '@/app/components/Title/TitlePage'


export interface TicketTypeTableData {
  no: number,
  id: number,
  name: string,
  company_id: number
}

function Page() {

  //stores
  // const { companyData } = useCompanyStore();
  const { getTicketPriceType, ticketPriceTypeData, updateTicketPriceType, addTicketType, deleteTicketType } = useTicketPriceTypeStore();

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
    no: number,
    id: number,
    name: string,
    company_id: number
  ): TicketTypeTableData => {
    return { no, id, name, company_id };
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
        ticketPriceTypeData?.map(async (item, index) => {
          return createData(
            index + 1,
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

  //model
  const handleTicketTypeModel = async ({ id, name }: { id?: number, name?: string }) => {
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
        route_ticket_price_type_com_id: Number(getComId())
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

  //delete
  const handleDeleteTicketType = async ({ name, id }: { name: string, id: number }) => {
    const inputName = await ConfirmWithInput({
      title: `Delete "${name}"?`,
      text: `Please type the route name below to confirm deletion.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      placeholder: "Type route name here"
    });

    if (inputName === name) {
      const result = await deleteTicketType(id);
      if (result.success) {
        fetchTicketTypeData();
        toast.success("delete price type successfully!");
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

  const handleOpenTicketTypeModal = () => {
    handleTicketTypeModel({});
  };

  //table columns
  const columns: ColumnConfig<TicketTypeTableData>[] = [
    { key: 'no', label: 'No.', width: '5%', align: 'left' },
    { key: 'name', label: 'Price Type', width: '20%', align: 'left' },
    {
      key: 'company_id', label: 'Actions', width: '20%', align: 'right',
      render: (_, row) => (
        <div className='flex justify-end gap-2 min-w-max'>
          <div onClick={() => handleTicketTypeModel({ id: row.id, name: row.name })} className='cursor-pointer'>
            <Image
              src={"/icons/edit.svg"}
              width={1000}
              height={1000}
              alt='icon'
              priority
              className='w-[16px] h-[16px]'
            />
          </div>
          <div onClick={() => handleDeleteTicketType({ name: row.name, id: row.id })} className='cursor-pointer'>
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
      <TitlePage title='Manage Ticket Types' description='View and manage ticket type information' btnText='Add New Type' handleOpenModel={handleOpenTicketTypeModal} />
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
