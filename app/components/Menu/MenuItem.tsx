import React from 'react'
import Image from 'next/image'

type MenuItemProps = {
    text: string,
    icon: string,
    status: boolean
}
function MenuItem({ text, icon, status }: MenuItemProps) {
    return (
        <div className={`${status && 'bg-main'} hover:bg-main cursor-pointer flex gap-3 items-center px-4 py-3 rounded-lg  text-[12px]`}>
            <Image src={icon}
                priority
                width={20}
                height={20}
                alt='icon-menu' />
            <p>{text}</p>
        </div>
    )
}

export default MenuItem
