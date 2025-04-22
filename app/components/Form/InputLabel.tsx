import React from 'react'

type InputLabelProps = {
    label: string,
    placeholder: string,
    setValue: (value: string) => void;
    type: string,
    size?: string
}
function InputLabel({ label, placeholder, setValue, type, size  }: InputLabelProps) {
    return (
        <div className='flex flex-col gap-2'>
            <label className='text-xs'>{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                className={`py-1 px-5 border rounded-md border-[#D1D5DB] text-[14px] ${size}`}
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    )
}

export default InputLabel
