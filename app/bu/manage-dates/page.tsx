"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ManageDateController } from "@/controllers/manageDate.controller";
import { DateItem } from "@/types/date.type";
import DateTable from "@/app/components/Table/DateTable";
import DateModal from "@/app/components/Modal/DateModal";
import PageHeader from "@/app/components/PageHeader/DatePageHeader";
import SearchFilter from "@/app/components/SearchFilter/DateSearchFilter";
import { debounce } from "@/utils/debounce";
import { Confirm } from "@/app/components/Dialog/Confirm";
import { Alert } from "@/app/components/Dialog/Alert";

function Page() {
  // State variables
  const [allDates, setAllDates] = useState<DateItem[]>([]);
  const [filteredDates, setFilteredDates] = useState<DateItem[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  const [showModal, setShowModal] = useState(false);
  const [editingDate, setEditingDate] = useState<DateItem | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all dates from the backend
  const fetchDates = async () => {
    setIsLoading(true);
    try {
      const res = await ManageDateController.fetchDates(
        currentPage,
        rowsPerPage,
        debouncedSearch,
        statusFilter !== "All Status" ? statusFilter : undefined
      );
      setAllDates(res.data);
    } catch (error) {
      console.error("Failed to load data", error);
    }
    setIsLoading(false);
  };

  // Filter dates based on search term and status
  const filterDates = useCallback(() => {
    let tempDates = [...allDates];

    if (debouncedSearch) {
      tempDates = tempDates.filter((date) =>
        date.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (statusFilter !== "All Status") {
      tempDates = tempDates.filter((date) => date.status === statusFilter);
    }

    setFilteredDates(tempDates);
    setTotalResults(tempDates.length);
    setCurrentPage(1); // Reset to the first page on filter change
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
    const schedule = {
      mon: data.days.monday,
      tue: data.days.tuesday,
      wed: data.days.wednesday,
      thu: data.days.thursday,
      fri: data.days.friday,
      sat: data.days.saturday,
      sun: data.days.sunday,
    };

    const isConfirmed = await Confirm({
      title: editingDate ? "Confirm Update" : "Confirm Create",
      text: editingDate
        ? "Do you want to update this date?"
        : "Do you want to create this date?",
      confirmText: editingDate ? "Update" : "Create",
      cancelText: "Cancel",
      type: "question",
    });

    if (!isConfirmed) return;

    try {
      if (editingDate) {
        await ManageDateController.updateDate(editingDate.id, {
          id: editingDate.id,
          ...data,
          days: schedule,
        });
        await Alert({
          title: "Updated!",
          text: "Date updated successfully",
          type: "success",
        });
      } else {
        await ManageDateController.createDate({
          id: 0, // Default or placeholder ID
          ...data,
          days: schedule,
        });
        await Alert({
          title: "Created!",
          text: "Date created successfully",
          type: "success",
        });
      }
      setShowModal(false);
      fetchDates();
    } catch (error) {
      console.error("Save Date error:", error);
      await Alert({
        title: "Error!",
        text: "Something went wrong.",
        type: "error",
      });
    }
  };

  const handleDeleteDate = async (id: number) => {
    const isConfirmed = await Confirm({
      title: "Confirm Delete",
      text: "Are you sure you want to delete this date?",
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "warning",
    });

    if (!isConfirmed) return;

    try {
      await ManageDateController.deleteDate(id);
      await Alert({
        title: "Deleted!",
        text: "Date deleted successfully",
        type: "success",
      });
      fetchDates();
    } catch (error) {
      console.error("Delete Date error:", error);
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
            onRowsPerPageChange={handleRowsPerPageChange}
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
