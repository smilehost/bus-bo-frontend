import React, { useState } from "react";
import Image from "next/image";

// components
import Profile from "@/app/components/Profile";
import StatusText from "@/app/components/StatusText";
import EditStatusModel from "@/app/components/Model/EditMemberStatusModal";
import EditPasswordModel from "@/app/components/Model/EditMemberPassModal";
import Pagination from "../Pagination/Pagination";

// const
import { STATUS } from "@/constants/enum";

// ประเภทของ Actions
type ActionType = "status" | "password" | "details";

// Props สำหรับ ActionButton component
type ActionButtonProps = {
  type: ActionType;
  onClick?: () => void;
};

// Component สำหรับปุ่ม Action
const ActionButton: React.FC<ActionButtonProps> = ({ type, onClick }) => {
  const buttonConfig = {
    status: {
      className:
        "px-2.5 py-1.5 bg-blue-50 rounded-lg text-blue-600 hover:bg-blue-100 transition-all duration-200 hover:shadow-md flex items-center gap-2 border border-blue-100",
      title: "Edit Status",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      ),
    },
    password: {
      className:
        "px-2.5 py-1.5 bg-amber-50 rounded-lg text-amber-600 hover:bg-amber-100 transition-all duration-200 hover:shadow-md flex items-center gap-2 border border-amber-100",
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
        "px-2.5 py-1.5 bg-emerald-50 rounded-lg text-emerald-600 hover:bg-emerald-100 transition-all duration-200 hover:shadow-md flex items-center gap-2 border border-emerald-100",
      title: "View Details",
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
    id: number;
    name: string;
    tel: string;
    status: STATUS;
    company: string;
    tripsTotal: number;
    lastTransaction: string;
  }[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  rowsPerPage: number;
  onRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  totalResults: number;
  onEditPassword: (id: number) => void;
  onEditStatus?: (id: number, status: STATUS) => void;
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
}: MemberTableProps) {
  const [isEditStatusOpen, setEditStatusOpen] = useState(false);
  const [isEditPasswordOpen, setEditPasswordOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<STATUS | null>(null);

  const handleEditStatus = (newStatus: STATUS) => {
    console.log("Updated Status:", newStatus);
    setCurrentStatus(newStatus);
  };

  const handleEditPassword = (newPassword: string) => {
    console.log("Updated Password:", newPassword);
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">Members</h3>
          <div className="text-sm text-gray-500">
            Total: {totalResults} entries
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr>
                <th className="py-4 px-6 bg-gray-50 border-b-2 border-gray-200 font-semibold text-gray-600 text-center">
                  No.
                </th>
                <th className="py-4 px-6 bg-gray-50 border-b-2 border-gray-200 font-semibold text-gray-600 text-left">
                  Name
                </th>
                <th className="py-4 px-6 bg-gray-50 border-b-2 border-gray-200 font-semibold text-gray-600 text-left">
                  Phone
                </th>
                <th className="py-4 px-6 bg-gray-50 border-b-2 border-gray-200 font-semibold text-gray-600 text-left">
                  Company
                </th>
                <th className="py-4 px-6 bg-gray-50 border-b-2 border-gray-200 font-semibold text-gray-600 text-center">
                  Trips Total
                </th>
                <th className="py-4 px-6 bg-gray-50 border-b-2 border-gray-200 font-semibold text-gray-600 text-center">
                  Last Transaction
                </th>
                <th className="py-4 px-6 bg-gray-50 border-b-2 border-gray-200 font-semibold text-gray-600 text-center">
                  Status
                </th>
                <th className="py-4 px-6 bg-gray-50 border-b-2 border-gray-200 font-semibold text-gray-600 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    No data found
                  </td>
                </tr>
              ) : (
                members.map((member, index) => (
                  <tr
                    key={member.id}
                    className={`transition-all duration-300 ease-out hover:bg-blue-50/70 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    }`}
                  >
                    <td className="py-4 px-6 border-b border-gray-200 text-center font-medium text-gray-700">
                      {index + 1 + (currentPage - 1) * rowsPerPage}
                    </td>
                    <td className="py-4 px-6 border-b border-gray-200 font-medium text-gray-800">
                      {member.name}
                    </td>
                    <td className="py-4 px-6 border-b border-gray-200 text-gray-700">
                      {member.tel}
                    </td>
                    <td className="py-4 px-6 border-b border-gray-200 text-gray-700">
                      {member.company}
                    </td>
                    <td className="py-4 px-6 border-b border-gray-200 text-center text-gray-700">
                      {member.tripsTotal}
                    </td>
                    <td className="py-4 px-6 border-b border-gray-200 text-center text-gray-700">
                      {member.lastTransaction}
                    </td>
                    <td className="py-4 px-6 border-b border-gray-200 text-center">
                      <StatusText type={member.status} />
                    </td>
                    <td className="py-4 px-6 border-b border-gray-200 text-center">
                      <div className="flex justify-center space-x-2">
                        <ActionButton
                          type="status"
                          onClick={() => {
                            setEditStatusOpen(true);
                            setCurrentStatus(member.status);
                          }}
                        />
                        <ActionButton
                          type="password"
                          onClick={() => onEditPassword(member.id)}
                        />
                        <ActionButton
                          type="details"
                          onClick={() => console.log("View Details")}
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

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange} 
        totalResults={totalResults}
      />

      {/* Modals */}
      <EditStatusModel
        open={isEditStatusOpen}
        onClose={() => setEditStatusOpen(false)}
        currentStatus={currentStatus ?? STATUS.ACTIVE}
        onSave={handleEditStatus}
      />
      <EditPasswordModel
        open={isEditPasswordOpen}
        onClose={() => setEditPasswordOpen(false)}
        onSave={handleEditPassword}
      />
    </div>
  );
}

export default MemberTable;
