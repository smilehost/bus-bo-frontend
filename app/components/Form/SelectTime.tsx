import React, { useState } from 'react'
import { Select, MenuItem, InputAdornment, SelectChangeEvent } from '@mui/material';
import Image from 'next/image'
import { STATUS } from '@/constants/enum';

//component
import LabelText from '@/app/components/Form/LabelText'

import { TimeItem } from '@/types/time';

export type TimeGroup = {
  name: string;
  times: string[];
  status: STATUS; // หรือจะใช้ enum ก็ได้
};

export interface SelectTimeProps {
  selectedTime: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  timeData: TimeItem[];
}


function SelectTime({ selectedTime, onChange, timeData }: SelectTimeProps) {

  const [open, setOpen] = useState(false); // สถานะการเปิด/ปิดของเมนู

  const handleEditTime = () => {
    alert("edit");
  }

  return (
    <div className='flex flex-col gap-2 min-w-[300px] xl:w-[400px] max-w-[400px]'>
      <LabelText text={"Departure Times"} />
      <div className="relative">
        <Select
          value={selectedTime || ""}
          onChange={onChange}
          className='w-full h-[38px] custom-border-gray'
          renderValue={() => {
            // คุณสามารถแมปชื่อแสดงตรงนี้ได้ถ้าต้องการ
            if(!selectedTime) return;
            const timeActive = timeData.find((item) => item.id === parseInt(selectedTime));
            const timeString = timeActive?.schedule.join(', ') || ''; // แสดงเวลาในรูปแบบที่ต้องการ

            return <span className='text-[13px]'>{timeActive?.name} {timeString} </span>;
          }}
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
          IconComponent={() => (
            <Image
              src="/icons/clock.svg"
              alt="clock"
              className="mr-3"
              width={12}
              height={12}
            />
          )}
          startAdornment={(
            <InputAdornment position="start">
              <Image
                src="/icons/clock-gray.svg"
                alt="clock icon"
                width={22}
                height={22}
              />
            </InputAdornment>
          )}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
        >
          {timeData.map((item, index) => (
            <MenuItem value={item.id} key={index}>
              <div className='flex justify-between w-full'>
                <p className='text-[13px]'>{item.name}  {item.schedule.join(', ')}</p>
                {open && (
                  <div onClick={handleEditTime}>
                    <Image
                      src={"/icons/edit.svg"}
                      width={15}
                      height={15}
                      priority
                      alt='icon'
                    />
                  </div>
                )}
              </div>
            </MenuItem>
          ))}
        </Select>

      </div>
    </div>
  );
}

export default SelectTime;