import React from "react";

export default function SkeletonDateTable({ count = 10 }: { count?: number }) {
  const skeletonRows = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="flex flex-col space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="h-6 w-48 bg-gray-200 rounded-md mb-2" />
          <div className="h-4 w-64 bg-gray-200 rounded-md" />
        </div>
        <div className="h-10 w-40 bg-gradient-to-r bg-gray-300 rounded-md" />
      </div>

      {/* Search Filter */}
      <div className="mb-4">
        <div className="h-10 w-full bg-gray-200 rounded-md" />
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
          <div className="h-5 w-32 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {[...Array(10)].map((_, index) => (
                  <th key={index} className="py-4 px-6 bg-gray-50 border-b border-gray-200 ">
                    <div className="h-4 w-16 bg-gray-200 rounded mx-auto" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {skeletonRows.map((index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {[...Array(10)].map((_, i) => (
                    <td key={i} className="py-4 px-6 border-b border-gray-200 ">
                      <div className="h-5 w-full bg-gray-200 rounded" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gray-200 rounded" />
          <div className="h-8 w-8 bg-gray-200 rounded" />
          <div className="h-8 w-20 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}