"use client";

import React from "react";

type Company = {
  id: number;
  name: string;
  status: "Active" | "Inactive";
};

type CompanyTableProps = {
  companies: Company[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function CompanyTable({
  companies,
  onEdit,
  onDelete,
}: CompanyTableProps) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">Companies</h3>
          <div className="text-sm text-gray-500">
            Total: {companies.length} entries
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr>
                <th className="sticky top-0 py-4 px-6 bg-gray-50 border-b-2 border-gray-200 font-semibold text-gray-600 text-left">
                  Company Name
                </th>
                <th className="sticky top-0 py-4 px-6 bg-gray-50 border-b-2 border-gray-200 font-semibold text-gray-600 text-center">
                  Status
                </th>
                <th className="sticky top-0 py-4 px-6 bg-gray-50 border-b-2 border-gray-200 font-semibold text-gray-600 text-center w-24">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {companies.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-gray-500">
                    No companies found
                  </td>
                </tr>
              ) : (
                companies.map((company, index) => (
                  <tr
                    key={company.id}
                    className={`transition-all duration-300 ease-out hover:bg-blue-50/70 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    } animate-fade-in`}
                    style={{
                      animationDelay: `${index * 80}ms`,
                      animationDuration: "600ms",
                      animationFillMode: "both",
                    }}
                  >
                    <td className="py-4 px-6 border-b border-gray-200 font-medium text-gray-800">
                      {company.name}
                    </td>
                    <td className="py-4 px-6 border-b border-gray-200">
                      <div className="flex items-center justify-center">
                        {company.status === "Active" ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 shadow-sm">
                            <span className="mr-1.5 h-2 w-2 rounded-full bg-green-500"></span>
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 shadow-sm">
                            <span className="mr-1.5 h-2 w-2 rounded-full bg-red-500"></span>
                            <span>Inactive</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 border-b border-gray-200">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => onEdit(company.id)}
                          className="p-1.5 bg-blue-50 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors hover:shadow-sm cursor-pointer"
                          title="Edit"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onDelete(company.id)}
                          className="p-1.5 bg-red-50 rounded-lg text-red-600 hover:bg-red-100 transition-colors hover:shadow-sm cursor-pointer"
                          title="Delete"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
