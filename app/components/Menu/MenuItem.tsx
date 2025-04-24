import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

type MenuItemProps = {
    text: string,
    icon: string,
    status: boolean,
    link: string
}
function MenuItem({ text, icon, status, link }: MenuItemProps) {
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

export default MenuItem
