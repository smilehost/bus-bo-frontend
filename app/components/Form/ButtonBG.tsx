import React from 'react'
import Image from 'next/image'

type ButtonBG = {
    size: string
    text: string
    icon?: string
    onClick?: () => void;
}
function ButtonBG({ size, text, icon, onClick }: ButtonBG) {
    return (
      <button
        onClick={onClick}
        className={`w-full md:w-auto bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 text-sm font-medium ${size}`}
      >
        {icon && (
          <Image
            src={icon}
            width={16}
            height={16}
            priority
            alt="icon"
          />
        )}
        <span>{text}</span>
      </button>
    );
  }
  

export default ButtonBG
