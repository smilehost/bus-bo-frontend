import React from "react";

export default function SkeletonMemberPage({ rows = 5 }: { rows?: number }) {
  return (
    <div className="flex flex-col space-y-6 animate-pulse">
      {/* Header + Button */}
      {/* <div className="flex justify-between items-center mb-4">
        <div>
          <div className="h-6 w-48 bg-gray-200 rounded-md mb-2" />
          <div className="h-4 w-64 bg-gray-200 rounded-md" />
        </div>
        <div className="h-10 w-40 bg-gradient-to-r bg-gray-300 rounded-md" />
      </div> */}

      {/* Search + Filter */}
      {/* <div className="flex flex-wrap gap-4">
        <div className="flex-1 h-10 bg-white border border-gray-200 rounded-md" />
        <div className="h-10 w-32 bg-white border border-gray-200 rounded-md" />
        <div className="h-10 w-40 bg-white border border-gray-200 rounded-md" />
      </div> */}

      {/* Member List */}
      <div className="custom-frame-content flex flex-col space-y-6">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i}>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-300 rounded-full" />
                <div className="flex flex-col space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  <div className="h-4 w-24 bg-gray-100 rounded" />
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex flex-col space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="h-4 w-20 bg-gray-100 rounded" />
                </div>
                <div className="h-8 w-24 bg-gray-300 rounded-md" />
              </div>
            </div>
            {/* Divider */}
            {i < rows - 1 && <hr className="border-t border-gray-200 mt-4" />}
          </div>
        ))}
      </div>
    </div>
  );
}
