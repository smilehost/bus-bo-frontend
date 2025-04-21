import React from 'react'

type InputLabelProps = {
    label: string,
    placeholder: string,
    setValue?: () => void;
}
function InputLabel({ label, placeholder }: InputLabelProps) {
    return (
        <div className='flex flex-col gap-1'>
            <label className='text-xs'>{label}</label>
            <input
                type="text"
                placeholder={placeholder}
                className='py-1 px-5 border rounded-md border-[#D1D5DB] text-[14px]'
            />
        </div>
    )
}

export default InputLabel
