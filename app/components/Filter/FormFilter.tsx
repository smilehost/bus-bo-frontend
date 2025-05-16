import React from 'react'
import Image from 'next/image'

//components
import SelectFilter from './SelectFilter'

//type 
import { ListValueProps } from './SelectFilter'

type FilterProps = {
    defaulteValue: string;
    listValue: ListValueProps[];
    setSearchValue?: React.Dispatch<React.SetStateAction<string>>;
    size: string
}

type FormFilterProps = {
    setSearch?: (value: string) => void;
    placeholderSearch?: string
    filter: FilterProps[];
    search: string
}

function FormFilter({ setSearch, placeholderSearch, filter, search }: FormFilterProps) {
    return (
        <div className='custom-frame-content mt-5 p-3 flex items-center'>
            <div className='flex-1'>
                {setSearch && (
                    <input
                        value={search}
                        type="text"
                        className='rounded-lg border-[#D1D5DB] border-1 h-[38px] px-5 w-full'
                        placeholder={placeholderSearch}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                )}
            </div>
            <div className='flex items-center mx-4 gap-2'>
                <Image
                    src={"/icons/filter.svg"}
                    width={18}
                    height={18}
                    priority
                    alt='icon'
                />
                <p className='text-[12px] text-[#6B7280]'>Filters:</p>
            </div>
            <div className='flex gap-3'>
                {filter.map((item, index) => (
                    <SelectFilter
                        key={index}
                        width={item.size}
                        defaultValue={item.defaulteValue}
                        listValue={item.listValue}
                        onChange={(e) => item.setSearchValue?.(e.target.value)}
                    />
                ))}
            </div>
        </div>
    )
}

export default FormFilter
