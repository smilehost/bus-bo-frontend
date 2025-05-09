"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import CompanyTable from "@/app/components/Table/CompanyTable";
import CompanyModal from "@/app/components/Model/CompanyModal";
import SearchFilter from "@/app/components/SearchFilter/CompanySearchFilter";
import SkeletonCompanyTable from "@/app/components/Skeleton/SkeletonCompanyTable";
import { Confirm } from "@/app/components/Dialog/Confirm";
import { Alert } from "@/app/components/Dialog/Alert";
import TitlePage from "@/app/components/Title/TitlePage";
import ButtonBG from "@/app/components/Form/ButtonBG";
import { debounce } from "@/utils/debounce";
import { withSkeletonDelay } from "@/app/components/Skeleton/withSkeletonDelay";

type Company = {
  id: number;
  name: string;
  status: "Active" | "Inactive";
};

export default function ManageCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(false);

  const useMockData = true;

  // ✅ เก็บ mock data แบบถาวร
  const mockRef = useRef<Company[]>([
    { id: 1, name: "Northern Bus Co.", status: "Active" },
    { id: 2, name: "Southern Express", status: "Active" },
    { id: 3, name: "Eastern Transport", status: "Inactive" },
    
  ]);

  const fetchCompanies = async () => {
    setIsLoading(true);
    const cancelSkeleton = withSkeletonDelay(setIsLoadingSkeleton);
    try {
      if (useMockData) {
        setCompanies(mockRef.current);
        setTotalResults(mockRef.current.length);
      } else {
        // ใช้ Zustand store หรือ API จริงในอนาคต
      }
    } catch (error) {
      console.error("Failed to load companies:", error);
    }
    cancelSkeleton();
    setIsLoading(false);
  };

  const filterCompanies = useCallback(() => {
    let temp = [...companies];
    if (debouncedSearch) {
      temp = temp.filter((company) =>
        company.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }
    setFilteredCompanies(temp);
    setTotalResults(temp.length);
  }, [companies, debouncedSearch]);

  const debouncedFetch = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 300),
    []
  );

  useEffect(() => {
    fetchCompanies();
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    filterCompanies();
  }, [debouncedSearch, companies]);

  const handleAddCompany = () => {
    setEditingCompany(null);
    setIsModalOpen(true);
  };

  const handleEditCompany = (id: number) => {
    const company = companies.find((c) => c.id === id);
    if (company) {
      setEditingCompany(company);
      setIsModalOpen(true);
    }
  };

  const handleSaveCompany = async (data: { name: string; status: string }) => {
    const isConfirmed = await Confirm({
      title: editingCompany ? "Confirm Update" : "Confirm Create",
      text: editingCompany
        ? "Do you want to update this company?"
        : "Do you want to create this company?",
      confirmText: editingCompany ? "Update" : "Create",
      cancelText: "Cancel",
      type: "question",
    });

    if (!isConfirmed) return;

    try {
      if (editingCompany) {
        mockRef.current = mockRef.current.map((c) =>
          c.id === editingCompany.id
            ? {
                ...c,
                name: data.name,
                status: data.status as "Active" | "Inactive",
              }
            : c
        );
        await Alert({
          title: "Updated!",
          text: "Company updated.",
          type: "success",
        });
      } else {
        const newCompany: Company = {
          id: Math.max(...mockRef.current.map((c) => c.id), 0) + 1,
          name: data.name,
          status: data.status as "Active" | "Inactive",
        };
        mockRef.current = [...mockRef.current, newCompany];
        await Alert({
          title: "Created!",
          text: "Company created.",
          type: "success",
        });
      }

      setIsModalOpen(false);
      fetchCompanies();
    } catch (error) {
      console.error("Save Company error:", error);
      await Alert({
        title: "Error!",
        text: "Something went wrong.",
        type: "error",
      });
    }
  };

  const handleDeleteCompany = async (id: number) => {
    const isConfirmed = await Confirm({
      title: "Confirm Delete",
      text: "Are you sure you want to delete this company?",
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "warning",
    });

    if (!isConfirmed) return;

    try {
      mockRef.current = mockRef.current.filter((c) => c.id !== id);
      await Alert({
        title: "Deleted!",
        text: "Company deleted.",
        type: "success",
      });
      fetchCompanies();
    } catch (error) {
      console.error("Delete Company error:", error);
      await Alert({
        title: "Error!",
        text: "Failed to delete.",
        type: "error",
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedFetch(e.target.value);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    setRowsPerPage(newSize);
    setCurrentPage(1);
  };

  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col p-0">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <TitlePage
            title="Manage Companies"
            description="View and manage bus companies"
          />
          <ButtonBG
            size="h-[38px]"
            text="Add New Company"
            icon="/icons/plus.svg"
            onClick={handleAddCompany}
          />
        </div>

        <div className="bg-white rounded-md shadow p-5">
          <SearchFilter
            searchTerm={searchTerm}
            setSearchTerm={(value: string) =>
              handleSearchChange({
                target: { value },
              } as React.ChangeEvent<HTMLInputElement>)
            }
          />
          {isLoadingSkeleton ? (
            <SkeletonCompanyTable rows={5} />
          ) : (
            <CompanyTable
              companies={paginatedCompanies}
              onEdit={handleEditCompany}
              onDelete={handleDeleteCompany}
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

      {isModalOpen && (
        <CompanyModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCompany}
          editingCompany={
            editingCompany
              ? {
                  name: editingCompany.name,
                  status: editingCompany.status,
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
