import React from "react";
import { Search, X } from "lucide-react";

interface SearchFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

function SearchFilter({ searchTerm, setSearchTerm }: SearchFilterProps) {
  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        {/* Search Input with Icon */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search by time..."
            className="pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
      </div>
    </div>
  );
}

export default SearchFilter;