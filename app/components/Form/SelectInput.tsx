import React from 'react'

//component
import LabelText from '@/app/components/Form/LabelText'

//mui
import { Select, MenuItem } from '@mui/material';

//types
import { SelectProps } from '@/types/form';

function SelectInput({ data, value, onChange }: SelectProps) {

    return (
        <div className='flex flex-col gap-2 min-w-[300px] xl:w-[400px] max-w-[400px]'>
            <LabelText text={"Departure Times"} />
            <div className="relative">
                <Select
                    value={value}
                    className='w-full h-[38px] custom-border-gray'
                    sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                        },
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        borderRadius: '6px'
                    }}
                    onChange={onChange}
                >
                    {data.map((item, index) => (
                        <MenuItem key={index} value={index + 1}>{item.name}</MenuItem>
                    ))}
                </Select>

            </div>
        </div>
    )
}

export default SelectInput
