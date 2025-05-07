import React from "react";

interface SearchFilterProps {
  searchTerm: string;
  setSearchTerm: (e: React.ChangeEvent<HTMLInputElement>) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

function SearchFilter({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}: SearchFilterProps) {
  return (
    <div className="flex justify-between mb-4">
      <input
        type="text"
        placeholder="Search by name..."
        className="border p-2 rounded-md w-full"
        value={searchTerm}
        onChange={setSearchTerm} // ✅ ใช้ e => ส่งให้ฟังก์ชัน handleSearchChange ที่มี debounce
      />
      <div className="flex items-center">
        <span className="mr-2">Filters:</span>
        <select
          aria-label="Status Filter"
          className="border p-2 rounded-md hover:bg-gray-100 cursor-pointer"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All Status">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Pending">Pending</option>
        </select>
      </div>
    </div>
  );
}

export default SearchFilter;
