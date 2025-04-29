'use client';

import CompanyModal from '@/app/components/Model/CompanyModal';
import CompanyTable from '@/app/components/Table/CompanyTable';
import { useState } from 'react';


type Company = {
  id: number;
  name: string;
  status: 'Active' | 'Inactive';
};

export default function ManageCompanies() {
  const [companies, setCompanies] = useState<Company[]>([
    { id: 1, name: 'Northern Bus Co.', status: 'Active' },
    { id: 2, name: 'Southern Express', status: 'Active' },
    { id: 3, name: 'Eastern Transport', status: 'Inactive' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCompany = (name: string) => {
    if (!name.trim()) return;
    const newCompany: Company = {
      id: companies.length + 1,
      name,
      status: 'Active',
    };
    setCompanies(prev => [...prev, newCompany]);
    setNewCompanyName('');
    setIsModalOpen(false);
  };

  return (
    <div className="">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Manage Companies</h1>
          <p className="text-gray-500">View and manage bus companies</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90 text-white px-4 py-2 rounded-md flex items-center justify-center w-full md:w-auto"
        >
          <span className="mr-2 text-xl font-bold">+</span>
          Add New Company
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search companies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* Table */}
      <CompanyTable companies={filteredCompanies} />

      {/* Modal */}
      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddCompany}
        newCompanyName={newCompanyName}
        setNewCompanyName={setNewCompanyName}
      />
    </div>
  );
}
