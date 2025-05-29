import React from 'react';
import { Select, MenuItem, InputAdornment, SelectChangeEvent } from '@mui/material';
import Image from 'next/image';
import LabelText from '@/app/components/Form/LabelText';

//icon
import { Clock } from 'lucide-react';

interface UnifiedSelectItem {
  id: number;
  name: string;
  schedule?: string[]; // สำหรับกรณีมี schedule
}

interface UnifiedSelectProps {
  label: string;
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  data: UnifiedSelectItem[];
  withRenderValue?: boolean; // แสดงชื่อ + schedule
  withStartAdornment?: boolean; // ใส่ icon ด้านซ้าย
  onAddClick?: () => void;
  tailwind?: string
}

const SelectInputUnified: React.FC<UnifiedSelectProps> = ({
  label,
  value,
  onChange,
  data,
  withRenderValue = false,
  withStartAdornment = false,
  onAddClick,
  tailwind="min-w-[300px] xl:w-[400px] max-w-[400px]"
}) => {
  return (
    <div className={`${tailwind}`}>
      <div className="flex flex-col gap-2 w-full">
        <LabelText text={label} />
        <div className="relative flex w-full">
          <Select
            value={value}
            onChange={onChange}
            className="w-full h-[38px] custom-border-gray"
            renderValue={
              withRenderValue
                ? () => {
                    if (!value) return;
                    const selectedItem = data.find((item) => item.id === parseInt(value));
                    const timeString = selectedItem?.schedule?.join(', ') || '';
                    return (
                      <p className="text-[13px] custom-ellipsis-style w-40 lg:w-64"
            
                      >
                        {selectedItem?.name} {timeString}
                      </p>
                    );
                  }
                : undefined
            }
            startAdornment={
              withStartAdornment && (
                <InputAdornment position="start">
                  <Clock size={22}/>
                </InputAdornment>
              )
            }
            sx={{
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
              backgroundColor: 'transparent',
              boxShadow: 'none',
              borderRadius: '6px 0 0 6px',
            }}
          >
            {data.map((item) => (
              <MenuItem value={item.id} key={item.id}>
                <div className="flex justify-between w-full">
                  <p className="text-[13px]">
                    {item.name} {item.schedule?.join(', ')}
                  </p>
                </div>
              </MenuItem>
            ))}
          </Select>

          {onAddClick && (
            <div
              className="cursor-pointer h-[38px] px-4 flex justify-center items-center border-1 border-l-0 border-[#D1D5DB] rounded-r-md"
              onClick={onAddClick}
            >
              <Image
                src="/icons/plus_black.svg"
                width={20}
                height={20}
                alt="plus-icon"
                priority
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectInputUnified;