"use client";

import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Header from "../../components/Header/Header";
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
      status: string;
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
    {
      id: 3,
      name: "รอบเย็น",
      schedule: "18:00, 19:00",
      status: "Active",
    },
    {
      id: 4,
      name: "รอบดึก",
      schedule: "20:00, 21:00",
      status: "Inactive",
    },
    {
      id: 5,
      name: "รอบดึก",
      schedule: "22:00, 23:00",
      status: "Inactive",
    },
    {
      id: 6,
      name: "รอบดึก",
      schedule: "24:00, 25:00",
      status: "Inactive",
    },
    {
      id: 7,
      name: "รอบดึก",
      schedule: "26:00, 27:00",
      status: "Inactive",
    },
    {
      id: 8,
      name: "รอบดึก",
      schedule: "28:00, 29:00",
      status: "Inactive",
    },
    {
      id: 9,
      name: "รอบดึก",
      schedule: "30:00, 31:00",
      status: "Inactive",
    },
    {
      id: 10,
      name: "รอบดึก",
      schedule: "32:00, 33:00",
      status: "Inactive",
    },
    {
      id: 11,
      name: "รอบดึก",
      schedule: "34:00, 35:00",
      status: "Inactive",
    },
    {
      id: 12,
      name: "รอบดึก",
      schedule: "36:00, 37:00",
      status: "Inactive",
    },
    {
      id: 13,
      name: "รอบดึก",
      schedule: "38:00, 39:00",
      status: "Inactive",
    },
    {
      id: 14,
      name: "รอบดึก",
      schedule: "40:00, 41:00",
      status: "Inactive",
    },
    {
      id: 15,
      name: "รอบดึก",
      schedule: "42:00, 43:00",
      status: "Inactive",
    },
    // เพิ่มข้อมูลเพิ่มเติมตามต้องการ
  ]);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [editingTime, setEditingTime] = useState<{
    id: number;
    name: string;
    schedule: string;
    status: string;
  } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleAddTime = () => {
    setEditingTime(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTime(null);
  };

  const handleSaveTime = (newTimeEntry: {
    name: string;
    startTime: string;
    endTime: string;
    times: string[];
    status: string;
  }) => {
    const schedule =
      newTimeEntry.times.length > 0
        ? newTimeEntry.times.join(", ")
        : `${newTimeEntry.startTime} - ${newTimeEntry.endTime}`;

    const newTime = {
      id: editingTime
        ? editingTime.id
        : times.length > 0
        ? Math.max(...times.map((t) => t.id)) + 1
        : 1,
      name: newTimeEntry.name,
      schedule,
      status: newTimeEntry.status,
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
    setEditingTime(null);
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

      const [startTime, endTime] =
        !timesList.length && timeToEdit.schedule.includes("-")
          ? timeToEdit.schedule.split("-").map((t) => t.trim())
          : ["", ""];

      setEditingTime({
        ...timeToEdit,
        times: timesList,
        startTime,
        endTime,
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
      <Navbar />
      <div className="flex-1 flex flex-col">
        <Header />
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
          editingTime={editingTime}
        />
      )}
    </div>
  );
}

export default Page;
