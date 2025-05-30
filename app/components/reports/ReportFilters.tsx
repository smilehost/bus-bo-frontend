"use client";

import { FilterIcon } from "lucide-react";

export default function ReportFilters({
  dateRange,
  setDateRange,
  customReDate,
  setCustomReDate,
}: {
  dateRange: string;
  setDateRange: (date: string) => void;
  customReDate: string;
  setCustomReDate: (date: string) => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
        <div className="flex items-center text-gray-500">
          <FilterIcon size={18} className="mr-2" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          {/* Select Date Type */}
          <select
            value={
              ["all", "day", "month", "year"].includes(dateRange)
                ? dateRange
                : "custom"
            }
            onChange={(e) => {
              const val = e.target.value;
              if (val === "custom") {
                // กด custom จาก select => ไม่เปลี่ยนค่าทันที
                return;
              }
              setDateRange(val);
              setCustomReDate(""); // reset custom date
            }}
            className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All</option>
            <option value="day">Today</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Date</option>
          </select>

          {/* Custom Date Picker */}
          <input
            type="date"
            value={customReDate}
            onChange={(e) => {
              const val = e.target.value;
              setCustomReDate(val);
              setDateRange(val); // ใช้เป็น selectDate เช่นกัน
            }}
            className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>
    </div>
  );
}
