"use client"

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@mui/material'

//component
import TitleHeader from '../Title/TitleHeader'
import ButtonBG from '../Form/ButtonBG'
import ButtonDefault from '../Form/ButtonDefault'

//type
import { TicketTypePrice } from '@/app/bu/manage-route/ticket/[id]/page'

type TicketPriceFixedProps = {
    open: boolean
    listType: TicketTypePrice[];
    setTicketTypePrice: (value: TicketTypePrice[]) => void;
    onClose: () => void
    onHandle: (value: TicketTypePrice[]) => void
}

type PriceListItem = {
    type: string;
    price: string; // ใช้ string ชั่วคราวใน input
};

function TicketPriceFixed({ open, onClose, onHandle, listType }: TicketPriceFixedProps) {
    const [priceList, setPriceList] = useState<PriceListItem[]>([]);

    useEffect(() => {
        const converted = listType.map(item => ({
            type: item.type,
            price: item.price.toString()
        }));
        setPriceList(converted);
    }, [listType]);

    // handle change on each input
    const handlePriceChange = (index: number, value: string) => {
        const newList = [...priceList];
        newList[index].price = value;
        setPriceList(newList);
    };

    const handleAddPrice = () => {
        const isInvalid = priceList.some(p => !p.price || parseFloat(p.price) <= 0);
        if (isInvalid) {
            alert("Please fill in all prices greater than 0.");
            return;
        }

        const finalList = priceList.map(p => ({
            type: p.type,
            price: parseFloat(p.price)
        }));

        onHandle(finalList); // ส่งข้อมูลไปตรงๆ
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent>
                <div className='w-[448px] py-2'>
                    <div className='text-center'>
                        <TitleHeader text='Add Ticket Price Type' />
                    </div>

                    <div className='flex mt-10 text-[#6B7280] bg-[#F9FAFB] text-[14px]'>
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
                                <p>{item.type}</p>
                            </div>
                            <div className='flex-1 py-4 flex justify-center'>
                                <div className='flex gap-3'>
                                    <input
                                        type="number"
                                        value={item.price}
                                        onChange={(e) => handlePriceChange(index, e.target.value)}
                                        className='custom-border-gray text-center rounded-md w-[100px]'
                                    />
                                    <p>THB</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className='flex justify-end gap-4 mt-5'>
                        <ButtonDefault text='Cancel' size='' onClick={onClose} />
                        <ButtonBG text='Add Price' size='' onClick={handleAddPrice} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}


export default TicketPriceFixed
