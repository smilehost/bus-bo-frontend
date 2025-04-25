import React from 'react'

type LabelTextProps = {
    text: string
}

function LabelText({ text }: LabelTextProps) {
    return (
        <label className='text-xs'>{text}</label>
    )
}

export default LabelText
