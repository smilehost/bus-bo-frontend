"use client";

import React, { useState, useEffect, useCallback } from "react";
import TimeTable from "@/app/components/Table/TimeTable";
import TimeModal from "@/app/components/Model/TimeModal";
import { useTimeStore } from "@/stores/timeStore";
import { debounce } from "@/utils/debounce";
import SkeletonManageTime from "@/app/components/Skeleton/SkeletonManageTime";
import { Confirm } from "@/app/components/Dialog/Confirm";
import { Alert } from "@/app/components/Dialog/Alert";
import TitlePage from "@/app/components/Title/TitlePage";
import ButtonBG from "@/app/components/Form/ButtonBG";

function Page() {
  const {
    times,
    total,
    isLoading,
    getTimes,
    createTime,
    updateTime,
    deleteTime,
  } = useTimeStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filteredTimes, setFilteredTimes] = useState(times); // State สำหรับผลลัพธ์การค้นหา
  const [showModal, setShowModal] = useState(false);
  const [editingTime, setEditingTime] = useState<
    ((typeof times)[0] & { times?: string[]; startTime?: string }) | undefined
  >(undefined);
  const [isLoadingskeleton, setIsLoadingskeleton] = useState(false);

  const debouncedFetch = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 350),
    []
  );

  useEffect(() => {
    getTimes(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    const filtered = times.filter((time) =>
      time.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
    setFilteredTimes(filtered);
  }, [debouncedSearch, times]);

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
      getTimes(currentPage, rowsPerPage);
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
      getTimes(currentPage, rowsPerPage);
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
      <div className="flex-1 flex flex-col p-7">
        <>
          {/* <PageHeader onAddTime={handleAddTime} /> */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
            <TitlePage
              title="Manage Time"
              description="View and manage time information"
            />
            <ButtonBG
              size="h-[38px]"
              text="Add New Time"
              icon="/icons/plus.svg"
              onClick={handleAddTime}
            />
          </div>

          <div className="bg-white rounded-md shadow p-5">
            {/* Search input */}
            <div className="flex justify-between mb-4">
              <input
                type="text"
                placeholder="Search by name..."
                className="border p-2 rounded-md w-full"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
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
                totalResults={filteredTimes.length}
                isLoading={isLoading}
              />
            )}
          </div>
        </>
      </div>

      {showModal && (
        <TimeModal
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
