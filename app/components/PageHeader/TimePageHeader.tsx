import React from "react";

interface PageHeaderProps {
  onAddTime: () => void;
}

function PageHeader({ onAddTime }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h1 className="text-2xl font-semibold">Manage Time</h1>
        <p className="text-gray-500">View and manage time information</p>
      </div>
      <button 
        onClick={onAddTime}
        className="bg-main hover:opacity-90 text-white px-4 py-2 rounded-md flex items-center"
      >
        <span className="mr-2">+</span>
        Add New Time
      </button>
    </div>
  );
}

export default PageHeader;