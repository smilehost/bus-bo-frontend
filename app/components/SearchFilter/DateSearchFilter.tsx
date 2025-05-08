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
    <div className="flex flex-col md:flex-row md:justify-between mb-4 gap-4">
      <input
        type="text"
        placeholder="Search by name..."
        className="border p-2 rounded-md flex-1"
        value={searchTerm}
        onChange={setSearchTerm}
      />
      <div className="flex items-center">
        <span className="mr-2">Filters:</span>
        <select
          aria-label="Status Filter"
          className="border p-2 rounded-md"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All Status">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
    </div>
  );
}

export default SearchFilter;
