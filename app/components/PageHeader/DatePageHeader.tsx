import React from "react";

interface PageHeaderProps {
  onAddDate: () => void;
}

function PageHeader({ onAddDate }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h1 className="text-2xl font-semibold">Manage Date</h1>
        <p className="text-gray-500">View and manage date information</p>
      </div>
      <button 
        onClick={onAddDate}
        className="bg-main hover:opacity-90 text-white px-4 py-2 rounded-md flex items-center"
      >
        <span className="mr-2">+</span>
        Add New Date
      </button>
    </div>
  );
}

export default PageHeader;