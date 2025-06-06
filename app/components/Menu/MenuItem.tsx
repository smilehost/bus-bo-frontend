'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type MenuItemProps = {
  text: string;
  icon: React.ElementType; // เช่น Users, Home
  href: string; // path จริง เช่น /bu/manage-members
  as?: string;  // path ที่แสดง เช่น /bu/manage-admin (optional)
};

function MenuItemLink({ text, icon: Icon, href, as }: MenuItemProps) {
  const pathname = usePathname();
  console.log("---------");
  
  console.log('pathname', pathname);
  
  const current = pathname.replace('/bu/', '').split('/')[0];
  console.log('current', current);
  
  const expected = (as ?? href).replace('/bu/', '').split('/')[0];
  console.log('expected', expected);

  const isActive = current === expected;

  return (
    <Link
      href={href}
      as={as ?? href}
      className={`flex items-center px-4 py-3 rounded-md text-[14px] font-medium transition-all ${
        isActive ? 'custom-bg-main text-white' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon size={20} />
      <span className="ml-3">{text}</span>
    </Link>
  );
}

export default MenuItemLink;
