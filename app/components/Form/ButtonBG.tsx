import React from 'react'

type ButtonBG = {
    size: string
    text: string
    icon?: React.ElementType; // รับ component เช่น Home, Settings ฯลฯ
    onClick?: () => void;
    disbled?: boolean
}

function ButtonBG({ size, text, icon: Icon, onClick, disbled = false }: ButtonBG) {

    return (
        <button onClick={onClick}
            disabled={disbled}
            className={`
        ${disbled ? "bg-gray-400" : "custom-btn-bg-main"}
        custom-border-gray  border-1 border-[#D1D5DB] ${size} px-4 py-2 rounded-lg text-xs text-white cursor-pointer flex justify-center items-center gap-2`}>
            {Icon && (
                 <Icon size={16} />
            )}
            <p> {text}</p>
        </button>
    )
}

export default ButtonBG
