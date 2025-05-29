import React from "react";
import { STATUS } from "@/constants/enum";

type StatusTextProps = {
  id: number;
};
const StatusText: React.FC<StatusTextProps> = ({ id }) => {

  const statusMap: Record<number, { text: string; className: string; icon: string }> = {
    1: {
      text: STATUS.ACTIVE,
      className: "bg-green-100 text-green-800 ",
      icon: "bg-green-500"
    },
    0: {
      text: STATUS.INACTIVE,
      className: "bg-red-100 text-red-800",
      icon: "bg-red-500"
    },
  };

  const status = statusMap[id];

  if (!status) return null;
  return (
    <div
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm
        ${status.className}
      `}
    >
      <span className={` mr-1.5 h-2 w-2 rounded-full ${status.icon}`}></span>
      {status.text}
    </div>
  );
};

export default StatusText;