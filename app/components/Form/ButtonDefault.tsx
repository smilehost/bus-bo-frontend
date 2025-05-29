import React from 'react'
import Image from 'next/image'

type ButtonDefaultProps = {
    size: string
    text: string
    icon?: string
    onClick?: () => void;
}
function ButtonDefault({ size, text, icon, onClick }: ButtonDefaultProps) {
    return (
        <div onClick={onClick} className={`custom-border-gray ${size} px-4 py-2 rounded-lg text-xs cursor-pointer flex justify-center items-center gap-2`}>
            {icon && (
                <Image
                    src={icon}
                    width={16}
                    height={16}
                    priority
                    alt='icon'
                />
            )}
            <p> {text}</p>
        </div>
    )
}

export default ButtonDefault
