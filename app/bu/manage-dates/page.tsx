"use client";

import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Header from "../../components/Header/Header";
import DateTable from "../../components/Table/DateTable";
import DateModal from "../../components/Modal/DateModal";
import SearchFilter from "../../components/SearchFilter/DateSearchFilter";
import PageHeader from "../../components/PageHeader/DatePageHeader";

function Page() {
  const [dates, setDates] = useState([
    {
      id: 1,
      name: "Daily",
      days: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true,
      },
      status: "Active",
    },
    {
      id: 2,
      name: "Weekly",
      days: {
        monday: false,
        tuesday: true,
        wednesday: false,
        thursday: true,
        friday: false,
        saturday: true,
        sunday: false,
      },
      status: "Inactive",
    },
    {
      id: 3,
      name: "Monthly",
      days: {
        monday: true,
        tuesday: false,
        wednesday: true,
        thursday: false,
        friday: true,
        saturday: false,
        sunday: true,
      },
      status: "Active",
    },
    {
      id: 4,
      name: "Yearly",
      days: {
        monday: false,
        tuesday: true,
        wednesday: false,
        thursday: true,
        friday: false,
        saturday: true,
        sunday: false,
      },
      status: "Inactive",
    },
    {
      id: 5,
      name: "Custom",
      days: {
        monday: true,
        tuesday: true,
        wednesday: false,
        thursday: false,
        friday: true,
        saturday: false,
        sunday: true,
      },
      status: "Active",
    },
    {
      id: 6,
      name: "Special",
      days: {
        monday: false,
        tuesday: true,
        wednesday: true,
        thursday: false,
        friday: false,
        saturday: true,
        sunday: true,
      },
      status: "Inactive",
    },
    {
      id: 7,
      name: "Holiday",
      days: {
        monday: true,
        tuesday: false,
        wednesday: true,
        thursday: false,
        friday: true,
        saturday: false,
        sunday: true,
      },
      status: "Active",
    },
    {
      id: 8,
      name: "Weekend",
      days: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: true,
        sunday: true,
      },
      status: "Inactive",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [editingDate, setEditingDate] = useState<{
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
    status: string;
  } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleAddDate = () => {
    setEditingDate(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDate(null);
  };

  const handleSaveDate = (newDateEntry: {
        name: string;
        startDate: string;
        endDate: string;
        days: {
          monday: boolean;
          tuesday: boolean;
          wednesday: boolean;
          thursday: boolean;
          friday: boolean;
          saturday: boolean;
          sunday: boolean;
        };
        status: string;
      }) => {
    if (editingDate) {
      // กรณีแก้ไขรายการเดิม
      setDates(
        dates.map((date) =>
          date.id === editingDate.id
            ? { ...newDateEntry, id: editingDate.id }
            : date
        )
      );
    } else {
      // กรณีเพิ่มรายการใหม่
      setDates([...dates, { ...newDateEntry, id: dates.length ? dates[dates.length - 1].id + 1 : 1 }]);
    }
    setShowModal(false);
    setEditingDate(null);
  };

  const handleDeleteDate = (id: number) => {
    setDates(dates.filter((date) => date.id !== id));
  };

  const handleEditDate = (id: number) => {
    const dateToEdit = dates.find((date) => date.id === id);
    if (dateToEdit) {
      setEditingDate(dateToEdit);
      setShowModal(true);
    }
  };

  // กรองข้อมูลตาม Search และ Status Filter
  const filteredDates = dates.filter(
    (date) =>
      date.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "All Status" ||
        (statusFilter === "Active" && date.status === "Active") ||
        (statusFilter === "Inactive" && date.status === "Inactive"))
  );

  // คำนวณข้อมูลที่จะแสดงในหน้าปัจจุบัน
  const paginatedDates = filteredDates.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="p-7">
          <PageHeader onAddDate={handleAddDate} />

          <div className="bg-white rounded-md shadow p-5">
            <SearchFilter
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />

            <DateTable
              dates={paginatedDates}
              onDelete={handleDeleteDate}
              onEdit={handleEditDate}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => setRowsPerPage(Number(e.target.value))}
              totalResults={filteredDates.length}
            />
          </div>
        </div>
      </div>

      {showModal && (
        <DateModal
          onClose={handleCloseModal}
          onSave={handleSaveDate}
          editingDate={editingDate || undefined}
        />
      )}
    </div>
  );
}

export default Page