// import Image from "next/image";
// import Link from "next/link";

// type TableActionButtonProps = {
//   iconSrc: string;
//   alt?: string;
//   href?: string;
//   onClick?: () => void;
//   bgColor?: string;
//   hoverColor?: string;
// };

// export default function TableActionButton({
//   iconSrc,
//   alt = "icon",
//   href,
//   onClick,
//   bgColor = "bg-gray-100",
//   hoverColor = "hover:bg-gray-200",
// }: TableActionButtonProps) {
//   const commonClass = `cursor-pointer ${bgColor} ${hoverColor} p-1 rounded-md transition-colors`;

//   const icon = (
//     // <Image
//     //   src={iconSrc}
//     //   width={1000}
//     //   height={1000}
//     //   alt={alt}
//     //   priority
//     //   className="w-[16px] h-[16px]"
//     // />
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       className="h-4 w-4"
//       fill="currentColor"
//       viewBox="0 0 20 20"
//     >
//       <path
//         fillRule="evenodd"
//         d={iconSrc}
//         clipRule="evenodd"
//       />
//     </svg>
//   );

//   if (href) {
//     return (
//       <Link href={href} className={commonClass}>
//         {icon}
//       </Link>
//     );
//   }

//   return (
//     <div onClick={onClick} className={commonClass}>
//       {icon}
//     </div>
//   );
// }
import Link from "next/link";
import { ReactElement } from "react";

type TableActionButtonProps = {
  icon: ReactElement; // รับ React element แทน iconSrc
  href?: string;
  onClick?: () => void;
  bgColor?: string;
  hoverColor?: string;
  newTab?: boolean; // 👈 เพิ่มตัวเลือกเปิดแท็บใหม่

};

export default function TableActionButton({
  icon,
  href,
  onClick,
  bgColor = "bg-gray-100",
  hoverColor = "hover:bg-gray-200",
  newTab = false, // 👈 ค่า default คือ false
}: TableActionButtonProps) {
  const commonClass = `cursor-pointer ${bgColor} ${hoverColor} p-1 rounded-md transition-colors`;

  if (href) {
    return (
      <Link
        href={href}
        className={commonClass}
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noopener noreferrer" : undefined}
      >
        {icon}
      </Link>
    );
  }

  return (
    <div onClick={onClick} className={commonClass}>
      {icon}
    </div>
  );
}