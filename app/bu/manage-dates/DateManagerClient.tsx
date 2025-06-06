"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useDateStore } from "@/stores/dateStore";
import DateModal from "@/app/components/Model/DateModal";
import { debounce } from "@/utils/debounce";
import SkeletonDateTable from "@/app/components/Skeleton/SkeletonDateTable";
import { Alert } from "@/app/components/Dialog/Alert";
import { DateItem } from "@/types/date";
import { withSkeletonDelay } from "@/app/components/Skeleton/withSkeletonDelay";
import { Confirm } from "@/app/components/Dialog/Confirm";
import TitlePage from "@/app/components/Title/TitlePage";
import { ToastContainer } from "react-toastify";
import TableTemplate, {
  ColumnConfig,
} from "@/app/components/Table/TableTemplate";
import TableActionButton from "@/app/components/Table/TableActionButton/TableActionButton";
import { SquarePen, Trash2 } from "lucide-react";
import { getTextDateManagement, useLanguageContext } from "@/app/i18n/translations";
import FormFilter from "@/app/components/Filter/FormFilter";
import { FILTER } from "@/constants/enum";
import { statusOptions } from "@/constants/options";
import { Tooltip } from "@mui/material";
import StatusText from "@/app/components/StatusText";


type DateTableProps = {
  no: number;
  id: number;
  name: string;
  days: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  endDate: string;
  status: number;
};

export default function DateManagerClient() {
  const { dates, getDates, createDate, updateDate, deleteDate } =
    useDateStore();

  const [filteredDates, setFilteredDates] = useState(dates);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingDate, setEditingDate] = useState<DateItem | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingskeleton, setIsLoadingskeleton] = useState(false);
  const { isTH } = useLanguageContext();
  const text = getTextDateManagement({isTH});

  const fetchDates = async () => {
    setIsLoading(true);
    const cancelSkeleton = withSkeletonDelay(setIsLoadingskeleton);
    try {
      await getDates(currentPage, rowsPerPage);
    } catch (error) {
      console.error("Failed to load data", error);
    }
    cancelSkeleton();
    setIsLoading(false);
    setIsLoadingskeleton(false);
  };

  const filterDates = useCallback(() => {
    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ); // ตัดเวลาออก

    let tempDates = [...dates].map((date) => {
      const endDate = new Date(date.endDate);
      const endDateStart = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate()
      );

      const isExpired = endDateStart < todayStart;

      return {
        ...date,
        status: isExpired ? 0 : date.status, // Map "Inactive" to 0
      };
    });

    if (debouncedSearch) {
      tempDates = tempDates.filter((date) =>
        date.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (statusFilter !== "" && statusFilter !== FILTER.ALL_STATUS) {
      tempDates = tempDates.filter((date) => date.status === Number(statusFilter));
    }

    setFilteredDates(tempDates);
    setTotalResults(tempDates.length);
    setCurrentPage(1);
  }, [dates, debouncedSearch, statusFilter]);

  const debouncedFetch = useCallback(
    debounce((value) => {
      setDebouncedSearch(value);
    }, 350),
    []
  );

  useEffect(() => {
    fetchDates();
  }, []);

  useEffect(() => {
    filterDates();
  }, [debouncedSearch, statusFilter, dates]);

  const handleAddDate = () => {
    setEditingDate(undefined);
    setShowModal(true);
  };

  const handleEditDate = (id: number) => {
    const date = dates.find((d) => d.id === id);
    if (date) {
      setEditingDate(date);
      setShowModal(true);
    }
  };

  const handleSaveDate = async (data: {
    days: {
      monday: boolean;
      tuesday: boolean;
      wednesday: boolean;
      thursday: boolean;
      friday: boolean;
      saturday: boolean;
      sunday: boolean;
    };
    [key: string]: any;
  }) => {
    const schedule = {
      mon: data.days.monday,
      tue: data.days.tuesday,
      wed: data.days.wednesday,
      thu: data.days.thursday,
      fri: data.days.friday,
      sat: data.days.saturday,
      sun: data.days.sunday,
    };

    setShowModal(false);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const isConfirmed = await Confirm({
      title: editingDate ? text.confirmTitleUpdate : text.confirmTitleCreate,
      text: editingDate
        ? text.confirmTextUpdate
        : text.confirmTextCreate,
      confirmText: editingDate ? text.updateTitle : text.createTitle,
      cancelText: text.confirmTextCancel,
      type: "question",
    });

    if (!isConfirmed) {
      setShowModal(true);
      return;
    }

    try {
      if (editingDate) {
        await updateDate(editingDate.id, {
          id: editingDate.id,
          name: editingDate.name,
          startDate: editingDate.startDate,
          endDate: editingDate.endDate,
          status: editingDate.status,
          ...data,
          days: schedule,
        });
        await Alert({
          title: text.updatedTitle,
          text: text.updatedText,
          type: "success",
        });
      } else {
        await createDate({
          id: 0,
          name: data.name || "",
          startDate: data.startDate || "",
          endDate: data.endDate || "",
          status: data.status || "Active",
          ...data,
          days: schedule,
        });
        await Alert({
          title: text.createdTitle,
          text: text.createdText,
          type: "success",
        });
      }
      setShowModal(false);
      fetchDates();
    } catch (error) {
      await Alert({
        title: text.errorTitle,
        text: text.errorTextSave,
        type: "error",
      });
    }
  };

  const handleDeleteDate = async (id: number) => {
    const isConfirmed = await Confirm({
      title: text.deleteConfirmTitle,
      text: text.deleteConfirmText,
      confirmText: text.deleteConfirmButton,
      cancelText: text.confirmTextCancel,
      type: "warning",
    });
    if (!isConfirmed) return;

    try {
      await deleteDate(id);
      await Alert({
        title: text.deletedTitle,
        text: text.deletedText,
        type: "success",
      });
      fetchDates();
    } catch (error) {
      await Alert({
        title: text.errorTitle,
        text: text.errorTextDelete,
        type: "error",
      });
    }
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRowsPerPage = Number(e.target.value);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedFetch(e.target.value);
  };

  // const handleStatusFilterChange = (value: string) => {
  //   setStatusFilter(value);
  // };

  const paginatedDates = filteredDates.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const dayKeys = [
    { key: "monday", label: isTH ? "วันจันทร์" : "Monday" },
    { key: "tuesday", label: isTH ? "วันอังคาร" : "Tuesday" },
    { key: "wednesday", label: isTH ? "วันพุธ" : "Wednesday" },
    { key: "thursday", label: isTH ? "วันพฤหัสบดี" : "Thursday" },
    { key: "friday", label: isTH ? "วันศุกร์" : "Friday" },
    { key: "saturday", label: isTH ? "วันเสาร์" : "Saturday" },
    { key: "sunday", label: isTH ? "วันอาทิตย์" : "Sunday" },
  ];

  const columns: ColumnConfig<DateTableProps>[] = [
    {
      key: "no",
      label: text.no,
      width: "6%",
      align: "center",
      render: (_: unknown, row: DateTableProps) => <span>{row.no}</span>,
    },
    {
      key: "name",
      label: text.name,
      width: "16%",
      align: "left",
      render: (_: unknown, row: DateTableProps) => <span>{row.name}</span>,
    },
    ...dayKeys.map(({ key, label }) => ({
      key: `days.${key}` as keyof DateTableProps,
      label,
      width: "8%",
      align: "center" as const,
      render: (_: unknown, row: DateTableProps) => {
        const value = row.days[key as keyof typeof row.days];
        return value ? (
          <span className="inline-flex items-center justify-center w-7 h-7 bg-green-100 text-green-600 rounded-full shadow-sm transition-transform hover:scale-110">
            ✓
          </span>
        ) : (
          <span className="inline-flex items-center justify-center w-7 h-7 bg-red-100 text-red-600 rounded-full shadow-sm transition-transform hover:scale-110">
            ✕
          </span>
        );
      },
    })),
    {
      key: "status",
      label: text.status,
      width: "10%",
      align: "center",
      render: (_: unknown, row: DateTableProps) =>
        row.status === 1 ? (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 shadow-sm">
            <span className="mr-1.5 h-2 w-2 rounded-full bg-green-500"></span>
            <span>{isTH ? "ใช้งาน" : "Active"}</span>
          </span>
        ) : (
          <Tooltip title={`${isTH ? "หมดอายุ" : "Expires on"} ${row.endDate}`}>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 shadow-sm">
              <span className="mr-1.5 h-2 w-2 rounded-full bg-red-500"></span>
              <span>{isTH ? "ไม่ใช้งาน" : "Inactive"}</span>
            </span>
          </Tooltip>
        ),
    },
    {
      key: "id",
      label: text.action,
      width: "12%",
      align: "center",
      render: (_: unknown, row: DateTableProps) => (
        <div className="flex justify-center space-x-2">
          <TableActionButton
            onClick={() => handleEditDate(row.id)}
            icon={
              <SquarePen className="custom-size-tableAction-btn text-blue-500" />
            }
            bgColor="bg-blue-50 text-blue-600"
            hoverColor="hover:bg-blue-100"
            title={text.edit}
          />
          <TableActionButton
            onClick={() => handleDeleteDate(row.id)}
            icon={
              <Trash2 className="custom-size-tableAction-btn text-red-600" />
            }
            bgColor="bg-red-50 text-red-600"
            hoverColor="hover:bg-red-100"
            title={text.deleteConfirmButton}
          />
        </div>
      ),
    },
  ];

  const paginatedWithNo = paginatedDates.map((date, idx) => ({
    ...date,
    no: (currentPage - 1) * rowsPerPage + idx + 1,
    days: {
      monday: date.days.mon,
      tuesday: date.days.tue,
      wednesday: date.days.wed,
      thursday: date.days.thu,
      friday: date.days.fri,
      saturday: date.days.sat,
      sunday: date.days.sun,
    },
  }));

  //filter
  const filterSearch = [
    {
      defaulteValue: FILTER.ALL_STATUS,
      listValue: statusOptions,
      setSearchValue: setStatusFilter,
      size: "w-[130px]",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="flex-1 flex flex-col p-0">
        <TitlePage
          title={text.dateTitle}
          description={text.dateSubTitle}
          btnText={text.addDate}
          handleOpenModel={handleAddDate}
        />
        <div className="custom-frame-content p-5 mt-5">
          {/* <SearchFilter
            searchTerm={searchTerm}
            setSearchTerm={handleSearchChange}
            statusFilter={statusFilter}
            setStatusFilter={handleStatusFilterChange}
          /> */}
          <FormFilter
            setSearch={(value: string) =>
              handleSearchChange({
                target: { value },
              } as React.ChangeEvent<HTMLInputElement>)
            }
            placeholderSearch={text.search}
            filter={filterSearch}
            search={searchTerm}
          />
          {isLoadingskeleton ? (
            <SkeletonDateTable count={5} />
          ) : (
            <div className="overflow-x-auto">
              <TableTemplate
                columns={columns}
                data={paginatedWithNo}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                totalPages={Math.ceil(totalResults / rowsPerPage)}
                totalResults={totalResults}
                onPageChange={setCurrentPage}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowKey={(row: DateTableProps) => row.id}
                loading={isLoading}
              />
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <DateModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveDate}
          editingDate={
            editingDate
              ? {
                  ...editingDate,
                  days: {
                    monday: editingDate.days.mon,
                    tuesday: editingDate.days.tue,
                    wednesday: editingDate.days.wed,
                    thursday: editingDate.days.thu,
                    friday: editingDate.days.fri,
                    saturday: editingDate.days.sat,
                    sunday: editingDate.days.sun,
                  },
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
