"use client";

import React, { useState, useEffect } from "react";
import TimeTable from "@/app/components/Table/TimeTable";
import TimeModal from "@/app/components/Modal/TimeModal";
import SearchFilter from "@/app/components/SearchFilter/TimeSearchFilter";
import PageHeader from "@/app/components/PageHeader/TimePageHeader";
import { TimeService, TimeItem } from "@/app/services/time.service";

function Page() {
  const [times, setTimes] = useState<TimeItem[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showModal, setShowModal] = useState(false);
  const [editingTime, setEditingTime] = useState<
    (TimeItem & { times?: string[]; startTime?: string }) | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTimes = async () => {
    setIsLoading(true);
    try {
      const res = await TimeService.fetchTimes(
        currentPage,
        rowsPerPage,
        searchTerm,
        statusFilter !== "All Status" ? statusFilter : undefined
      );
      setTimes(res.data);
      setTotalResults(res.total);
    } catch (err) {
      console.error("โหลดข้อมูลล้มเหลว", err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTimes();
  }, [currentPage, rowsPerPage, searchTerm, statusFilter]);

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
    status: string;
  }) => {
    const schedule =
      newTimeEntry.times.length > 0
        ? newTimeEntry.times
        : [newTimeEntry.startTime];

    if (editingTime) {
      await TimeService.updateTime(editingTime.id, {
        name: newTimeEntry.name,
        schedule,
        status: newTimeEntry.status,
      });
    } else {
      await TimeService.createTime({
        name: newTimeEntry.name,
        schedule,
        status: newTimeEntry.status,
      });
    }

    fetchTimes(); // รีโหลดข้อมูลหลังบันทึก
    handleCloseModal();
  };

  const handleDeleteTime = async (id: number) => {
    await TimeService.deleteTime(id);
    fetchTimes();
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
            <SearchFilter
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />

            <TimeTable
              times={times.map((time) => ({
                ...time,
                status:
                  time.status === "Active" || time.status === "Inactive"
                    ? time.status
                    : "Inactive",
              }))}
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
                  status:
                    editingTime.status === "Active" ||
                    editingTime.status === "Inactive"
                      ? editingTime.status
                      : "Inactive",
                }
              : undefined
          }
        />
      )}
    </div>
  );
}

export default Page;
