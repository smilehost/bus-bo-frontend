"use client"

import React, { useState, useEffect } from 'react'

//companent 
import TableTemplate, { ColumnConfig } from '@/app/components/Table/TableTemplate'
import SkeletonRoute from '@/app/components/Skeleton/SkeletonRoute'
import { withSkeletonDelay } from '@/app/components/Skeleton/withSkeletonDelay'

//store
import { useTicketPriceTypeStore } from '@/stores/routeTicketPriceTypeStore';
import { useTicketDiscountPrice } from '@/stores/ticketDiscountPrice'

//toast
import { toast } from 'react-toastify'
import { ConfirmWithInput } from '@/app/components/Dialog/ConfirmWithInput'

//Alert
import { Alert } from '@/app/components/Dialog/Alert'

//utils
import { getComId } from '@/utils/getComId'
import TitlePage from '@/app/components/Title/TitlePage'
import TableActionButton from '@/app/components/Table/TableActionButton/TableActionButton'
import StatusText from '@/app/components/StatusText'
import { DISCOUNT_TYPE, STATUS } from '@/constants/enum'
import { Confirm } from '@/app/components/Dialog/Confirm'

import TicketDiscountModel from '@/app/components/Model/TicketDiscountModel'
import { RouteTicketDiscount } from '@/payloads/route.ticket.discount.payload'
import { SquarePen, Trash2 } from 'lucide-react'



export interface TicketTypeTableData {
  no: number,
  id: number,
  name: string,
  company_id: number
}

export interface DiscountPriceTableData {
  no: number,
  ticket_discount_id: number,
  ticket_discount_name: string,
  ticket_discount_type: number,
  ticket_discount_value: number,
  ticket_discount_status: number,
  ticket_discount_comId: number
}

export interface InsertDiscount {
  name: string,
  type: number,
  value: number
}
function Page() {

  //stores
  // const { companyData } = useCompanyStore();
  const {
    ticketDiscountPrice,
    addTicketDiscount,
    updateTicketDiscount,
    deleteTicketDiscount,
    updateTicketDiscountStatus,
    fetchTicketDiscount
  } = useTicketDiscountPrice();

  const { getTicketPriceType, ticketPriceTypeData, updateTicketPriceType, addTicketType, deleteTicketType } = useTicketPriceTypeStore();

  const [isLoadingskeleton, setIsLoadingskeleton] = useState(false);
  const [showModel, setShowModel] = useState(false)
  const [editingDiscount, setEditingDiscount] = useState<RouteTicketDiscount>()

  //fetch tickets and discount
  const fetchTicketTypeData = async () => {
    const cancelSkeleton = withSkeletonDelay(setIsLoadingskeleton);
    await getTicketPriceType();
    cancelSkeleton();
  };
  const fetchTicketDiscountData = async () => {
    const cancelSkeleton = withSkeletonDelay(setIsLoadingskeleton);
    await fetchTicketDiscount();
    cancelSkeleton();
  };

  useEffect(() => {
    fetchTicketTypeData();
    fetchTicketDiscountData();
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

  // row route ticket price type
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

  //row ticket discount price
  const [rowDiscount, setRowDiscount] = useState<DiscountPriceTableData[]>([]);
  useEffect(() => {
    const isReady = ticketDiscountPrice;
    if (!isReady) {
      setRowDiscount([])
      return
    };
    const fetchWithCounts = async () => {
      const newRows = await Promise.all(
        ticketDiscountPrice?.map(async (item, index) => {
          return {
            no: index + 1,
            ticket_discount_id: item.ticket_discount_id,
            ticket_discount_name: item.ticket_discount_name,
            ticket_discount_value: item.ticket_discount_value,
            ticket_discount_type: item.ticket_discount_type,
            ticket_discount_status: item.ticket_discount_status,
            ticket_discount_comId: item.ticket_discount_com_id
          };
        })
      );
      setRowDiscount(newRows);
    };
    fetchWithCounts();
  }, [ticketDiscountPrice]);

  //model
  //ticket type models
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDialogData, setConfirmDialogData] = useState<{
    id?: number;
    name?: string;
    mode: 'add' | 'edit';
  } | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteDialogData, setDeleteDialogData] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const openTicketTypeDialog = (data?: { id?: number; name?: string }) => {
    setConfirmDialogData({
      id: data?.id,
      name: data?.name || '',
      mode: data?.id ? 'edit' : 'add'
    });
    setConfirmDialogOpen(true);
  };
  const openDeleteDialog = (data: { id: number; name: string }) => {
    setDeleteDialogData(data);
    setDeleteDialogOpen(true);
  };
  const handleTicketTypeConfirm = async (input: string) => {
    const name = input.trim();
    if (!name) {
      toast.error("Name cannot be empty");
      return;
    }

    const formatPayload = {
      route_ticket_price_type_name: name,
      route_ticket_price_type_com_id: Number(getComId()),
    };

    if (confirmDialogData?.mode === 'edit' && confirmDialogData?.id) {
      const result = await updateTicketPriceType(confirmDialogData.id, {
        ...formatPayload,
        route_ticket_price_type_id: confirmDialogData.id,
      });
      if (result.success) {
        toast.success("Updated successfully!");
      } else {
        toast.error(`Update failed: ${result.message}`);
      }
    } else {
      const result = await addTicketType(formatPayload);
      if (result.success) {
        toast.success("Created successfully!");
      } else {
        toast.error(`Creation failed: ${result.message}`);
      }
    }

    fetchTicketTypeData();
    setConfirmDialogOpen(false);
  };
  const handleDeleteConfirm = async (input: string) => {
    if (input !== deleteDialogData?.name) {
      await Alert({
        title: "Name mismatch!",
        text: "The typed name does not match the route name.",
        type: "error"
      });
      return;
    }

    const result = await deleteTicketType(deleteDialogData.id);
    if (result.success) {
      fetchTicketTypeData();
      toast.success("Deleted successfully!");
    } else {
      toast.error(`Error: ${result.message}`);
    }

    setDeleteDialogOpen(false);
  };

  //ticket discount 

  const handleAddDiscount = () => {
    setEditingDiscount(undefined);
    setShowModel(true);
  };

  const handleEditDiscount = (id: number) => {
    const temp = ticketDiscountPrice.find((l) => l.ticket_discount_id === id);
    if (temp) {
      setEditingDiscount(temp);
      setShowModel(true);
    }
  };
  const handleSaveTicketDiscount = async (data: InsertDiscount) => {
    const tempData = {
      ticket_discount_name: data.name,
      ticket_discount_type: data.type,
      ticket_discount_value: data.value,
    };

    setShowModel(false);

    const isConfirmed = await Confirm({
      title: editingDiscount ? "Confirm Update" : "Confirm Create",
      text: editingDiscount
        ? "Do you want to update this discount?"
        : "Do you want to create this discount?",
      confirmText: editingDiscount ? "Update" : "Create",
      cancelText: "Cancel",
      type: "question",
    });

    if (!isConfirmed) return;
    try {
      if (editingDiscount) {
        await updateTicketDiscount(editingDiscount.ticket_discount_id, tempData);
        toast.success("Updated!")
      } else {
        await addTicketDiscount(tempData);
        toast.success("Created!")
      }
      fetchTicketDiscount();
    } catch (error) {
      toast.error("Save Discount error:");
      console.error("Save Discount error:", error);
    }
  }

  // Handle Change Status
  const handleChangeStatusDiscount = async ({ idStatus, idDiscount }: { idStatus: number, idDiscount: number }) => {
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
      const result = await updateTicketDiscountStatus(idDiscount, nextStatus);
      if (result.success) {
        toast.success("Change status sucessfuly!")
        fetchTicketDiscount();
      } else {
        toast.error(`Change status error: ${result.message}`)
      }
    }
  };

  const handleDeleteTicketDiscount = async ({ name, id }: { name: string, id: number }) => {

    const isConfirmed = await Confirm({
      title: `Delete "${name}"?`,
      text: `Please type the route name below to confirm deletion.`,
      confirmText: "Delete",
      cancelText: "Cancel",
    });

    if (isConfirmed) {
      const result = await deleteTicketDiscount(id);
      if (result.success) {
        fetchTicketDiscount();
        toast.success("delete discount price successfully!");
      } else {
        toast.error(`Error: ${result.message}`);
      }
    } else if (isConfirmed) {
      await Alert({
        title: "Name mismatch!",
        text: "The typed name does not match the route name.",
        type: "error"
      });
    }
  };

  const handleOpenTicketTypeModal = () => {
    openTicketTypeDialog({});
  };

  //table columns
  const columnTicketType: ColumnConfig<TicketTypeTableData>[] = [
    { key: 'no', label: 'No.', width: '5%', align: 'left' },
    { key: 'name', label: 'Price Type', width: '20%', align: 'left' },
    {
      key: 'company_id', label: 'Actions', width: '20%', align: 'right',
      render: (_, row) => (
        <div className='flex justify-end gap-2 min-w-max'>
          {/* <TableActionButton
            iconSrc="/icons/edit.svg"
            onClick={() => handleTicketTypeModel({ id: row.id, name: row.name })}
            bgColor="bg-blue-50"
            hoverColor="hover:bg-blue-100"
          />
          <TableActionButton
            iconSrc="/icons/garbage.svg"
            onClick={() => handleDeleteTicketType({ name: row.name, id: row.id })}
            bgColor="bg-red-50"
            hoverColor="hover:bg-red-100"
          /> */}
          <TableActionButton
            icon={<SquarePen className={`custom-size-tableAction-btn text-blue-500`} />}
            onClick={() => openTicketTypeDialog({ id: row.id, name: row.name })}
            bgColor="bg-blue-50 text-blue-600"
            hoverColor="hover:bg-blue-100"
            title='Edit'
          />

          <TableActionButton
            icon={<Trash2 className={`custom-size-tableAction-btn text-red-600`} />}
            onClick={() => openDeleteDialog({ id: row.id, name: row.name })}
            bgColor="bg-red-50 text-red-600"
            hoverColor="hover:bg-red-100"
            title='Delete'
          />
        </div>
      ),
    },
  ];

  const columnTicketDiscount: ColumnConfig<DiscountPriceTableData>[] = [
    { key: 'no', label: 'No.', width: '5%', align: 'left' },
    { key: 'ticket_discount_name', label: 'Name', width: '20%', align: 'left' },
    {
      key: 'ticket_discount_value', label: 'Value', width: '20%', align: 'left',
    },
    {
      key: 'ticket_discount_type', label: 'Discount Type', width: '20%', align: 'center',
      render: (_, row) => (
        <p>{`${row.ticket_discount_type === 0 ? DISCOUNT_TYPE.BAHT : DISCOUNT_TYPE.PERCENT}`}</p>
      )
    },
    {
      key: 'ticket_discount_status',
      label: 'Status',
      width: '15%',
      align: 'center',
      render: (_, row) => (
        <div className='cursor-pointer' onClick={() => handleChangeStatusDiscount({ idStatus: Number(row.ticket_discount_status), idDiscount: Number(row.ticket_discount_id) })}>
          <StatusText id={Number(row.ticket_discount_status)} />
        </div>
      ),
    },
    {
      key: 'ticket_discount_comId', label: 'Action', width: '20%', align: 'right', render: (_, row) => (
        <div className='flex justify-end gap-2 min-w-max'>
          <TableActionButton
            onClick={() => handleEditDiscount(row.ticket_discount_id)}
            icon={<SquarePen className={`custom-size-tableAction-btn text-blue-500`} />}
            bgColor="bg-blue-50 text-blue-600"
            hoverColor="hover:bg-blue-100"
            title='Edit'
          />
          <TableActionButton
            onClick={() => handleDeleteTicketDiscount({ name: row.ticket_discount_name, id: row.ticket_discount_id })}
            icon={<Trash2 className={`custom-size-tableAction-btn text-red-600`} />}
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
      <div>
        <TitlePage title='Manage Ticket Types' description='View and manage ticket type information' btnText='Add New Type' handleOpenModel={handleOpenTicketTypeModal} />
        {isLoadingskeleton ? <SkeletonRoute /> :
          <TableTemplate
            columns={columnTicketType}
            data={rows}
            rowKey={(row) => row.id}
            height=''
          />
        }
      </div>
      <div className='mt-5'>
        <TitlePage title='Manage Ticket Discount Price' description='View and manage discount price information' btnText='Add a Discount' handleOpenModel={handleAddDiscount} />
        {isLoadingskeleton ? <SkeletonRoute /> :
          <TableTemplate
            columns={columnTicketDiscount}
            data={rowDiscount}
            rowKey={(row) => row.ticket_discount_id}
            height=''
          />
        }
        {showModel && (
          <TicketDiscountModel
            open={showModel}
            onClose={() => setShowModel(false)}
            onSave={handleSaveTicketDiscount}
            editingDiscount={
              editingDiscount
                ? {
                  name: editingDiscount.ticket_discount_name,
                  type: editingDiscount.ticket_discount_type,
                  value: editingDiscount.ticket_discount_value,
                }
                : null
            }
          />
        )}
        <ConfirmWithInput
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
          title={confirmDialogData?.mode === 'edit' ? 'Edit Price Type' : 'Add New Price Type'}
          text="Fill in the price type details below."
          confirmText="Confirm"
          cancelText="Cancel"
          placeholder="Type route name here"
          defaultValue={confirmDialogData?.name || ''}
          label="Route Name"
          onConfirm={handleTicketTypeConfirm}
        />

        <ConfirmWithInput
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          title={`Delete "${deleteDialogData?.name}"?`}
          text="Please type the route name below to confirm deletion."
          confirmText="Delete"
          cancelText="Cancel"
          placeholder="Type route name here"
          defaultValue=""
          label="Route Name"
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </>
  )
}

export default Page
