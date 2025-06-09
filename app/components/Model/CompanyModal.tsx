"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type CompanyFormData = {
  name: string;
  prefix: string;
  status: number; // 1 = Active, 0 = Inactive
};

type CompanyModalProps = {
  onClose: () => void;
  onSave: (data: CompanyFormData) => void;
  editingCompany?: CompanyFormData;
};

export default function CompanyModal({
  onClose,
  onSave,
  editingCompany,
}: CompanyModalProps) {
  const [name, setName] = useState("");
  const [prefix, setPrefix] = useState("");
  const [status, setStatus] = useState(1);

  useEffect(() => {
    if (editingCompany) {
      setName(editingCompany.name);
      setPrefix(editingCompany.prefix);
      setStatus(editingCompany.status);
    } else {
      setName("");
      setPrefix("");
      setStatus(1);
    }
  }, [editingCompany]);

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Please enter a valid company name.");
      return;
    }
    onSave({ name, prefix, status });
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
          {editingCompany ? "Edit Company" : "Add New Company"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Company name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prefix
            </label>
            {editingCompany ? (
              <div
                className={`${editingCompany && "bg-gray-200"
                  } w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400`}
              >
                {prefix}
              </div>
            ) : (
              <input
                type="text"
                disabled={editingCompany ? true : false}
                value={prefix}
                onChange={(e) => {
                  const onlyEnglishLetters = e.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 5);;
                  setPrefix(onlyEnglishLetters);
                }}
                placeholder="Enter Company prefix (e.g. BST)"
                className={`${editingCompany && "bg-gray-200"
                  } w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400`}
              />
            )}

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
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
              {editingCompany ? "Update Company" : "Add Company"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
