'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type MenuItemProps = {
  text: string;
  icon: React.ElementType; // รับ component เช่น Home, Settings ฯลฯ
  link: string;
};

function MenuItemLink({ text, icon: Icon, link }: MenuItemProps) {
  const pathname = usePathname();
  const activePath = pathname.split('/bu/')[1]?.split('/')[0] || '';
  const isActive = activePath === link;

  return (
    <Link
      href={`/bu/${link}`}
      className={`flex items-center px-4 py-3 rounded-md text-[14px] font-medium transition-all ${
        isActive ? 'custom-bg-main text-white' : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <Icon size={20} />
      <span className="ml-3">{text}</span>
    </Link>
  );
}

export default MenuItemLink;