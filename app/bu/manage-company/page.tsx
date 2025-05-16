"use client";

import React, { useEffect, useState, useCallback } from "react";
import CompanyTable from "@/app/components/Table/CompanyTable";
import CompanyModal from "@/app/components/Model/CompanyModal";
import SearchFilter from "@/app/components/SearchFilter/CompanySearchFilter";
import SkeletonCompanyTable from "@/app/components/Skeleton/SkeletonCompanyTable";
import { Confirm } from "@/app/components/Dialog/Confirm";
import { Alert } from "@/app/components/Dialog/Alert";
import { debounce } from "@/utils/debounce";
import { withSkeletonDelay } from "@/app/components/Skeleton/withSkeletonDelay";
import { useCompanyStore } from "@/stores/companyStore";
import TitlePage from "@/app/components/Title/TitlePage";

export default function ManageCompaniesPage() {
  const {
    companies,
    isLoading,
    getCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
  } = useCompanyStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any | null>(null);
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(false);

  const fetchCompanies = async () => {
    const cancelSkeleton = withSkeletonDelay(setIsLoadingSkeleton);
    await getCompanies(currentPage, rowsPerPage, debouncedSearch);
    cancelSkeleton();
  };

  const debouncedFetch = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 350),
    []
  );

  useEffect(() => {
    fetchCompanies();
  }, [currentPage, rowsPerPage, debouncedSearch]);

  const handleAddCompany = () => {
    setEditingCompany(null);
    setIsModalOpen(true);
  };

  const handleEditCompany = (id: string) => {
    const found = companies.find((c) => c.id === id);
    if (found) setEditingCompany(found);
    setIsModalOpen(true);
  };

  const handleSaveCompany = async (data: {
    name: string;
    prefix: string;
    status: number;
  }) => {
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
        await updateCompany(editingCompany.id, {
          id: editingCompany.id,
          name: data.name,
          prefix: data.prefix,
          status: data.status,
        });
        await Alert({
          title: "Updated!",
          text: "Company updated.",
          type: "success",
        });
      } else {
        await createCompany({
          name: data.name,
          prefix: data.prefix,
          status: data.status,
        });
        await Alert({
          title: "Created!",
          text: "Company created.",
          type: "success",
        });
      }

      setIsModalOpen(false);
      fetchCompanies();
    } catch (error) {
      console.error("Save error:", error);
      await Alert({
        title: "Error!",
        text: "Something went wrong.",
        type: "error",
      });
    }
  };

  const handleDeleteCompany = async (id: string) => {
    const isConfirmed = await Confirm({
      title: "Confirm Delete",
      text: "Are you sure you want to delete this company?",
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "warning",
    });

    if (!isConfirmed) return;

    try {
      await deleteCompany(id);
      await Alert({
        title: "Deleted!",
        text: "Company deleted.",
        type: "success",
      });
      fetchCompanies();
    } catch (error) {
      console.error("Delete error:", error);
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

  const filtered = companies.filter((c) =>
    c.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );
  const paginatedCompanies = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col p-0">
        <TitlePage title="Manage Companies" description="View and manage bus companies" btnText='Add New Company' handleOpenModel={handleAddCompany} />
        <div className="bg-white rounded-md shadow p-5 mt-5">
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
              totalResults={filtered.length}
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
                prefix: editingCompany.prefix,
                status: editingCompany.status,
              }
              : undefined
          }
        />
      )}
    </div>
  );
}
