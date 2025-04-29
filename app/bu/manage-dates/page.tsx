"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ManageDateController } from "@/controllers/manageDate.controller";
import { DateItem } from "@/types/date.type";
import DateTable from "@/app/components/Table/DateTable";
import PageHeader from "@/app/components/PageHeader/DatePageHeader";
import DateModal from "@/app/components/Model/DateModal";
import SearchFilter from "@/app/components/SearchFilter/DateSearchFilter";
import { debounce } from "@/utils/debounce";

function Page() {
  const [allDates, setAllDates] = useState<DateItem[]>([]); // เก็บข้อมูลทั้งหมด
  const [filteredDates, setFilteredDates] = useState<DateItem[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  const [showModal, setShowModal] = useState(false);
  const [editingDate, setEditingDate] = useState<DateItem | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  // ดึงข้อมูลทั้งหมดจาก backend (ครั้งเดียว)
  const fetchDates = async () => {
    setIsLoading(true);
    try {
      const res = await ManageDateController.fetchDates(currentPage, rowsPerPage, debouncedSearch, statusFilter !== "All Status" ? statusFilter : undefined);
      setAllDates(res.data); 
    } catch (error) {
      console.error("โหลดข้อมูลล้มเหลว", error);
    }
    setIsLoading(false);
  };

  // เมื่อ search term หรือ status เปลี่ยน ➔ filter ฝั่ง frontend
  const filterDates = useCallback(() => {
    let tempDates = [...allDates];

    if (debouncedSearch) {
      tempDates = tempDates.filter(date =>
        date.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (statusFilter !== "All Status") {
      tempDates = tempDates.filter(date => date.status === statusFilter);
    }

    setFilteredDates(tempDates);
    setTotalResults(tempDates.length);
    setCurrentPage(1); // reset ไปหน้าแรกทุกครั้งที่ search/filter
  }, [allDates, debouncedSearch, statusFilter]);

  const debouncedFetch = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 350),
    []
  );

  useEffect(() => {
    fetchDates();
  }, []);

  useEffect(() => {
    filterDates();
  }, [debouncedSearch, statusFilter, allDates]);

  const handleAddDate = () => {
    setEditingDate(undefined);
    setShowModal(true);
  };

  const handleEditDate = (id: number) => {
    const date = allDates.find((d) => d.id === id);
    if (date) {
      setEditingDate(date);
      setShowModal(true);
    }
  };

  const handleSaveDate = async (data: {
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
    const date: DateItem = {
      id: editingDate?.id || 0,
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      days: {
        mon: data.days.monday,
        tue: data.days.tuesday,
        wed: data.days.wednesday,
        thu: data.days.thursday,
        fri: data.days.friday,
        sat: data.days.saturday,
        sun: data.days.sunday,
      },
      status: data.status,
    };

    if (editingDate) {
      await ManageDateController.updateDate(editingDate.id, date);
    } else {
      await ManageDateController.createDate(date);
    }
    setShowModal(false);
    fetchDates();
  };

  const handleDeleteDate = async (id: number) => {
    await ManageDateController.deleteDate(id);
    fetchDates();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedFetch(e.target.value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const paginatedDates = filteredDates.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col p-7">
        <PageHeader onAddDate={handleAddDate} />
        <div className="bg-white rounded-md shadow p-5">
          <SearchFilter
            searchTerm={searchTerm}
            setSearchTerm={handleSearchChange}
            statusFilter={statusFilter}
            setStatusFilter={handleStatusFilterChange}
          />

          <DateTable
            dates={paginatedDates.map((date) => ({
              ...date,
              days: {
                monday: date.days.mon,
                tuesday: date.days.tue,
                wednesday: date.days.wed,
                thursday: date.days.thu,
                friday: date.days.fri,
                saturday: date.days.sat,
                sunday: date.days.sun,
              },
            }))}
            onEdit={handleEditDate}
            onDelete={handleDeleteDate}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => setRowsPerPage(Number(e.target.value))}
            totalResults={totalResults}
            isLoading={isLoading}
          />
        </div>
      </div>

      {showModal && (
        <DateModal
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

export default Page;
