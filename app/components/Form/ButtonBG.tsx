import React from 'react'
import Image from 'next/image'

type ButtonBG = {
    size: string
    text: string
    icon?: string
    onClick?: () => void;
    disbled?: boolean
}
function ButtonBG({ size, text, icon, onClick, disbled }: ButtonBG) {
    const handleClick = () => {
        if (disbled || !onClick) return;
        onClick()
    }
    return (
        <button onClick={onClick} className={`custom-btn-bg-main custom-border-gray  border-1 border-[#D1D5DB] ${size} px-4 py-2 rounded-lg text-xs text-white cursor-pointer flex justify-center items-center gap-2`}>
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
        </button>
    )
}

export default ButtonBG
