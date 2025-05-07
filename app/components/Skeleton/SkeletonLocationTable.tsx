import React from "react";

interface SkeletonLocationTableProps {
  rows?: number;
}

const SkeletonLocationTable: React.FC<SkeletonLocationTableProps> = ({
  rows = 10,
}) => {
  return (
    <div className="flex flex-col space-y-6 animate-pulse">
      {/* Page Header + Search Filter */}
      {/* <div className="flex justify-between items-center mb-4">
        <div>
          <div className="h-6 w-48 bg-gray-200 rounded-md mb-2" />
          <div className="h-4 w-64 bg-gray-200 rounded-md" />
        </div>
        <div className="h-10 w-40 bg-gradient-to-r bg-gray-300 rounded-md" />
      </div> */}
      
      {/* <div className="mb-4">
        <div className="w-full h-10 border border-gray-200 bg-white rounded-md px-3" />
      </div> */}

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {/* Table Header */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
          <div className="h-5 w-40 bg-gray-200 rounded" />
          <div className="h-4 w-24 bg-gray-100 rounded" />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr>
                {[
                  "No.",
                  "Location Name",
                  "Latitude",
                  "Longitude",
                  "Actions",
                ].map((_, i) => (
                  <th
                    key={i}
                    className="sticky top-0 py-4 px-6 bg-gray-50 border-b-2 border-gray-200 text-center"
                  >
                    <div className="h-3 w-24 bg-gray-300 rounded mx-auto" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`${
                    rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                  }`}
                >
                  {/* No. */}
                  <td className="py-4 px-6 border-b border-gray-200 text-center">
                    <div className="h-4 w-6 bg-gray-200 rounded mx-auto" />
                  </td>

                  {/* Location Name */}
                  <td className="py-4 px-6 border-b border-gray-200">
                    <div className="h-4 w-40 bg-gray-200 rounded" />
                  </td>

                  {/* Latitude */}
                  <td className="py-4 px-6 border-b border-gray-200 text-center">
                    <div className="h-4 w-20 bg-gray-100 rounded mx-auto" />
                  </td>

                  {/* Longitude */}
                  <td className="py-4 px-6 border-b border-gray-200 text-center">
                    <div className="h-4 w-20 bg-gray-100 rounded mx-auto" />
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 border-b border-gray-200">
                    <div className="flex justify-center space-x-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-6 w-6 bg-gray-200 rounded-full"
                        />
                      ))}
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
};

export default SkeletonLocationTable;
