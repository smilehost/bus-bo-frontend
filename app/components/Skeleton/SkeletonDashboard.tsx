import React from "react";

export default function SkeletonDashboard() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="h-6 w-48 bg-gray-200 rounded-md mb-2" />
          <div className="h-4 w-64 bg-gray-200 rounded-md" />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row gap-4">
        <div className="h-10 w-32 bg-gray-100 rounded" />
        <div className="h-10 w-48 bg-gray-100 rounded" />
        <div className="h-10 w-48 bg-gray-100 rounded" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-lg shadow-sm space-y-4"
          >
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gray-200 rounded-md" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-6 w-32 bg-gray-100 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-lg shadow-sm space-y-4"
          >
            <div className="h-5 w-48 bg-gray-200 rounded" />
            <div className="h-80 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
