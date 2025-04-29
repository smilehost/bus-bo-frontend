'use client';

import React from 'react';

type Company = {
  id: number;
  name: string;
  status: 'Active' | 'Inactive';
};

type CompanyTableProps = {
  companies: Company[];
};

export default function CompanyTable({ companies }: CompanyTableProps) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left px-6 py-4">Company Name</th>
            <th className="text-center px-6 py-4">Status</th>
            <th className="text-center px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.length > 0 ? (
            companies.map(company => (
              <tr key={company.id} className="border-t border-gray-200">
                <td className="px-6 py-4">{company.name}</td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      company.status === 'Active'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {company.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button className="text-blue-500 hover:text-blue-700">✏️</button>
                  <button className="text-red-500 hover:text-red-700">🗑️</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center py-6 text-gray-500">
                No companies found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
