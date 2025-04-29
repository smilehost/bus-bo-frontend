// src/app/components/Table/DateTable.tsx

import React from "react";
import Pagination from "../Pagination/Pagination";

type DateTableProps = {
  dates: {
    id: number;
    name: string;
    days: {
      monday: boolean;
      tuesday: boolean;
      wednesday: boolean;
      thursday: boolean;
      friday: boolean;
      saturday: boolean;
      sunday: boolean;
    };
    status: string;
  }[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  rowsPerPage: number;
  totalResults: number;
  isLoading: boolean;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

function DateTable({
  dates,
  onDelete,
  onEdit,
  currentPage,
  onPageChange,
  rowsPerPage,
  totalResults,
  onRowsPerPageChange,
}: DateTableProps) {
  const englishDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const totalPages = Math.ceil(totalResults / rowsPerPage);

  return (
    <div className="flex flex-col space-y-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">Available Dates</h3>
          <div className="text-sm text-gray-500">
            Total: {totalResults} entries
          </div>
        </div>
  
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr>
                <th className="sticky top-0 py-4 px-6 bg-gray-50 border-b-2 border-gray-200 font-semibold text-gray-600 text-center w-12">
                  No.
                </th>
                <th className="sticky top-0 py-4 px-6 bg-gray-50 border-b-2 border-gray-200 font-semibold text-gray-600 text-left">
                  Name
                </th>
                {englishDays.map((day, index) => (
                  <th
                    key={day}
                    className={`sticky top-0 py-4 px-4 bg-gray-50 border-b-2 border-gray-200 font-semibold text-center ${
                      index >= 5 ? "text-red-600" : "text-gray-600"
                    }`}
                  >
                    <span className="block">{day}</span>
                  </th>
                ))}
                <th className="sticky top-0 py-4 px-6 bg-gray-50 border-b-2 border-gray-200 font-semibold text-gray-600 text-center w-24">
                  Status
                </th>
                <th className="sticky top-0 py-4 px-6 bg-gray-50 border-b-2 border-gray-200 font-semibold text-gray-600 text-center w-24">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {dates.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-gray-500">
                    No data found
                  </td>
                </tr>
              ) : (
                dates.map((date, index) => (
                  <tr
                    key={date.id}
                    className={`transition-all duration-300 ease-out hover:bg-blue-50/70 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    } animate-fade-in`}
                    style={{
                      animationDelay: `${index * 80}ms`,
                      animationDuration: "600ms",
                      animationFillMode: "both",
                    }}
                  >
                    <td className="py-4 px-6 border-b border-gray-200 text-center font-medium text-gray-700">
                      {index + 1 + (currentPage - 1) * rowsPerPage}
                    </td>
                    <td className="py-4 px-6 border-b border-gray-200 font-medium text-gray-800">
                      {date.name}
                    </td>
                    {englishDays.map((day, dayIndex) => (
                      <td
                        key={day}
                        className={`py-4 px-4 border-b border-gray-200 text-center ${
                          dayIndex >= 5 ? "bg-red-50/30" : ""
                        }`}
                      >
                        {!!date.days[day.toLowerCase() as keyof typeof date.days] ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 bg-green-100 text-green-600 rounded-full shadow-sm transition-transform hover:scale-110">
                            ✓
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-7 h-7 bg-red-100 text-red-600 rounded-full shadow-sm transition-transform hover:scale-110">
                            ✕
                          </span>
                        )}
                      </td>
                    ))}
                    <td className="py-4 px-6 border-b border-gray-200">
                      <div className="flex items-center justify-center">
                        {date.status === "Active" ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 shadow-sm">
                            <span className="mr-1.5 h-2 w-2 rounded-full bg-green-500"></span>
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 shadow-sm">
                            <span className="mr-1.5 h-2 w-2 rounded-full bg-red-500"></span>
                            <span>Inactive</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 border-b border-gray-200">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => onEdit(date.id)}
                          className="p-1.5 bg-blue-50 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors hover:shadow-sm cursor-pointer"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => onDelete(date.id)}
                          className="p-1.5 bg-red-50 rounded-lg text-red-600 hover:bg-red-100 transition-colors hover:shadow-sm cursor-pointer"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
  
      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        totalResults={totalResults}
      />
    </div>
  );
  
}

export default DateTable;
