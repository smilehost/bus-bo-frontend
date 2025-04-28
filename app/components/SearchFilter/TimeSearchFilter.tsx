import React from "react";

interface SearchFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

function SearchFilter({ searchTerm, setSearchTerm }: SearchFilterProps) {
  return (
    <div className="flex justify-between mb-4">
      <input
        type="text"
        placeholder="Search by name..."
        className="border p-2 rounded-md w-full" // ✅ ใช้ w-full เพราะไม่มี select แล้ว
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}

export default SearchFilter;
