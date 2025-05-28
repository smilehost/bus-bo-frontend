"use client";

import React, { useEffect, useRef, useState } from "react";
import { useCompanyStore } from "@/stores/companyStore";
import { STATUS, FILTER } from "@/constants/enum";
import { Search, Filter, ChevronDown, X } from "lucide-react";

//store
import { useUserStore } from "@/stores/userStore";

interface Company {
  id: string;
  name: string;
}

interface SearchFilterProps {
  searchTerm: string;
  setSearchTerm: (e: React.ChangeEvent<HTMLInputElement>) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  companyFilter: string;
  setCompanyFilter: (value: string) => void;
  companies: Company[];
}

export default function SearchFilter({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  companyFilter,
  setCompanyFilter,
}: SearchFilterProps) {
  const { companies } = useCompanyStore();
  const { userData } = useUserStore();

  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);

  const statusRef = useRef<HTMLDivElement>(null);
  const companyRef = useRef<HTMLDivElement>(null);

  const clearSearch = () => {
    setSearchTerm({
      target: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const resetFilters = () => {
    setStatusFilter(FILTER.ALL_STATUS);
    setCompanyFilter(FILTER.ALL_COMPANIES);
    setSearchTerm({
      target: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        statusRef.current &&
        !statusRef.current.contains(event.target as Node)
      ) {
        setStatusDropdownOpen(false);
      }

      if (
        companyRef.current &&
        !companyRef.current.contains(event.target as Node)
      ) {
        setCompanyDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search by name or phone..."
            className="pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={setSearchTerm}
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Filters Section */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          {/* Status Filter */}
          <div className="relative" ref={statusRef}>
            <button
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              className={`flex items-center justify-between min-w-40 px-4 py-2.5 text-sm border cursor-pointer ${statusFilter !== FILTER.ALL_STATUS
                  ? "border-orange-500 bg-orange-50 text-orange-700"
                  : "border-gray-300 bg-white"
                } rounded-lg hover:bg-gray-50 transition-all`}
            >
              <span className="mr-2">{statusFilter}</span>
              <ChevronDown
                size={16}
                className={`transform transition-transform ${statusDropdownOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {statusDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-1 max-h-60 overflow-auto">
                <div
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    setStatusFilter(FILTER.ALL_STATUS);
                    setStatusDropdownOpen(false);
                  }}
                >
                  {FILTER.ALL_STATUS}
                </div>
                {Object.values(STATUS).map((label) => (
                  <div
                    key={label}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => {
                      setStatusFilter(label);
                      setStatusDropdownOpen(false);
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Company Filter
          {userData.account_role === 2 && (
            <div className="relative" ref={companyRef}>
              <button
                onClick={() => setCompanyDropdownOpen(!companyDropdownOpen)}
                className={`flex items-center justify-between min-w-40 px-4 py-2.5 text-sm border cursor-pointer ${companyFilter !== FILTER.ALL_COMPANIES
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-300 bg-white"
                  } rounded-lg hover:bg-gray-50 transition-all`}
              >
                <span className="mr-2 truncate">
                  {companyFilter === FILTER.ALL_COMPANIES
                    ? FILTER.ALL_COMPANIES
                    : companies.find((c) => c.id.toString() === companyFilter)
                      ?.name || "-"}
                </span>
                <ChevronDown
                  size={16}
                  className={`transform transition-transform ${companyDropdownOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {companyDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-1 max-h-60 overflow-auto">
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => {
                      setCompanyFilter(FILTER.ALL_COMPANIES);
                      setCompanyDropdownOpen(false);
                    }}
                  >
                    {FILTER.ALL_COMPANIES}
                  </div>
                  {companies.map((company) => (
                    <div
                      key={company.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm truncate"
                      onClick={() => {
                        setCompanyFilter(company.id.toString()); // ✅ ใช้ id แทน name
                        setCompanyDropdownOpen(false);
                      }}
                    >
                      {company.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )} */}

          {/* Reset Filters */}
          {(statusFilter !== FILTER.ALL_STATUS ||
            companyFilter !== FILTER.ALL_COMPANIES) && (
              <button
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center"
              >
                <X size={14} className="mr-1" />
                Reset filters
              </button>
            )}
        </div>
      </div>
    </div>
  );
}
