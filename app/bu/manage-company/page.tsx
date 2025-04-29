'use client';

import CompanyModal from '@/app/components/Model/CompanyModal';
import CompanyTable from '@/app/components/Table/CompanyTable';
import { useState } from 'react';

//components
import TitlePageAndButton from '@/app/components/Title/TitlePageAndButton';

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

  const handleOpenModel = () => {
    setIsModalOpen(true)
  }

  return (
    <div className="">
      {/* Header */}
      <TitlePageAndButton title='Manage Companies' description='View and manage bus companies' handleOpenModel={handleOpenModel} btnText='Add New Company' />

      {/* Search */}
      <div className="mb-4 mt-6">
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
