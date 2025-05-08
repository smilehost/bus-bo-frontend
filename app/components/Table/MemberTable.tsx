import React, { useState } from "react";
import Image from "next/image";

// components
import Profile from "@/app/components/Profile";
import StatusText from "@/app/components/StatusText";
import EditStatusModel from "@/app/components/Model/EditMemberStatusModal";
import EditPasswordModel from "@/app/components/Model/EditMemberPassModal";

// const
import { STATUS } from "@/constants/enum";
import Pagination from "../Pagination/Pagination";

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
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  rowsPerPage: number;
  onRowsPerPageChange: (rows: number) => void;
  totalResults: number;
  name: string;
  tel: string;
  status: STATUS;
  company: string;
  tripsTotal: number;
  lastTransaction: string;
  index: number;
  onEditPassword: (id: any) => void;
  onEditStatus?: (id: any, status: any) => void;
};

function MemberTable({
  name,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  totalResults,
  totalPages,
  currentPage,
  status,
  company,
  tripsTotal,
  lastTransaction,
  index,
  tel,
}: MemberTableProps) {
  const [isEditStatusOpen, setEditStatusOpen] = useState(false);
  const [isEditPasswordOpen, setEditPasswordOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);

  const handleEditStatus = (newStatus: STATUS) => {
    console.log("Updated Status:", newStatus);
    setCurrentStatus(newStatus);
  };

  const handleEditPassword = (newPassword: string) => {
    console.log("Updated Password:", newPassword);
  };

  return (
    <>
      <div
        className="p-5 flex justify-between items-center animate-fade-in"
        style={{
          animationDelay: `${index * 80}ms`,
          animationDuration: "600ms",
          animationFillMode: "both",
        }}
      >
        <div className="flex gap-3 items-center">
          <Profile size="w-[48px] h-[48px]" charactor={name[0]} />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-4">
              <p className="text-[16px] font-medium">{name}</p>
              <StatusText type={currentStatus} />
            </div>
            <div className="flex items-center gap-1">
              <Image
                src={"/icons/phone-gray.svg"}
                width={16}
                height={16}
                alt="icon"
                priority
              />
              <p className="text-[#6B7280] text-[12px]">{tel}</p>
            </div>
          </div>
        </div>
        <div className="flex items-end gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
              <Image
                src={"/icons/user-gray.svg"}
                width={14}
                height={14}
                alt="icon"
                priority
              />
              <p className="text-[#6B7280] text-[12px]">{company}</p>
            </div>
            <div className="flex items-center gap-1">
              <Image
                src={"/icons/ticket-gray.svg"}
                width={14}
                height={14}
                alt="icon"
                priority
              />
              <p className="text-[#6B7280] text-[12px]">
                {tripsTotal} trips total
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
              <p className="text-[12px] text-gray-500">Last Transaction</p>
            </div>
            <div className="flex items-center gap-1">
              <Image
                src={"/icons/calendar-gray.svg"}
                width={14}
                height={14}
                alt="icon"
                priority
              />
              <p className="text-[#6B7280] text-[12px]">{lastTransaction}</p>
            </div>
          </div>
          <div className="flex justify-center space-x-2">
            <ActionButton
              type="status"
              onClick={() => setEditStatusOpen(true)}
            />
            <ActionButton
              type="password"
              onClick={() => setEditPasswordOpen(true)}
            />
            <ActionButton
              type="details"
              onClick={() => console.log("View Details")}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditStatusModel
        open={isEditStatusOpen}
        onClose={() => setEditStatusOpen(false)}
        currentStatus={currentStatus}
        onSave={handleEditStatus}
      />
      <EditPasswordModel
        open={isEditPasswordOpen}
        onClose={() => setEditPasswordOpen(false)}
        onSave={handleEditPassword}
      />
    </>
  );
}

export default MemberTable;
