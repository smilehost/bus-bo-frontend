import React from 'react'

type TitleProps = {
    title: string,
    description: string
}
function TitlePage({ title, description }: TitleProps) {
    return (
        <div className='flex flex-col '>
            <p className='font-bold text-[20px]'>{title}</p>
            <p className='text-[14px] text-[#4B5563]'>{description}</p>
        </div>
    )
}

export default TitlePage
