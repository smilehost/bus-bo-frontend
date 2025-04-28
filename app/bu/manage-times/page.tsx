"use client";

import React, { useState, useEffect, useCallback } from "react";
import TimeTable from "@/app/components/Table/TimeTable";
import TimeModal from "@/app/components/Modal/TimeModal";
import PageHeader from "@/app/components/PageHeader/TimePageHeader";
import { ManageTimeController } from "@/controllers/manageTime.controller";
import { TimeItem } from "@/types/time.type";
import { debounce } from "@/utils/debounce";

function Page() {
  const [times, setTimes] = useState<TimeItem[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTime, setEditingTime] = useState<
    (TimeItem & { times?: string[]; startTime?: string }) | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTimes = async (search?: string) => {
    setIsLoading(true);
    try {
      const res = await ManageTimeController.fetchTimes(
        currentPage,
        rowsPerPage,
        search
      );
      setTimes(res.data);
      setTotalResults(res.total);
    } catch (error) {
      console.error("โหลดข้อมูลล้มเหลว", error);
    }
    setIsLoading(false);
  };

  const debouncedFetch = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 350),
    []
  );

  useEffect(() => {
    fetchTimes(debouncedSearch);
  }, [currentPage, rowsPerPage, debouncedSearch]);

  const handleAddTime = () => {
    setEditingTime(undefined);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTime(undefined);
  };

  const handleSaveTime = async (newTimeEntry: {
    name: string;
    startTime: string;
    times: string[];
  }) => {
    const schedule =
      newTimeEntry.times.length > 0
        ? newTimeEntry.times
        : [newTimeEntry.startTime];

    try {
      if (editingTime) {
        await ManageTimeController.updateTime(
          editingTime.id,
          newTimeEntry.name,
          schedule
        );
      } else {
        await ManageTimeController.createTime(newTimeEntry.name, schedule);
      }
      await fetchTimes(debouncedSearch);
      handleCloseModal();
    } catch (error) {
      console.error("Save Time error:", error);
    }
  };

  const handleDeleteTime = async (id: number) => {
    try {
      await ManageTimeController.deleteTime(id);
      await fetchTimes(debouncedSearch);
    } catch (error) {
      console.error("Delete Time error:", error);
    }
  };

  const handleEditTime = (id: number) => {
    const timeToEdit = times.find((time) => time.id === id);
    if (timeToEdit) {
      setEditingTime({
        ...timeToEdit,
        times: timeToEdit.schedule,
        startTime: timeToEdit.schedule[0] || "",
      });
      setShowModal(true);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col">
        <div className="p-7">
          <PageHeader onAddTime={handleAddTime} />

          <div className="bg-white rounded-md shadow p-5">
            {/* Search input with debounce */}
            <div className="flex justify-between mb-4">
              <input
                type="text"
                placeholder="Search by name..."
                className="border p-2 rounded-md w-full"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  debouncedFetch(e.target.value);
                }}
              />
            </div>

            <TimeTable
              times={times}
              isLoading={isLoading}
              onDelete={handleDeleteTime}
              onEdit={handleEditTime}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) =>
                setRowsPerPage(Number(e.target.value))
              }
              totalResults={totalResults}
            />
          </div>
        </div>
      </div>

      {showModal && (
        <TimeModal
          onClose={handleCloseModal}
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
