"use client";

import React, { useEffect, useState, useCallback } from "react";
// import TimeTable from "@/app/components/Table/TimeTable";
import TimeModal from "@/app/components/Model/TimeModal";
import { useTimeStore } from "@/stores/timeStore";
import { debounce } from "@/utils/debounce";
import SkeletonManageTime from "@/app/components/Skeleton/SkeletonManageTime";
import { Confirm } from "@/app/components/Dialog/Confirm";
import { Alert } from "@/app/components/Dialog/Alert";
import { withSkeletonDelay } from "@/app/components/Skeleton/withSkeletonDelay";
import TitlePage from "@/app/components/Title/TitlePage";
import { toast, ToastContainer } from "react-toastify";
import TableTemplate, {
  ColumnConfig,
} from "@/app/components/Table/TableTemplate";
import TableActionButton from "@/app/components/Table/TableActionButton/TableActionButton";
import { Clock, SquarePen, Trash2 } from "lucide-react";
import { Tooltip } from "@mui/material";
import { getTextTimes, useLanguageContext } from "@/app/i18n/translations";
import FormFilter from "@/app/components/Filter/FormFilter";


function Page() {
  const { times, getTimes, createTime, updateTime, deleteTime } =
    useTimeStore();

  const [filteredTimes, setFilteredTimes] = useState<TimeItem[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showModal, setShowModal] = useState(false);


  // Define the interface for the time item
  interface TimeItem {
    id: number;
    name: string;
    schedule: string[];
    times?: string[];
    startTime?: string;
  }

  interface TimeTableProps {
    no: number;
    name: string;
    schedule: string[];
    id: number;
  }

  const [editingTime, setEditingTime] = useState<TimeItem | undefined>(
    undefined
  );
  // const [isLoading, setIsLoading] = useState(false);
  const [isLoadingskeleton, setIsLoadingskeleton] = useState(false);
  const { isTH } = useLanguageContext();
  const text = getTextTimes({ isTH });

  const fetchTimes = async () => {
    // setIsLoading(true);
    const cancelSkeleton = withSkeletonDelay(setIsLoadingskeleton);
    try {
      await getTimes(currentPage, rowsPerPage);
    } catch (error) {
      console.error("Failed to load data", error);
    }
    cancelSkeleton();
    // setIsLoading(false);
    setIsLoadingskeleton(false);
  };

  const filterTimes = useCallback(() => {
    let tempTimes = [...times];
    if (debouncedSearch) {
      tempTimes = tempTimes.filter((time) =>
        time.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }
    setFilteredTimes(tempTimes);
    setTotalResults(tempTimes.length);
  }, [times, debouncedSearch]);

  const debouncedFetch = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 350),
    []
  );

  useEffect(() => {
    fetchTimes();
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    filterTimes();
  }, [debouncedSearch, times, filterTimes]);

  const handleAddTime = () => {
    setEditingTime(undefined);
    setShowModal(true);
  };

  const handleEditTime = (id: number) => {
    const time = times.find((t) => t.id === id);
    if (time) {
      setEditingTime({
        ...time,
        times: time.schedule,
        startTime: time.schedule[0] || "",
      });
      setShowModal(true);
    }
  };

  const handleSaveTime = async (data: {
    name: string;
    startTime: string;
    times: string[];
  }) => {
    const schedule = data.times.length > 0 ? data.times : [data.startTime];
    setShowModal(false);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const isConfirmed = await Confirm({
      title: editingTime ? text.confirmUpdateTitle : text.confirmCreateTitle,
      text: editingTime
        ? text.confirmUpdateText
        : text.confirmCreateText,
      confirmText: editingTime ? text.confirmTextUpdate : text.confirmTextCreate,
      cancelText: text.btnCancle,
      type: "question",
    });

    if (!isConfirmed) return;

    try {
      if (editingTime) {
        await updateTime(editingTime.id, data.name, schedule);
        await Alert({
          title: text.updatedTitle,
          text: text.updatedText,
          type: "success",
        });
      } else {
        await createTime(data.name, schedule);
        await Alert({
          title: text.createdTitle,
          text: text.createdText,
          type: "success",
        });
      }
      setShowModal(false);
      fetchTimes();
    } catch (error) {
      console.error("Save Time error:", error);
      await Alert({
        title: text.errorTitle,
        text: text.errorText,
        type: "error",
      });
    }
  };

  const handleDeleteTime = async (id: number) => {
    const isConfirmed = await Confirm({
      title: text.confirmDeleteTitle,
      text: text.confirmDeleteText,
      confirmText: text.deleteConfirmText,
      cancelText: text.btnCancle,
      type: "warning",
    });

    if (!isConfirmed) return;

    const result = await deleteTime(id);
      if (result.success) {
        fetchTimes();
        toast.success(`${text.deletedText}`);
      } else {
        toast.error(`${text.errorText}`);
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

  const paginatedTimes = filteredTimes.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const paginatedWithNo = paginatedTimes.map((time, index) => ({
    ...time,
    no: (currentPage - 1) * rowsPerPage + index + 1,
  }));

  //columns
  const columns: ColumnConfig<TimeTableProps>[] = [
    {
      key: "no",
      label: text.no,
      width: "20%",
      align: "left",
    },
    {
      key: "name",
      label: text.name,
      width: "20%",
      align: "left",
    },
    {
      key: 'schedule', label: text.schedule, width: '20%', align: 'left', render: (_, row) => (
        <Tooltip title={row.schedule.join(", ")}>
          <div className="flex items-center gap-2 custom-ellipsis-style">
            <div className="shrink-0">
              <Clock className={`custom-size-tableAction-btn text-blue-500 `} />
            </div>
            <p className="whitespace-nowrap custom-ellipsis-style">
              {" "}
              {row.schedule.join(", ")}
            </p>
          </div>
        </Tooltip>
      ),
    },
    {
      key: "id",
      label: text.action,
      width: "25%",
      align: "right",
      render: (_, row) => (
        <div className="flex justify-end gap-2 min-w-max">
          <TableActionButton
            onClick={() => handleEditTime(row.id)}
            icon={
              <SquarePen
                className={`custom-size-tableAction-btn text-blue-500`}
              />
            }
            bgColor="bg-blue-50 text-blue-600"
            hoverColor="hover:bg-blue-100"
            title={text.editTime}
          />
          <TableActionButton
            onClick={() => handleDeleteTime(row.id)}
            icon={
              <Trash2 className={`custom-size-tableAction-btn text-red-600`} />
            }
            bgColor="bg-red-50 text-red-600"
            hoverColor="hover:bg-red-100"
            title={text.delete}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="flex-1 flex flex-col p-0">
        <TitlePage
          title={text.title}
          description={text.Subtitle}
          btnText={text.btnAdd}
          handleOpenModel={handleAddTime}
        />
        <div className="custom-frame-content p-5 mt-5">
          <FormFilter
            setSearch={(value: string) =>
              handleSearchChange({
                target: { value },
              } as React.ChangeEvent<HTMLInputElement>)
            }
            placeholderSearch={text.search}
            search={searchTerm}
          />
          {/* <SearchFilter
            searchTerm={searchTerm}
            setSearchTerm={(value: string) =>
              handleSearchChange({
                target: { value },
              } as React.ChangeEvent<HTMLInputElement>)
            }
          /> */}
          {isLoadingskeleton ? (
            <SkeletonManageTime rows={5} />
          ) : (
            <div className="w-full overflow-x-auto">
              <TableTemplate
                columns={columns}
                data={paginatedWithNo}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                totalPages={Math.ceil(totalResults / rowsPerPage)}
                totalResults={totalResults}
                onPageChange={setCurrentPage}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowKey={(row) => row.id}
              />
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <TimeModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveTime}
          editingTime={
            editingTime
              ? {
                ...editingTime,
                startTime: editingTime.startTime || "",
                times: editingTime.times || [],
              }
              : undefined
          }
        />
      )}
    </div>
  );
}

export default Page;
