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
    listType: string[];
    setTicketTypePrice: (value: TicketTypePrice[]) => void;
    onClose: () => void
    onHandle: () => void
}

function TicketPriceFixed({ open, onClose, onHandle, listType, setTicketTypePrice }: TicketPriceFixedProps) {

    const [priceList, setPriceList] = useState<Record<string, number>>({});

    useEffect(() => {
        if (open) {
            // reset price list ทุกครั้งที่เปิด model
            const initialPriceList: Record<string, number> = {};
            listType.forEach(type => {
                initialPriceList[type] = 0;
            });
            setPriceList(initialPriceList);
        }
    }, [open, listType]);

    const handlePriceChange = (type: string, value: string) => {
        const num = parseFloat(value);
        setPriceList(prev => ({
            ...prev,
            [type]: isNaN(num) ? 0 : num
        }));
    };

    const handleAddPrice = () => {
        // เช็คก่อนว่ามีช่องไหนที่ยังไม่ได้กรอก หรือกรอก <= 0
        const isIncomplete = Object.values(priceList).some(price => price <= 0);

        if (isIncomplete) {
            alert("Please fill in all prices greater than 0.");
            return;
        }

        const priceArray: TicketTypePrice[] = Object.entries(priceList).map(([type, price]) => ({
            type,
            price
        }));

        setTicketTypePrice(priceArray);
        onHandle(); // callback ที่ฝั่ง page
        onClose(); // ปิด model
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

                    {listType.map((item, index) => (
                        <div key={index} className='flex text-[16px] border-b border-[#E5E7EB]'>
                            <div className='flex-1 py-4 text-center'>
                                <p>{item}</p>
                            </div>
                            <div className='flex-1 py-4 flex justify-center'>
                                <div className='flex gap-3'>
                                    <input
                                        type="number"
                                        value={priceList[item] || ''}
                                        onChange={(e) => handlePriceChange(item, e.target.value)}
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
    )
}

export default TicketPriceFixed
