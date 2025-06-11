"use client"

import { useCallback, useEffect, useState } from "react";
import TitlePage from "@/app/components/Title/TitlePage";
import React from "react";
import FormFilter from "../Filter/FormFilter";
import { statusOptions } from "@/constants/options";
import { FILTER, PAYMENT_TYPE, STATUS } from "@/constants/enum";
import TableTemplate, { ColumnConfig } from "../Table/TableTemplate";
import TableActionButton from "../Table/TableActionButton/TableActionButton";
import { SquarePen, Trash2 } from "lucide-react";
import StatusText from "../StatusText";
import { debounce } from "@/utils/debounce";
import { useSearchParams } from "next/navigation";

//store
import { usePaymentStore } from "@/stores/paymentStore";

import { withSkeletonDelay } from "../Skeleton/withSkeletonDelay";
import { getPaymentPayload, InsertPaymentPayload } from "@/payloads/payment.payload";
import SkeletonRoute from "../Skeleton/SkeletonRoute";
import { getTextRoute, useLanguageContext } from "@/app/i18n/translations";
import { toast } from "react-toastify";
import PaymentModel from "../Model/PaymentModel";
import { Confirm } from "../Dialog/Confirm";


export interface PaymentTableData extends getPaymentPayload {
  index?: number
  action?: number
}

export interface PaymentProps {
  name: string,
  url: string,
  type: PAYMENT_TYPE,
  slip: number
}

function ManagePaymentMethodPage() {
  //state
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchStatus, setSearchStatus] = useState<string>(FILTER.ALL_STATUS);
  const [isLoadingskeleton, setIsLoadingskeleton] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<InsertPaymentPayload | null>(
    null
  );
  const [rows, setRows] = useState<PaymentTableData[]>([]);

  const searchParams = useSearchParams();
  const com_id = searchParams.get("comId")
  const { isTH } = useLanguageContext();
  const text = getTextRoute({ isTH });

  //store
  const { paymentData, getPayments, createPayment, updatePayment, deletePayment, updatePaymentStatus, clearPayment } = usePaymentStore();


  //fetch tickets and discount
  const fetchPayments = async () => {
    const cancelSkeleton = withSkeletonDelay(setIsLoadingskeleton);
    await getPayments(Number(com_id));
    cancelSkeleton();
  };

  useEffect(() => {
    fetchPayments();
    return () => {
      clearPayment();
    };
  }, []);

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

  //filter
  const filterSearch = [
    {
      defaulteValue: FILTER.ALL_STATUS,
      listValue: statusOptions,
      setSearchValue: setSearchStatus,
      size: "w-[130px]",
    },

  ];

  const createData = (
    index: number,
    payment_method_id: number,
    payment_method_status: number,
    com_id: number,
    payment_method_name: string,
    payment_method_url: string,
    payment_method_type: string,
    payment_method_slip: number
  ): PaymentTableData => {
    return { index, payment_method_id, payment_method_status, com_id, payment_method_name, payment_method_url, payment_method_type, payment_method_slip };
  };

  useEffect(() => {
    const isReady = paymentData?.length;
    if (!isReady) {
      setRows([])
      return
    };
    const fetchWithTicketCounts = async () => {
      const newRows = await Promise.all(
        paymentData?.map(async (item, index) => {

          return createData(
            index + 1,
            item.payment_method_id,
            item.payment_method_status,
            item.com_id,
            item.payment_method_name,
            item.payment_method_url,
            item.payment_method_type,
            item.payment_method_slip,
          );
        })
      )  // กรองตาม searchStatus หลังจากสร้าง row เสร็จ
      let filteredRows = newRows.filter((item) =>
        searchStatus === FILTER.ALL_STATUS
          ? true
          : item.payment_method_status === Number(searchStatus)
      );

      // ถ้ามีการค้นหา ให้กรองจากชื่อด้วย (ไม่สนใจตัวพิมพ์เล็ก/ใหญ่)
      if (debouncedSearch.trim()) {
        filteredRows = filteredRows.filter((item) =>
          item.payment_method_name
            .toLowerCase()
            .includes(debouncedSearch.trim().toLowerCase())
        );
      }

      setRows(filteredRows);
    };
    fetchWithTicketCounts();
  }, [paymentData, debouncedSearch, searchStatus]);

  // Handle Change Status
  const handleChangeStatus = async ({ status, id }: { status: number, id: number }) => {
    const currentStatus = Number(status);
    const nextStatus = currentStatus === 1 ? 0 : 1;
    const statusText = nextStatus === 1 ? STATUS.ACTIVE : STATUS.INACTIVE;

    const isStatusConfirmed = await Confirm({
      title: text.changeStatusTitle,
      text: text.changeStatusText(statusText),
      confirmText: text.confirmText,
      cancelText: text.cancelText,
    });

    if (isStatusConfirmed) {
      const result = await updatePaymentStatus(id, nextStatus);
      if (result.success) {
        toast.success(text.successChangeStatus);
        fetchPayments();
      } else {
        toast.error(`${text.errorChangeStatus}: ${result.message}`)
      }
    }
  };

  //save
  const handleSave = async (data: {
    name: string;
    url: string;
    type: PAYMENT_TYPE;
    slip: number;
  }) => {
    const isConfirmed = await Confirm({
      title: editing ? "Confirm Update" : "Confirm Create",
      text: editing
        ? "Do you want to update this payment?"
        : "Do you want to create this payment?",
      confirmText: editing ? "Update" : "Create",
      cancelText: "Cancel",
      type: "question",
    });

    if (!isConfirmed) return;
    let checkSave: boolean = false
    if (editing) {
      const res = await updatePayment(editing.payment_method_id || 0, {
        payment_method_name: data.name,
        payment_method_url: data.url,
        payment_method_type: data.type,
        payment_method_slip: data.slip,
      });
      if (res.success) {
        checkSave = true
      }

    } else {
      const res = await createPayment({
        payment_method_name: data.name,
        payment_method_url: data.url,
        payment_method_type: data.type,
        payment_method_slip: data.slip,
      });
      if (res.success) {
        checkSave = true
      }

    }

    if (checkSave) {
      setIsModalOpen(false);
      fetchPayments();
      toast.success("save successfully!")
    } else {
      toast.error("error")
    }

  };

  const handleEdit = (id: number) => {
    const found = paymentData.find((c) => c.payment_method_id === id);

    if (found) setEditing(found);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditing(null);
    setIsModalOpen(true);
  };


  const handleDelete = async (id: number) => {
    const isConfirmed = await Confirm({
      title: "Confirm Delete",
      text: "Are you sure you want to delete this payment?",
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "warning",
    });

    if (!isConfirmed) return;
    const res = await deletePayment(id);
    if (res.success) {
      toast.success("deleted successfully")
      fetchPayments();
    } else {
      toast.error("deleted error")
    }

  };

  const columns: ColumnConfig<PaymentTableData>[] = [
    {
      key: 'index',
      label: 'No',
      width: '5%',
    },
    {
      key: 'payment_method_name', label: 'Name', width: '20%',
    },
    {
      key: 'payment_method_type', label: 'Type', width: '20%'
    },
    {
      key: 'payment_method_slip', label: 'Slip', width: '20%', render: (_, row) => (
        <div className=''
        >
          <p>{row.payment_method_slip === 1 ? "Need a slip image":"No need for a slip image"}</p>
        </div>
      ),
    },

    {
      key: 'payment_method_status',
      label: 'Status',
      width: '15%',
      render: (_, row) => (
        <div className='cursor-pointer'
          onClick={() => handleChangeStatus({ status: row.payment_method_status, id: row.payment_method_id })}
        >
          <StatusText id={Number(row.payment_method_status)} />
        </div>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      width: '25%',
      align: 'right',
      render: (_, row) => (
        <div className='flex gap-2 min-w-max justify-end'>
          <TableActionButton
            onClick={() => handleEdit(row.payment_method_id)}
            icon={<SquarePen className={`custom-size-tableAction-btn text-blue-500`} />}
            bgColor="bg-blue-50 text-blue-600"
            hoverColor="hover:bg-blue-100"
            title='Edit Payment'
          />
          <TableActionButton
            onClick={() => handleDelete(row.payment_method_id)}
            icon={<Trash2 className={`custom-size-tableAction-btn text-red-600`} />}
            bgColor="bg-red-50 text-red-600"
            hoverColor="hover:bg-red-100"
            title='Delete Payment'
          />
        </div>
      ),
    },
  ];
  return (
    <>
      <TitlePage
        title={`Payment Method Management`}
        description="View and manage Payment"
        btnText="Add New Payment"
        handleOpenModel={handleAdd}
      />
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

            rowKey={(row) => row.payment_method_id}
          />
        }


        {isModalOpen && (
          <PaymentModel
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
            editing={
              editing
                ? {
                  name: editing.payment_method_name,
                  url: editing.payment_method_url,
                  type: editing.payment_method_type,
                  slip: editing.payment_method_slip,
                }
                : undefined
            }
          />
        )}

      </div>
    </>
  );
}

export default ManagePaymentMethodPage;
