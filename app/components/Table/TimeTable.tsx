import React from "react";

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
  // คำนวณจำนวนหน้าทั้งหมด
  const totalPages = Math.ceil(totalResults / rowsPerPage);

  return (
    <div className="flex flex-col space-y-6">
      {/* Times List */}
      <div className="bg-white rounded-lg shadow">
        {times.map((time, index) => (
          <div
            key={time.id}
            className={`flex items-center justify-between px-6 py-4 ${
              index !== times.length - 1 ? "border-b border-gray-200" : ""
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-orange-500 text-white rounded-full h-10 w-10 flex items-center justify-center text-lg font-medium">
                {time.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-medium">{time.name}</div>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    time.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {time.status}
                </span>
              </div>
            </div>
            <div className="text-gray-700 font-medium">{time.schedule}</div>
            <div className="flex space-x-3">
              <button
                onClick={() => onEdit(time.id)}
                className="text-blue-500 hover:text-blue-700"
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
                className="text-red-500 hover:text-red-700"
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
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex">
          <button
            className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 mr-1"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`w-8 h-8 flex items-center justify-center rounded border ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "border-gray-300"
              }`}
              onClick={() => onPageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 ml-1"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>

        <div className="text-sm text-gray-600">
          Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
          {Math.min(currentPage * rowsPerPage, totalResults)} of {totalResults}{" "}
          results
        </div>

        <div className="flex items-center">
          <select
            className="border border-gray-300 rounded mr-2 p-1.5"
            value={rowsPerPage}
            onChange={onRowsPerPageChange}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span className="text-sm text-gray-600">per page</span>
        </div>
      </div>
    </div>
  );
}

export default TimeTable;
