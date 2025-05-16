import React from "react";
import Pagination from "../Pagination/Pagination";

interface Time {
  id: number;
  name: string;
  schedule: string[];
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
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">Time Schedules</h3>
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
                <th className="sticky top-0 py-4 px-6 bg-gray-50 border-b-2 border-gray-200 font-semibold text-gray-600 text-left">
                  Schedule
                </th>
                <th className="sticky top-0 py-4 px-6 bg-gray-50 border-b-2 border-gray-200 font-semibold text-gray-600 text-center w-24">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-8 text-center text-gray-500 animate-pulse"
                  >
                    Loading time schedules...
                  </td>
                </tr>
              ) : times.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    No time schedules found
                  </td>
                </tr>
              ) : (
                times.map((time, index) => (
                  <tr
                    key={time.id}
                    className="border-t border-gray-200 opacity-0 animate-fade-in-up"
                    style={{
                      animationDelay: `${index * 80}ms`,
                      animationFillMode: "forwards",
                    }}
                  >
                    {/* No. */}
                    <td className="py-4 px-6 border-b border-gray-200 text-center font-medium text-gray-700">
                      {index + 1 + (currentPage - 1) * rowsPerPage}
                    </td>
                    {/* Name */}
                    <td className="py-4 px-6 border-b border-gray-200 font-medium text-gray-800">
                      {time.name}
                    </td>
                    {/* Schedule (with icon, keep decoration) */}
                    <td className="py-4 px-6 border-b border-gray-200 text-left">
                      <div className="flex items-start text-gray-700 font-medium group">
                        <div className="relative mr-3 flex-shrink-0">
                          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm flex items-center justify-center group-hover:shadow transition-all duration-300">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-blue-500 group-hover:text-blue-600 transition-colors"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div>
                          {Array.isArray(time.schedule) &&
                          time.schedule.length > 0 ? (
                            time.schedule.join(", ")
                          ) : (
                            <span className="text-gray-400 italic">
                              No schedule
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    {/* Actions */}
                    <td className="py-4 px-6 border-b border-gray-200">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => onEdit(time.id)}
                          className="p-1.5 bg-blue-50 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors hover:shadow-sm cursor-pointer"
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
                          className="p-1.5 bg-red-50 rounded-lg text-red-600 hover:bg-red-100 transition-colors hover:shadow-sm cursor-pointer"
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

export default TimeTable;
