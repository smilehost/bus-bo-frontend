import React from 'react'

type TitleHeaderProps = {
    text: string
}
function TitleHeader({ text }: TitleHeaderProps) {
    return (
        <p className='text-[20px] font-bold'>{text}</p>
    )
}

export default TitleHeader