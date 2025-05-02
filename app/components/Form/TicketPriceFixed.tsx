"use client";

import React, { useEffect, useState } from 'react';

//type
import { TicketPriceTypeFixed } from '@/app/bu/manage-route/ticket/[id]/page';

type TicketPriceFixedProps = {
  listType: TicketPriceTypeFixed[];
  setTicketTypePrice: (value: TicketPriceTypeFixed[]) => void;
};

function TicketPriceFixed({ listType, setTicketTypePrice }: TicketPriceFixedProps) {
  const [priceList, setPriceList] = useState<TicketPriceTypeFixed[]>([]);

  // sync priceList with incoming listType (only when listType changes)
  useEffect(() => {
    setPriceList(listType);
  }, [listType]);

  const handlePriceChange = (index: number, value: string) => {
    const cleanedValue = value.replace(/^0+(?!$)/, ''); // ตัด 0 ข้างหน้า
    const numericValue = cleanedValue === '' ? 0 : Number(cleanedValue); // ป้องกัน NaN

    const updated = [...priceList];
    updated[index].price = numericValue;
    setPriceList(updated);
    setTicketTypePrice(updated);
  };


  return (
    <div>
      <div className='flex text-[#6B7280] bg-[#F9FAFB] text-[14px]'>
        <div className='flex-1 py-3 text-center'>
          <p>Type</p>
        </div>
        <div className='flex-1 py-3 text-center'>
          <p>Price</p>
        </div>
      </div>

      {priceList.map((item, index) => (
        <div key={index} className='flex text-[16px] border-b border-[#E5E7EB]'>
          <div className='flex-1 py-4 text-center'>
            <p>{item.name}</p>
          </div>
          <div className='flex-1 py-4 flex justify-center'>
            <div className='flex gap-3'>
              <input
                type="number"
                value={item.price.toString()}
                onChange={(e) => handlePriceChange(index, e.target.value)}
                className='custom-border-gray text-center rounded-md w-[100px]'
              />
              <p>THB</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TicketPriceFixed;
