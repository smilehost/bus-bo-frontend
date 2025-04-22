import React from 'react'
import Image from 'next/image'

type ButtonBG = {
    size: string
    text: string
    icon?: string
    onClick?: () => void;
}
function ButtonBG({ size, text, icon, onClick }: ButtonBG) {
    console.log(icon)
    return (
        <button onClick={onClick} className={`bg-main ${size} px-4 py-2 rounded-lg text-xs text-white cursor-pointer flex justify-center items-center gap-2`}>
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
