import React from 'react'
import LabelText from './LabelText'

type InputLabelProps = {
    label: React.ReactNode,
    placeholder: string,
    setValue: (value: string) => void;
    value?: string | undefined;
    type: string,
    size?: string
    autoComplete?: string;
    disabled?: boolean;
}
function InputLabel({ label, placeholder, setValue, type, size, value, disabled }: InputLabelProps) {
    return (
        <div className='flex flex-col gap-2'>
            <LabelText text={label} />
            <input
                value={value}
                type={type}
                placeholder={placeholder}
                className={`h-[38px] px-5 rounded-md custom-border-gray text-[14px] ${size}`}
                onChange={(e) => setValue(e.target.value)}
                disabled={disabled}
            />
        </div>
    )
}

export default InputLabel
