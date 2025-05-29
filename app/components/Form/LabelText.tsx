import React from 'react'

type LabelTextProps = {
    text: React.ReactNode
}

function LabelText({ text }: LabelTextProps) {
    return (
        <label className='text-xs'>{text}</label>
    )
}

export default LabelText
