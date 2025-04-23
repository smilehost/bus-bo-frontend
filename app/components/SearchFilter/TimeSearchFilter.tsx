import React from "react";

interface SearchFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
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
        placeholder="Search by times or name..."
        className="border p-2 rounded-md w-3/4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="flex items-center">
        <span className="mr-2">Filters:</span>
        <select
          aria-label="Status Filter"
          className="border p-2 rounded-md"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>
    </div>
  );
}

export default SearchFilter;
