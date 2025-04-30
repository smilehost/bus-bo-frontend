import React from "react";

export default function SkeletonRoute() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header */}
      {/* <div className="flex justify-between items-center mb-4">
        <div>
          <div className="h-6 w-48 bg-gray-200 rounded-md mb-2" />
          <div className="h-4 w-64 bg-gray-200 rounded-md" />
        </div>
        <div className="h-10 w-40 bg-gradient-to-r bg-gray-300 rounded-md" />
      </div> */}

      {/* Search + Filters */}
      {/* <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="h-10 w-full md:w-80 bg-gray-100 rounded-md" />
        <div className="flex gap-2">
          <div className="h-10 w-40 bg-gray-100 rounded-md" />
          <div className="h-10 w-40 bg-gray-100 rounded-md" />
        </div>
      </div> */}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[...Array(7)].map((_, idx) => (
                  <th key={idx} className="px-6 py-3">
                    <div className="h-4 bg-gray-200 rounded w-24 mx-auto" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[...Array(8)].map((_, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  {/* Route (icon line + text) */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 rounded bg-gray-300" />
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                    </div>
                  </td>
                  {/* Company */}
                  <td className="px-6 py-4">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                  </td>
                  {/* Schedule */}
                  <td className="px-6 py-4">
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                  </td>
                  {/* Time */}
                  <td className="px-6 py-4">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                  </td>
                  {/* Tickets */}
                  <td className="px-6 py-4 text-center">
                    <div className="h-4 w-6 bg-gray-200 rounded mx-auto" />
                  </td>
                  {/* Status */}
                  <td className="px-6 py-4">
                    <div className="h-6 w-20 bg-gray-200 rounded-full" />
                  </td>
                  {/* Action */}
                  <td className="px-6 py-4">
                    <div className="flex justify-start gap-2">
                      <div className="h-6 w-6 bg-gray-200 rounded" />
                      <div className="h-6 w-6 bg-gray-200 rounded" />
                      <div className="h-6 w-6 bg-gray-200 rounded" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
