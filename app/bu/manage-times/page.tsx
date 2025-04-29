"use client";

import React, { useState, useEffect, useCallback } from "react";
import TimeTable from "@/app/components/Table/TimeTable";
import TimeModal from "@/app/components/Model/TimeModal";
import PageHeader from "@/app/components/PageHeader/TimePageHeader";
import { ManageTimeController } from "@/controllers/manageTime.controller";
import { TimeItem } from "@/types/time.type";
import { debounce } from "@/utils/debounce";
import SkeletonManageTime from "@/app/components/Skeleton/SkeletonManageTime";

function Page() {
  const [allTimes, setAllTimes] = useState<TimeItem[]>([]); // Store all data
  const [filteredTimes, setFilteredTimes] = useState<TimeItem[]>([]);
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
  const [isLoadingskeleton, setIsLoadingskeleton] = useState(true);
  useEffect(() => {
          // Simulate fetching data (fake delay)
          const timer = setTimeout(() => setIsLoadingskeleton(false), 1000);
          return () => clearTimeout(timer);
        }, []);

  // Fetch all times from the backend
  const fetchTimes = async () => {
    setIsLoading(true);
    try {
      const res = await ManageTimeController.fetchTimes(
        currentPage,
        rowsPerPage,
        debouncedSearch
      );
      setAllTimes(res.data);
    } catch (error) {
      console.error("Failed to load data", error);
    }
    setIsLoading(false);
  };

  // Filter times based on search term
  const filterTimes = useCallback(() => {
    let tempTimes = [...allTimes];

    if (debouncedSearch) {
      tempTimes = tempTimes.filter((time) =>
        time.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    setFilteredTimes(tempTimes);
    setTotalResults(tempTimes.length);
    setCurrentPage(1); // Reset to the first page on filter change
  }, [allTimes, debouncedSearch]);

  const debouncedFetch = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 350),
    []
  );

  useEffect(() => {
    fetchTimes();
  }, []);

  useEffect(() => {
    filterTimes();
  }, [debouncedSearch, allTimes]);

  const handleAddTime = () => {
    setEditingTime(undefined);
    setShowModal(true);
  };

  const handleEditTime = (id: number) => {
    const time = allTimes.find((t) => t.id === id);
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

    try {
      if (editingTime) {
        await ManageTimeController.updateTime(
          editingTime.id,
          data.name,
          schedule
        );
      } else {
        await ManageTimeController.createTime(data.name, schedule);
      }
      setShowModal(false);
      fetchTimes();
    } catch (error) {
      console.error("Save Time error:", error);
    }
  };

  const handleDeleteTime = async (id: number) => {
    try {
      await ManageTimeController.deleteTime(id);
      fetchTimes();
    } catch (error) {
      console.error("Delete Time error:", error);
    }
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
        <PageHeader onAddTime={handleAddTime} />
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

          <TimeTable
            times={paginatedTimes.map((time) => ({
              ...time,
            }))}
            onEdit={handleEditTime}
            onDelete={handleDeleteTime}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => setRowsPerPage(Number(e.target.value))}
            totalResults={totalResults}
            isLoading={isLoading}
          />
        </div>
      )}

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
