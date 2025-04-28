import React from "react";
import Pagination from "../Pagination/Pagination";

interface Time {
  id: number;
  name: string;
  schedule: string[]; // ✅ เปลี่ยนเป็น array
  status: "Active" | "Inactive";
}

interface TimeTableProps {
  times: Time[];
  isLoading?: boolean;
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
  isLoading = false,
  onEdit,
  onDelete,
  currentPage,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  totalResults = 0,
}: TimeTableProps) {
  const totalPages = Math.ceil(totalResults / rowsPerPage);

  return (
    <div className="flex flex-col space-y-6">
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

        {isLoading ? (
          <div className="p-8 text-center text-gray-500 animate-pulse">
            Loading time schedules...
          </div>
        ) : times.length === 0 ? (
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
                {Array.isArray(time.schedule)
                  ? time.schedule.join(", ")
                  : String(time.schedule)}
              </div>

              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => onEdit(time.id)}
                  className="p-1.5 bg-blue-50 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors hover:shadow-sm"
                  title="Edit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(time.id)}
                  className="p-1.5 bg-red-50 rounded-lg text-red-600 hover:bg-red-100 transition-colors hover:shadow-sm"
                  title="Delete"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
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
