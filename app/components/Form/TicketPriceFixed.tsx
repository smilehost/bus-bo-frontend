"use client"

import React, { useState, useEffect } from 'react'

//type
import { TicketPriceType } from '@/types/types';

type TicketPriceFixedProps = {
    listType: TicketPriceType[];
    setTicketTypePrice: (value: TicketPriceType[]) => void;
}


function TicketPriceFixed({ listType, setTicketTypePrice }: TicketPriceFixedProps) {
    const [priceList, setPriceList] = useState<TicketPriceType[]>([]);

    // useEffect(() => {
    //     const converted = listType.map(item => ({
    //         type: item.type,
    //         price: item.price
    //     }));
    //     setPriceList(converted);
    // }, [listType]);

    // // handle change on each input
    // const handlePriceChange = (index: number, value: string) => {
    //     const newList = [...priceList];
    //     newList[index].price = parseInt(value);
    //     setPriceList(newList);
    //     setTicketTypePrice(newList);
    // };


    return (
        <div className=''>
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
                                // value={item.price.toString()}
                                // onChange={(e) => handlePriceChange(index, e.target.value)}
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


export default TicketPriceFixed