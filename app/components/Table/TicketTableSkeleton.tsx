import React from "react";

type TicketTableSkeletonProps = {
  rows?: number;
};

export default function TicketTableSkeleton({ rows = 6 }: TicketTableSkeletonProps) {
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white animate-fade-in">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-left text-gray-600 font-medium">
          <tr>
            <th className="px-4 py-3">Ticket ID</th>
            <th className="px-4 py-3">Route</th>
            <th className="px-4 py-3">Journey</th>
            <th className="px-4 py-3">Date & Time</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Price</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="animate-pulse">
              <td className="px-4 py-3">
                <div className="h-4 w-16 bg-gray-200 rounded shimmer" />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-6 rounded-full bg-gray-300" />
                  <div className="h-4 w-20 bg-gray-200 rounded shimmer" />
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="h-4 w-24 bg-gray-200 rounded shimmer mb-1" />
                <div className="h-3 w-16 bg-gray-100 rounded shimmer" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 w-24 bg-gray-200 rounded shimmer" />
              </td>
              <td className="px-4 py-3">
                <div className="h-6 w-20 bg-gray-200 rounded-full shimmer" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 w-12 bg-gray-200 rounded shimmer" />
              </td>
              <td className="px-4 py-3">
                <div className="h-6 w-24 bg-yellow-200 rounded shimmer" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
