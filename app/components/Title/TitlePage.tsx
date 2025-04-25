import React from 'react'

//component
import TitleHeader from './TitleHeader'

type TitleProps = {
    title: string,
    description: string
}
function TitlePage({ title, description }: TitleProps) {
    return (
        <div className='flex flex-col '>
            <TitleHeader text={title} />
            <p className='text-[14px] text-[#4B5563]'>{description}</p>
        </div>
    )
}

export default TitlePage
