import React from "react";

export default function SkeletonManageTime({ rows = 5 }: { rows?: number }) {
  return (
    <div className="flex-1 w-full min-h-screen px-6 py-6 animate-pulse bg-gray-50">
    <div className="flex flex-col space-y-6 animate-pulse">
      {/* Page Header */}
      {/* <div className="flex justify-between items-center mb-4">
        <div>
          <div className="h-6 w-48 bg-gray-200 rounded-md mb-2" />
          <div className="h-4 w-64 bg-gray-200 rounded-md" />
        </div>
        <div className="h-10 w-40 bg-gradient-to-r bg-gray-300 rounded-md" />
      </div> */}

      {/* Search Bar */}
      {/* <div className="mb-4">
        <div className="w-full h-10 border border-gray-200 bg-gray-100 rounded-md px-3" />
      </div> */}

      {/* Table Block */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {/* Table Header */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
          <div className="h-5 w-40 bg-gray-200 rounded" />
          <div className="h-4 w-24 bg-gray-100 rounded" />
        </div>

        {/* List Rows */}
        <div>
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className={`grid grid-cols-12 items-center px-6 py-4 ${
                i !== rows - 1 ? "border-b border-gray-200" : ""
              }`}
            >
              {/* Time name icon */}
              <div className="col-span-3 flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-300 rounded-full" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
              </div>

              {/* Schedule */}
              <div className="col-span-7 flex items-center space-x-3">
                <div className="h-6 w-6 bg-blue-100 rounded-full" />
                <div className="h-4 w-60 bg-gray-100 rounded" />
              </div>

              {/* Action buttons */}
              <div className="col-span-2 flex justify-end space-x-2">
                <div className="h-6 w-6 bg-gray-200 rounded-md" />
                <div className="h-6 w-6 bg-gray-200 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center px-4">
        <div className="h-4 w-32 bg-gray-200 rounded" />
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gray-100 rounded" />
          <div className="h-8 w-8 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
    </div>
  );
}
