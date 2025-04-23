import React from 'react'
import LabelText from './LabelText'

type ColorRouteProps = {
    bgColor: string
}

function ColorRoute({ bgColor }: ColorRouteProps) {
    return (
        <div className='min-w-[300px] xl:w-[400px] max-w-[400px] flex flex-col gap-2'>
            <LabelText text='Route Color' />
            <div className='flex gap-4'>
                <div className={`${bgColor} w-[32px] h-[32px] rounded-full flex-shrink-0 custom-border-gray`} />
                <div className={`${bgColor} h-[32px] w-full rounded-md custom-border-gray`} />
            </div>
        </div>
    )
}

export default ColorRoute
