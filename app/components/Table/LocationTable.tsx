import React from "react";
import Pagination from "../Pagination/Pagination";

type LocationTableProps = {
  locations: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
  }[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  rowsPerPage: number;
  totalResults: number;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

function LocationTable({
  locations,
  onDelete,
  onEdit,
  currentPage,
  onPageChange,
  rowsPerPage,
  totalResults,
  onRowsPerPageChange,
}: LocationTableProps) {
  const totalPages = Math.ceil(totalResults / rowsPerPage);

  return (
    <div className="flex flex-col space-y-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">
            Manage Locations
          </h3>
          <div className="text-sm text-gray-500">
            Total: {totalResults} entries
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr>
                <th className="sticky top-0 py-4 px-6 bg-gray-50 border-b-2 border-gray-200 font-semibold text-gray-600 text-center w-12">
                  No.
                </th>
                <th className="sticky top-0 py-4 px-6 bg-gray-50 border-b-2 border-gray-200 font-semibold text-gray-600 text-left">
                  Location Name
                </th>
                <th className="sticky top-0 py-4 px-6 bg-gray-50 border-b-2 border-gray-200 font-semibold text-gray-600 text-center">
                  Latitude
                </th>
                <th className="sticky top-0 py-4 px-6 bg-gray-50 border-b-2 border-gray-200 font-semibold text-gray-600 text-center">
                  Longitude
                </th>
                <th className="sticky top-0 py-4 px-6 bg-gray-50 border-b-2 border-gray-200 font-semibold text-gray-600 text-center w-24">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {locations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No locations found
                  </td>
                </tr>
              ) : (
                locations.map((loc, index) => (
                  <tr
                    key={loc.id}
                    className={`transition-all duration-200 hover:bg-blue-50/70 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    }`}
                  >
                    <td className="py-4 px-6 border-b border-gray-200 text-center font-medium text-gray-700">
                      {index + 1 + (currentPage - 1) * rowsPerPage}
                    </td>
                    <td className="py-4 px-6 border-b border-gray-200 font-medium text-gray-800">
                      {loc.name}
                    </td>
                    <td className="py-4 px-6 border-b border-gray-200 text-center">
                      {loc.latitude}
                    </td>
                    <td className="py-4 px-6 border-b border-gray-200 text-center">
                      {loc.longitude}
                    </td>
                    <td className="py-4 px-6 border-b border-gray-200">
                      <div className="flex justify-center space-x-2">
                        <a
                          href={`https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-purple-50 rounded-lg text-purple-600 hover:bg-purple-100 transition-colors hover:shadow-sm"
                          title="View on Map"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 3.05a7 7 0 119.9 9.9L10 20l-4.95-7.05a7 7 0 010-9.9zM10 10a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </a>
                        <button
                          onClick={() => onEdit(loc.id)}
                          className="p-1.5 bg-blue-50 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors hover:shadow-sm"
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
                          onClick={() => onDelete(loc.id)}
                          className="p-1.5 bg-red-50 rounded-lg text-red-600 hover:bg-red-100 transition-colors hover:shadow-sm"
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

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr>
              <th className="sticky top-0 py-4 px-6 bg-gray-50 border-b-2 border-gray-200 font-semibold text-gray-600 text-center w-12">
                No.
              </th>
              <th className="sticky top-0 py-4 px-6 bg-gray-50 border-b-2 border-gray-200 font-semibold text-gray-600 text-left">
                Location Name
              </th>
              <th className="sticky top-0 py-4 px-6 bg-gray-50 border-b-2 border-gray-200 font-semibold text-gray-600 text-center">
                Latitude
              </th>
              <th className="sticky top-0 py-4 px-6 bg-gray-50 border-b-2 border-gray-200 font-semibold text-gray-600 text-center">
                Longitude
              </th>
              <th className="sticky top-0 py-4 px-6 bg-gray-50 border-b-2 border-gray-200 font-semibold text-gray-600 text-center w-24">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {locations.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  No locations found
                </td>
              </tr>
            ) : (
              locations.map((loc, index) => (
                <tr
                  key={loc.id}
                  className={`border-t border-gray-200 opacity-0 animate-fade-in-up`}
  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <td className="py-4 px-6 border-b border-gray-200 text-center font-medium text-gray-700">
                    {index + 1 + (currentPage - 1) * rowsPerPage}
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200 font-medium text-gray-800">
                    {loc.name}
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200 text-center">
                    {loc.latitude}
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200 text-center">
                    {loc.longitude}
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200">
                    <div className="flex justify-center space-x-2">
                      <a
                        href={`https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-purple-50 rounded-lg text-purple-600 hover:bg-purple-100 transition-colors hover:shadow-sm"
                        title="View on Map"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 3.05a7 7 0 119.9 9.9L10 20l-4.95-7.05a7 7 0 010-9.9zM10 10a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                      <button
                        onClick={() => onEdit(loc.id)}
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
                        onClick={() => onDelete(loc.id)}
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
  );
}

export default LocationTable;
