import React from "react";

export default function SkeletonCompanyTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="h-6 w-48 bg-gray-200 rounded-md mb-2" />
          <div className="h-4 w-64 bg-gray-200 rounded-md" />
        </div>
        <div className="h-10 w-40 bg-gradient-to-r bg-gray-300 rounded-md" />
      </div>

      {/* Search Input */}
      <div className="h-10 w-full bg-white rounded-lg border border-gray-200" />

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-4">
                <div className="h-4 w-32 bg-gray-200 rounded" />
              </th>
              <th className="text-center px-6 py-4">
                <div className="h-4 w-20 bg-gray-200 mx-auto rounded" />
              </th>
              <th className="text-center px-6 py-4">
                <div className="h-4 w-16 bg-gray-200 mx-auto rounded" />
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="border-t border-gray-200">
                <td className="px-6 py-4">
                  <div className="h-4 w-40 bg-gray-100 rounded" />
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="h-6 w-20 mx-auto bg-gray-100 rounded-full" />
                </td>
                <td className="px-6 py-4 text-center space-x-2 flex justify-center">
                  <div className="h-6 w-6 bg-gray-200 rounded-md" />
                  <div className="h-6 w-6 bg-gray-200 rounded-md" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
