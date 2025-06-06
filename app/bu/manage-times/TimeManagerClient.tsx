"use client";

import React, { useEffect, useState, useCallback } from "react";
import TimeTable from "@/app/components/Table/TimeTable";
import TimeModal from "@/app/components/Model/TimeModal";
import SearchFilter from "@/app/components/SearchFilter/TimeSearchFilter"; // ✅ Import SearchFilter
import { useTimeStore } from "@/stores/timeStore";
import { debounce } from "@/utils/debounce";
import SkeletonManageTime from "@/app/components/Skeleton/SkeletonManageTime";
import { Confirm } from "@/app/components/Dialog/Confirm";
import { Alert } from "@/app/components/Dialog/Alert";
import { withSkeletonDelay } from "@/app/components/Skeleton/withSkeletonDelay";
import TitlePage from "@/app/components/Title/TitlePage";
import { ToastContainer } from "react-toastify";

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

  const [editingTime, setEditingTime] = useState<TimeItem | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingskeleton, setIsLoadingskeleton] = useState(false);

  const fetchTimes = async () => {
    setIsLoading(true);
    const cancelSkeleton = withSkeletonDelay(setIsLoadingskeleton);
    try {
      await getTimes(currentPage, rowsPerPage);
    } catch (error) {
      console.error("Failed to load data", error);
    }
    cancelSkeleton();
    setIsLoading(false);
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
      title: editingTime ? "Confirm Update" : "Confirm Create",
      text: editingTime
        ? "Do you want to update this time?"
        : "Do you want to create this time?",
      confirmText: editingTime ? "Update" : "Create",
      cancelText: "Cancel",
      type: "question",
    });

    if (!isConfirmed) return;

    try {
      if (editingTime) {
        await updateTime(editingTime.id, data.name, schedule);
        await Alert({
          title: "Updated!",
          text: "Time updated successfully",
          type: "success",
        });
      } else {
        await createTime(data.name, schedule);
        await Alert({
          title: "Created!",
          text: "Time created successfully",
          type: "success",
        });
      }
      setShowModal(false);
      fetchTimes();
    } catch (error) {
      console.error("Save Time error:", error);
      await Alert({
        title: "Error!",
        text: "Something went wrong.",
        type: "error",
      });
    }
  };

  const handleDeleteTime = async (id: number) => {
    const isConfirmed = await Confirm({
      title: "Confirm Delete",
      text: "Are you sure you want to delete this time?",
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "warning",
    });

    if (!isConfirmed) return;

    try {
      await deleteTime(id);
      await Alert({
        title: "Deleted!",
        text: "Time deleted successfully",
        type: "success",
      });
      fetchTimes();
    } catch (error) {
      console.error("Delete Time error:", error);
      await Alert({
        title: "Error!",
        text: "Failed to delete.",
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

  const paginatedTimes = filteredTimes.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <ToastContainer />
      <div className="flex-1 flex flex-col p-0">
        <TitlePage
          title="Manage Time"
          description="View and manage time information"
          btnText="Add New Time"
          handleOpenModel={handleAddTime}
        />
        <div className="bg-white rounded-md shadow p-5 mt-5 ">
          <SearchFilter
            searchTerm={searchTerm}
            setSearchTerm={(value: string) =>
              handleSearchChange({
                target: { value },
              } as React.ChangeEvent<HTMLInputElement>)
            }
          />
          {isLoadingskeleton ? (
            <SkeletonManageTime rows={5} />
          ) : (
            <TimeTable
              times={paginatedTimes.map((time) => ({
                ...time,
              }))}
              onEdit={handleEditTime}
              onDelete={handleDeleteTime}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              totalResults={totalResults}
              isLoading={isLoading}
            />
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
