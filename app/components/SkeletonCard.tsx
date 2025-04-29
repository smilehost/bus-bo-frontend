// components/SkeletonTableRealistic.tsx
import React from "react";

interface SkeletonTableRealisticProps {
  rows?: number;
  columns?: string[];
}

const SkeletonTableRealistic: React.FC<SkeletonTableRealisticProps> = ({
  rows = 5,
  columns = ["Column 1", "Column 2", "Column 3"],
}) => {
  return (
    <div className="overflow-x-auto animate-pulse">
      <table className="min-w-full text-sm border border-gray-200 rounded-md">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((_, i) => (
              <th key={i} className="px-4 py-2">
                <div className="h-4 w-24 bg-gray-300 rounded" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-t border-gray-200">
              {columns.map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  <div className="h-4 w-full bg-gray-100 rounded" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SkeletonTableRealistic;
