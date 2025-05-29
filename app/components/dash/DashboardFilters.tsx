import { FilterIcon } from "lucide-react";

export default function DashboardFilters({
  selectedCompany,
  selectedProvince,
  setSelectedCompany,
  setSelectedProvince,
}: {
  selectedCompany: string;
  selectedProvince: string;
  setSelectedCompany: (val: string) => void;
  setSelectedProvince: (val: string) => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
        <div className="flex items-center text-gray-500">
          <FilterIcon size={18} className="mr-2" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Companies</option>
            <option value="company1">Northern Bus Co.</option>
            <option value="company2">Southern Express</option>
            <option value="company3">Eastern Transport</option>
          </select>
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Provinces</option>
            <option value="province1">North Province</option>
            <option value="province2">South Province</option>
            <option value="province3">East Province</option>
            <option value="province4">West Province</option>
          </select>
        </div>
      </div>
    </div>
  );
}
