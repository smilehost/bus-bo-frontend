import React from "react";
import { STATUS } from "@/constants/enum";

type StatusTextProps = {
  id: number;
};
const StatusText: React.FC<StatusTextProps> = ({ id }) => {

  const statusMap: Record<number, { text: string; className: string }> = {
    1: {
      text: STATUS.ACTIVE,
      className: "bg-[#DCFCE7] text-[#166534]",
    },
    0: {
      text: STATUS.INACTIVE,
      className: "bg-[#F3F4F6] text-[#4B5563]",
    },
  };

  const status = statusMap[id];
  
  if (!status) return null;
  return (
    <div
      className={`
        px-3 py-1 rounded-xl w-fit text-[10px] font-medium
        ${status.className}
      `}
    >
      {status.text}
    </div>
  );
};

export default StatusText;