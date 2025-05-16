import React from "react";
import Pagination from "../Pagination/Pagination";
import { STATUS } from "@/constants/enum";

type ActionType = "status" | "password" | "details";

type ActionButtonProps = {
  type: ActionType;
  onClick?: () => void;
};

const ActionButton: React.FC<ActionButtonProps> = ({ type, onClick }) => {
  const buttonConfig = {
    status: {
      className:
        "p-1.5 bg-blue-50 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors hover:shadow-sm cursor-pointer flex items-center gap-2 border border-blue-100",
      title: "Edit Status",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
        </svg>
      ),
    },
    password: {
      className:
        "p-1.5 bg-amber-50 rounded-lg text-amber-600 hover:bg-amber-100 transition-colors hover:shadow-sm cursor-pointer flex items-center gap-2 border border-amber-100",
      title: "Edit Password",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          <circle cx="12" cy="16" r="1"></circle>
        </svg>
      ),
    },
    details: {
      className:
        "p-1.5 bg-emerald-50 rounded-lg text-emerald-600 hover:bg-emerald-100 transition-colors hover:shadow-sm cursor-pointer flex items-center gap-2 border border-emerald-100",
      title: "Edit Member",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      ),
    },
  };

  const config = buttonConfig[type];

  return (
    <button onClick={onClick} className={config.className} title={config.title}>
      {config.icon}
    </button>
  );
};

type MemberTableProps = {
  members: {
    id: string | number;
    name: string;
    username: string;
    role: string;
    status: number;
    company: string;
  }[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  rowsPerPage: number;
  onRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  totalResults: number;
  onEditPassword: (id: string) => void;
  onEditStatus: (id: string, status: number) => void;
  onEditMember: (id: string) => void;
};

function MemberTable({
  members,
  currentPage,
  totalPages,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  totalResults,
  onEditPassword,
  onEditStatus,
  onEditMember,
}: MemberTableProps) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">Members</h3>
          <div className="text-sm text-gray-500">
            Total: {totalResults} entries
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-hidden">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr>
                <th className="sticky top-0 py-4 px-6 bg-gray-50 border-b-2 border-gray-200 font-semibold text-gray-600 text-center w-12">
                  No.
                </th>
                <th className="sticky top-0 py-4 px-6 bg-gray-50 border-b-2 border-gray-200 font-semibold text-gray-600 text-left">
                  Name
                </th>
                <th className="sticky top-0 py-4 px-6 bg-gray-50 border-b-2 border-gray-200 font-semibold text-gray-600 text-left">
                  Username
                </th>
                <th className="sticky top-0 py-4 px-6 bg-gray-50 border-b-2 border-gray-200 font-semibold text-gray-600 text-left">
                  Company
                </th>
                <th className="sticky top-0 py-4 px-6 bg-gray-50 border-b-2 border-gray-200 font-semibold text-gray-600 text-left">
                  Role
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
              {members.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    No data found
                  </td>
                </tr>
              ) : (
                members.map((member, index) => (
                  <tr
                    key={member.id}
                    className={`transition-all duration-300 ease-out hover:bg-blue-50/70 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    } animate-fade-in`}
                    style={{
                      animationDelay: `${index * 80}ms`,
                      animationDuration: "600ms",
                      animationFillMode: "both",
                    }}
                  >
                    <td className="py-4 px-6 border-b border-gray-200 text-center font-medium text-gray-700">
                      {index + 1 + (currentPage - 1) * rowsPerPage}
                    </td>
                    <td className="py-4 px-6 border-b border-gray-200 font-medium text-gray-800">
                      {member.name}
                    </td>
                    <td className="py-4 px-6 border-b border-gray-200 text-gray-700">
                      {member.username}
                    </td>
                    <td className="py-4 px-6 border-b border-gray-200 text-gray-700">
                      {member.company}
                    </td>
                    <td className="py-4 px-6 border-b border-gray-200 text-gray-700">
                      {member.role === "1" ? "Admin" : "Salesman"}
                    </td>
                    <td className="py-4 px-6 border-b border-gray-200">
                      <div className="flex items-center justify-center">
                        {member.status === 1 ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 shadow-sm">
                            <span className="mr-1.5 h-2 w-2 rounded-full bg-green-500"></span>
                            <span>Active</span>
                          </span>
                        ) : member.status === 0 ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 shadow-sm">
                            <span className="mr-1.5 h-2 w-2 rounded-full bg-yellow-500"></span>
                            <span>Inactive</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 shadow-sm">
                            <span className="mr-1.5 h-2 w-2 rounded-full bg-red-500"></span>
                            <span>Cancelled</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 border-b border-gray-200 text-center">
                      <div className="flex justify-center space-x-2">
                        <ActionButton
                          type="status"
                          onClick={() =>
                            onEditStatus(member.id.toString(), member.status)
                          }
                        />
                        <ActionButton
                          type="password"
                          onClick={() => onEditPassword(member.id.toString())}
                        />
                        <ActionButton
                          type="details"
                          onClick={() => onEditMember(member.id.toString())}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        totalResults={totalResults}
      />
    </div>
  );
}

export default MemberTable;
