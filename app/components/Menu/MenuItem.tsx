import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

type MenuItemProps = {
    text: string,
    icon: string,
    status: boolean,
    link: string,
    onClick?: () => void // Optional onClick property
}
function MenuItemLink({ text, icon, status, link }: MenuItemProps) {
    return (
        <Link href={link} className={`${status && 'custom-bg-main'} hover:bg-main cursor-pointer flex gap-3 items-center px-4 py-3 rounded-lg  text-[12px]`}>
            <Image src={icon}
                priority
                width={20}
                height={20}
                alt='icon-menu' />
            <p>{text}</p>
        </Link>
    )
}

function MenuItem({ text, icon, status, onClick }: MenuItemProps) {
  return (
    <div 
      className={`flex gap-3 items-center p-3 rounded-lg cursor-pointer
        ${status 
          ? 'bg-main text-white font-medium' // ใช้ .bg-main เมื่อ status เป็น true
          : 'hover:bg-gray-100 text-gray-600'
        }`}
      onClick={onClick}
    >
      <div className="w-6 h-6 flex items-center justify-center">
        <Image 
          src={icon} 
          width={18} 
          height={18} 
          alt='icon-menu'
          className={status ? 'text-white' : 'text-gray-600'} // เปลี่ยนสีไอคอนเป็นสีขาวเมื่อ status เป็น true
          style={status ? {filter: 'none'} : {}}
        />
      </div>
      <p className="text-sm">{text}</p>
    </div>
  )
}

export default MenuItemLink