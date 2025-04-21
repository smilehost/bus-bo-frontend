import React from 'react'

type ButtonBG = {
    size_w: string
    text: string
    icon?: string
}
function ButtonBG({ size_w, text, icon }: ButtonBG) {

    console.log(icon)
    return (
        <button className={`bg-main ${size_w} py-2 text-center rounded-lg text-xs text-white cursor-pointer`}>
            {text}
        </button>
    )
}

export default ButtonBG
