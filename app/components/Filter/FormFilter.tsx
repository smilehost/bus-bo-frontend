import React from 'react'

//components
import SelectFilter from './SelectFilter'

//type 
import { ListValueProps } from './SelectFilter'

//icon 
import { Funnel } from 'lucide-react'
import { Search, X } from "lucide-react";


type FilterProps = {
    defaulteValue: string;
    listValue: ListValueProps[];
    setSearchValue?: React.Dispatch<React.SetStateAction<string>>;
    size: string
}

type FormFilterProps = {
    setSearch?: (value: string) => void;
    placeholderSearch?: string
    filter?: FilterProps[];
    search: string
}

function FormFilter({ setSearch, placeholderSearch, filter, search }: FormFilterProps) {

    const clearSearch = () => {
        if (setSearch) {
            setSearch("");
        }
    };
    return (
        <div className='shadow-md rounded-lg p-3 flex items-center flex-wrap gap-y-4'>
            <div className='flex-1'>
                {setSearch && (
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder={placeholderSearch}
                            className="pl-10 pr-10 py-2.5 custom-border-gray rounded-lg w-full custom-focus-input transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                            <button
                                onClick={clearSearch}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>

                )}
            </div>
            {filter && (
                <>
                    <div className='flex items-center mx-4 gap-2'>
                        <Funnel size={18}
                            style={{ color: "#6B7280" }}
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
                </>
            )}
        </div>
    )
}

export default FormFilter
