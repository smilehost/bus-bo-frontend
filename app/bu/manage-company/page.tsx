"use client";

import CompanyModal from "@/app/components/Model/CompanyModal";
import SkeletonCompanyTable from "@/app/components/Skeleton/SkeletonCompanyTable";
import CompanyTable from "@/app/components/Table/CompanyTable";
import { useEffect, useState } from "react";

//components
import TitlePageAndButton from "@/app/components/Title/TitlePageAndButton";
import { Confirm } from "@/app/components/Dialog/Confirm";
import { Alert } from "@/app/components/Dialog/Alert";

type Company = {
  id: number;
  name: string;
  status: "Active" | "Inactive";
};

export default function ManageCompanies() {
  const [companies, setCompanies] = useState<Company[]>([
    { id: 1, name: "Northern Bus Co.", status: "Active" },
    { id: 2, name: "Southern Express", status: "Active" },
    { id: 3, name: "Eastern Transport", status: "Inactive" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isLoadingskeleton, setIsLoadingskeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoadingskeleton(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddOrEditCompany = async (
    name: string,
    status: "Active" | "Inactive"
  ) => {
    if (!name.trim()) return;

    const isConfirmed = await Confirm({
      title: editingCompany ? "Confirm Update" : "Confirm Create",
      text: editingCompany
        ? "Are you sure you want to update this company?"
        : "Are you sure you want to create this company?",
      confirmText: editingCompany ? "Update" : "Create",
      cancelText: "Cancel",
      type: "question",
    });

    if (!isConfirmed) return;

    if (editingCompany) {
      // Update existing company
      setCompanies((prev) =>
        prev.map((company) =>
          company.id === editingCompany.id
            ? { ...company, name, status }
            : company
        )
      );
      await Alert({
        title: "Updated!",
        text: "Company updated successfully.",
        type: "success",
      });
      setEditingCompany(null);
    } else {
      // Add new company
      const newCompany: Company = {
        id: companies.length + 1,
        name,
        status,
      };
      setCompanies((prev) => [...prev, newCompany]);
      await Alert({
        title: "Created!",
        text: "Company created successfully.",
        type: "success",
      });
    }

    setNewCompanyName("");
    setIsModalOpen(false);
  };

  const handleEditCompany = (id: number) => {
    const company = companies.find((c) => c.id === id);
    if (company) {
      setEditingCompany(company);
      setNewCompanyName(company.name);
      setIsModalOpen(true);
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

    setCompanies((prev) => prev.filter((company) => company.id !== id));
    await Alert({
      title: "Deleted!",
      text: "Company deleted successfully.",
      type: "success",
    });
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Manage Companies</h1>
          <p className="text-gray-500">View and manage bus companies</p>
        </div>
        <button
          onClick={() => {
            setEditingCompany(null);
            setNewCompanyName("");
            setIsModalOpen(true);
          }}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90 text-white px-4 py-2 rounded-md flex items-center justify-center w-full md:w-auto cursor-pointer"
        >
          <span className="mr-2 text-xl font-bold">+</span>
          Add New Company
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search companies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {isLoadingskeleton ? (
        <SkeletonCompanyTable rows={5} />
      ) : (
        <CompanyTable
          companies={filteredCompanies}
          onEdit={handleEditCompany}
          onDelete={handleDeleteCompany}
        />
      )}

      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddOrEditCompany}
        newCompanyName={newCompanyName}
        setNewCompanyName={setNewCompanyName}
        editingCompanyStatus={editingCompany?.status}
      />
    </div>
  );
}
