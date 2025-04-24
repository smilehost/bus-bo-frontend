import React from "react";
import Pagination from "../Pagination/Pagination";

interface Time {
  id: number;
  name: string;
  schedule: string;
  status: "Active" | "Inactive";
}

interface TimeTableProps {
  times: Time[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  rowsPerPage: number;
  onRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  totalResults: number;
}

function TimeTable({
  times,
  onEdit,
  onDelete,
  currentPage,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  totalResults = 0,
}: TimeTableProps) {
  // Calculate total pages
  const totalPages = Math.ceil(totalResults / rowsPerPage);

  return (
    <div className="flex flex-col space-y-6">
      {/* Times List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-800">
              Time Schedules
            </h3>
            <div className="text-sm text-gray-500">
              Total: {totalResults} entries
            </div>
          </div>
        </div>

        {times.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No time schedules found
          </div>
        ) : (
          times.map((time, index) => (
            <div
              key={time.id}
              className={`flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors duration-150 ${
                index !== times.length - 1 ? "border-b border-gray-200" : ""
              }`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`text-white rounded-full h-10 w-10 flex items-center justify-center text-lg font-medium shadow-sm ${
                    time.name.toLowerCase().includes("morning")
                      ? "bg-yellow-500"
                      : time.name.toLowerCase().includes("evening")
                      ? "bg-indigo-500"
                      : time.name.toLowerCase().includes("night")
                      ? "bg-purple-600"
                      : "bg-gradient-to-br from-orange-400 to-orange-600"
                  }`}
                >
                  {time.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{time.name}</div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                      time.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                        time.status === "Active" ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span>
                    {time.status}
                  </span>
                </div>
              </div>

              <div className="text-gray-700 font-medium flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                {time.schedule}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(time.id)}
                  className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 p-1.5 rounded-lg transition-colors duration-150"
                  aria-label="Edit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(time.id)}
                  className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 p-1.5 rounded-lg transition-colors duration-150"
                  aria-label="Delete"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
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

export default TimeTable;
