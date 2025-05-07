"use client";

import React, { useEffect, useState } from "react";

type CompanyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, status: "Active" | "Inactive") => void;
  newCompanyName: string;
  setNewCompanyName: (value: string) => void;
  editingCompanyStatus?: "Active" | "Inactive";
};

export default function CompanyModal({
  isOpen,
  onClose,
  onAdd,
  newCompanyName,
  setNewCompanyName,
  editingCompanyStatus = "Active",
}: CompanyModalProps) {
  const [status, setStatus] = useState<"Active" | "Inactive">(
    editingCompanyStatus
  );

  useEffect(() => {
    setStatus(editingCompanyStatus || "Active");
  }, [editingCompanyStatus]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!newCompanyName.trim()) {
      alert("Please enter a valid company name.");
      return;
    }
    onAdd(newCompanyName, status);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✖️
        </button>

        <h2 className="text-xl font-semibold text-center mb-6">
          {editingCompanyStatus ? "Edit Company" : "Add New Company"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              placeholder="Enter Company name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "Active" | "Inactive")
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-md bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:opacity-90 cursor-pointer"
            >
              {editingCompanyStatus ? "Update Company" : "Add Company"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
