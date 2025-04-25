"use client";

import React, { useState } from "react";
// ลบการ import Navbar และ Header
import TimeTable from "../../components/Table/TimeTable";
import TimeModal from "../../components/Modal/TimeModal";
import SearchFilter from "../../components/SearchFilter/TimeSearchFilter";
import PageHeader from "../../components/PageHeader/TimePageHeader";

function Page() {
  const [times, setTimes] = useState<
    Array<{
      id: number;
      name: string;
      schedule: string;
      status: "Active" | "Inactive";
    }>
  >([
    {
      id: 1,
      name: "รอบเช้า",
      schedule: "08:00, 09:00, 15:00, 17:00",
      status: "Active",
    },
    {
      id: 2,
      name: "รอบบ่าย",
      schedule: "12:00, 13:00, 14:00",
      status: "Inactive",
    },
    // ...existing data...
  ]);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [editingTime, setEditingTime] = useState<{
    id: number;
    name: string;
    schedule: string;
    status: "Active" | "Inactive";
    times?: string[];
  } | undefined>(undefined);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleAddTime = () => {
    setEditingTime(undefined);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTime(undefined);
  };

  const handleSaveTime = (newTimeEntry: {
    name: string;
    startTime: string;
    times: string[];
    status: string;
  }) => {
    const schedule =
      newTimeEntry.times.length > 0
        ? newTimeEntry.times.join(", ")
        : newTimeEntry.startTime;

    const newTime = {
      id: editingTime
        ? editingTime.id
        : times.length > 0
        ? Math.max(...times.map((t) => t.id)) + 1
        : 1,
      name: newTimeEntry.name,
      schedule,
      status: newTimeEntry.status as "Active" | "Inactive",
    };

    if (editingTime) {
      setTimes(
        times.map((time) => (time.id === editingTime.id ? newTime : time))
      );
    } else {
      setTimes([...times, newTime]);
    }

    setSearchTerm(""); // รีเซตการค้นหา
    setStatusFilter("All Status"); // รีเซต filter ให้แสดงครบ
    setShowModal(false);
    setEditingTime(undefined);
  };

  const handleDeleteTime = (id: number) => {
    setTimes(times.filter((time) => time.id !== id));
  };

  const handleEditTime = (id: number) => {
    const timeToEdit = times.find((time) => time.id === id);
    if (timeToEdit) {
      const timesList = timeToEdit.schedule.includes(",")
        ? timeToEdit.schedule.split(",").map((t) => t.trim())
        : [];

      setEditingTime({
        ...timeToEdit,
        times: timesList,
      });

      setShowModal(true);
    }
  };

  // กรองข้อมูลตาม Search และ Status Filter
  const filteredTimes = times.filter(
    (time) =>
      time.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "All Status" ||
        (statusFilter === "Active" && time.status === "Active") ||
        (statusFilter === "Inactive" && time.status === "Inactive"))
  );

  // คำนวณข้อมูลที่จะแสดงในหน้าปัจจุบัน
  const paginatedTimes = filteredTimes.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* ลบ Navbar และ Header */}
      <div className="flex-1 flex flex-col">
        <div className="p-7">
          <PageHeader onAddTime={handleAddTime} />

          <div className="bg-white rounded-md shadow p-5">
            {/* Search Filter */}
            <SearchFilter
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />

            {/* Time Table */}
            <TimeTable
              times={paginatedTimes}
              onDelete={handleDeleteTime}
              onEdit={handleEditTime}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) =>
                setRowsPerPage(Number(e.target.value))
              }
              totalResults={filteredTimes.length}
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
                  times: editingTime.times || [],
                  startTime: editingTime.times?.[0] || "", // Provide a default startTime
                }
              : undefined
          }
        />
      )}
    </div>
  );
}

export default Page;