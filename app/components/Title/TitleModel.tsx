import React from 'react'

type TitleModelProps = {
    title: string;
    description: string
}

function TitleModel({ title, description }: TitleModelProps) {
    return (
        <div className='flex flex-col gap-1 items-center'>
            <p className='text-[16px] font-medium'>{title}</p>
            <p className='text-[12px] text-[#6B7280]'>{description}</p>
        </div>
    )
}

export default TitleModel
 