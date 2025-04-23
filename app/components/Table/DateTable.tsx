import React from "react";

type DateTableProps = {
  dates: { id: number; name: string; days: Record<string, boolean>; status: string }[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  rowsPerPage: number;
  totalResults: number;
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
  const thaiDays = [
    "จันทร์",
    "อังคาร",
    "พุธ",
    "พฤหัสบดี",
    "ศุกร์",
    "เสาร์",
    "อาทิตย์",
  ];
  const englishDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  // คำนวณจำนวนหน้าทั้งหมด
  const totalPages = Math.ceil(totalResults / rowsPerPage);

  // คำนวณข้อมูลที่จะแสดงในหน้าปัจจุบัน
  const paginatedDates = dates

  return (
    <div className="flex flex-col space-y-4">
      <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-4 px-6 border-b-2 border-gray-200 font-semibold text-gray-600 text-center w-12">
                ที่
              </th>
              <th className="py-4 px-6 border-b-2 border-gray-200 font-semibold text-gray-600 text-left">
                ชื่อ
              </th>
              {thaiDays.map((day) => (
                <th
                  key={day}
                  className="py-4 px-4 border-b-2 border-gray-200 font-semibold text-gray-600 text-center"
                >
                  <span className="block">{day}</span>
                </th>
              ))}
              <th className="py-4 px-6 border-b-2 border-gray-200 font-semibold text-gray-600 text-center w-20">
                Status
              </th>
              <th className="py-4 px-6 border-b-2 border-gray-200 font-semibold text-gray-600 text-center w-24">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedDates.map((date, index) => (
              <tr
                key={date.id}
                className={`transition-colors hover:bg-blue-50 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                }`}
              >
                <td className="py-4 px-6 border-b border-gray-200 text-center font-medium text-gray-700">
                  {date.id}
                </td>
                <td className="py-4 px-6 border-b border-gray-200 font-medium text-gray-800">
                  {date.name}
                </td>
                {englishDays.map((day) => (
                  <td
                    key={day}
                    className="py-4 px-4 border-b border-gray-200 text-center"
                  >
                    {date.days[day] ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-600 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </td>
                ))}
                <td className="py-4 px-6 border-b border-gray-200">
                  <div className="flex items-center justify-center">
                    {date.status === "Active" ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <span className="mr-1.5 h-2 w-2 rounded-full bg-green-500"></span>
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <span className="mr-1.5 h-2 w-2 rounded-full bg-red-500"></span>
                        Inactive
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6 border-b border-gray-200">
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={() => onEdit(date.id)}
                      className="p-1.5 bg-blue-50 rounded-md text-blue-600 hover:bg-blue-100 transition-colors"
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
                      onClick={() => onDelete(date.id)}
                      className="p-1.5 bg-red-50 rounded-md text-red-600 hover:bg-red-100 transition-colors"
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
            ))}
          </tbody>
        </table>
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

export default DateTable;
