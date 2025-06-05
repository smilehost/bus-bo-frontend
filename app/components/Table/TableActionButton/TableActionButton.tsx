import Link from "next/link";
import { ReactElement } from "react";
import { Tooltip } from "@mui/material";

type TableActionButtonProps = {
  icon: ReactElement;
  href?: string;
  onClick?: () => void;
  bgColor?: string;
  hoverColor?: string;
  newTab?: boolean;
  title?: string; // ใช้กับ Tooltip
};

export default function TableActionButton({
  icon,
  href,
  onClick,
  bgColor = "bg-gray-100",
  hoverColor = "hover:bg-gray-200",
  newTab = false,
  title,
}: TableActionButtonProps) {
  const commonClass = `cursor-pointer ${bgColor} ${hoverColor} w-12 h-12 flex items-center justify-center rounded-full transition-colors`;

  const buttonContent = href ? (
    <Link
      href={href}
      className={commonClass}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
    >
      {icon}
    </Link>
  ) : (
    <div onClick={onClick} className={commonClass}>
      {icon}
    </div>
  );

  return title ? (
    <Tooltip title={title} arrow>
      {/* MUI Tooltip ต้องการ element เดียวเป็น child ที่ไม่ใช่ <div> (ใช้ <span>) */}
      <span className="inline-block">{buttonContent}</span>
    </Tooltip>
  ) : (
    buttonContent
  );
}
