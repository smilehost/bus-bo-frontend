import React from 'react'

//mui
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { SelectChangeEvent } from '@mui/material/Select'

export type ListValueProps = {
    key: number,
    value: string
}
export type SelectFilterProps = {
    width: string;
    defaultValue: string;
    listValue?: ListValueProps[];
    onChange?: (event: SelectChangeEvent) => void; // ✅ เพิ่ม onChange ที่ถูกต้อง

}

function SelectFilter({ width, defaultValue, listValue, onChange }: SelectFilterProps) {
    return (

        <Select
            displayEmpty
            className={`${width}`}
            id="simple-select"
            sx={{
                borderRadius: '8px',
                backgroundColor: '#F9FAFB',
                fontSize: '14px',
                padding: '10px',
                height: '38px',

                '& .MuiSelect-select': {
                    padding: '10px',
                },
                '& fieldset': {
                    borderColor: '#D1D5DB',
                },
                '&:hover fieldset': {
                    borderColor: '#F97316',
                },
                '&.Mui-focused fieldset': {
                    borderColor: '#EAB308',
                },
            }}
            defaultValue={defaultValue}
            onChange={onChange} 
        >
            <MenuItem value={defaultValue}>{defaultValue}</MenuItem>
            {listValue?.map((item, index) => (
                <MenuItem key={index} value={item.key}>{item.value}</MenuItem>
            ))}
        </Select>
    )
}

export default SelectFilter
