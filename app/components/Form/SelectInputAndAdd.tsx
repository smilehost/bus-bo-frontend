import React from 'react'
import Image from 'next/image';

//components
import LabelText from '@/app/components/Form/LabelText'

//mui
import { Select, MenuItem } from '@mui/material';

//type
import { SelectProps } from '@/types/form';

function SelectInputAndAdd({ data, value, onChange }: SelectProps) {

    const handleAdd = () => {
        alert("edit")
    }

    return (
        <div className=' min-w-[300px] xl:w-[400px] max-w-[400px]'>
            <div className='flex flex-col gap-2 w-full'>
                <LabelText text={"Schedule"} />
                <div className='flex w-full'>
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
                            borderRadius: '6px 0 0 6px'
                        }}
                        onChange={onChange}
                        
                    >
                        {data.map((item, index) => (
                            <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                        ))}
                    </Select>
                    <div className='cursor-pointer h-[38px] px-4 flex justify-center items-center border-1 border-l-0 border-[#D1D5DB] rounded-r-md'
                        onClick={handleAdd}
                    >
                        <Image
                            src={"/icons/plus_black.svg"}
                            width={20}
                            height={20}
                            alt='plus-icon'
                            priority
                            className=''
                        />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default SelectInputAndAdd
