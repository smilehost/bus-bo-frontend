"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

//component
import TitleHeader from '@/app/components/Title/TitleHeader'
import InputLabel from '@/app/components/Form/InputLabel'
import LabelText from '@/app/components/Form/LabelText'
import ButtonDefault from '@/app/components/Form/ButtonDefault'
import ButtonBG from '@/app/components/Form/ButtonBG'

//const 
import { TICKET_TYPE } from '@/constants/enum'

function Page() {

    //router
    const router = useRouter();

    //velues
    const [ticketNameTH, setTicketNameTH] = useState<string>();
    const [ticketNameEN, setTicketNameEN] = useState<string>();
    const [ticketAmount, setTicketAmount] = useState<string>();
    const [ticketType, setTicketType] = useState<TICKET_TYPE>();
    const [ticketTypeList, setTicketTypeList] = useState<string[]>([
        "Normal", "Student"
    ]);

    const [newType, setNewType] = useState("");

    const handleAddType = () => {
        const trimmed = newType.trim();
        if (trimmed && !ticketTypeList.includes(trimmed)) {
            setTicketTypeList([...ticketTypeList, trimmed]);
            setNewType("");
        }
    };

    return (
        <div>
            <TitleHeader text={"Add New Route Ticket"} />
            <div className='p-5 custom-frame-content'>

                {/* form */}
                <div className='flex gap-x-3 gap-y-4 flex-wrap'>
                    <div className='flex w-full gap-3'>
                        <div className="flex-1">
                            <InputLabel
                                label="Ticket Route Name (Thai)"
                                placeholder="e.g. Khon Kaen - Korat"
                                size="max-w-[500px]"
                                type="text"
                                setValue={setTicketNameTH}
                                value={ticketNameTH}
                            />
                        </div>
                        <div className="flex-1">
                            <InputLabel
                                label="Ticket Name (English)"
                                placeholder="e.g. Khon Kaen - Korat"
                                size="max-w-[500px]"
                                type="text"
                                setValue={setTicketNameEN} // เปลี่ยนให้ใช้ setValue ที่ถูกต้อง
                                value={ticketNameEN} // เปลี่ยนให้ใช้ value ที่ถูกต้อง
                            />
                        </div>
                    </div>
                    <div className='flex gap-3 w-full'>
                        <div className='flex-1 flex flex-col gap-2'>
                            <div className='flex flex-col gap-2'>
                                <LabelText text={"Ticket Type"} />
                                <div className='flex gap-3'>
                                    <ButtonDefault text={"Fixed Price"} size={`flex-1 max-w-[244px] h-[38px] ${ticketType === TICKET_TYPE.FIXED && "custom-bg-main"}`} onClick={() => setTicketType(TICKET_TYPE.FIXED)} />
                                    <ButtonDefault text={"Tiered Price"} size={`flex-1 max-w-[244px] h-[38px] ${ticketType === TICKET_TYPE.TIERED && "custom-bg-main"}`} onClick={() => setTicketType(TICKET_TYPE.TIERED)} />
                                </div>
                            </div>
                            {ticketType && (
                                <div className='flex flex-col gap-2 mt-3'>
                                    <LabelText text="Ticket Price Type" />
                                    <div className='custom-border-gray rounded-md p-3'>
                                        <div className='flex flex-col gap-1'>
                                            {ticketTypeList.map((item, index) => (
                                                <div key={index} className='flex items-center gap-2'>
                                                    <input type="checkbox" className='cursor-pointer' />
                                                    <p className='text-[14px]'>{item}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className='h-[25px] flex gap-2 mt-3'>
                                            <input
                                                type="text"
                                                className='h-full custom-border-gray rounded-md text-center text-[12px]'
                                                placeholder='Add new type...'
                                                value={newType}
                                                onChange={(e) => setNewType(e.target.value)}
                                            />
                                            <ButtonBG size='h-full' text='Add' onClick={handleAddType} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className='flex-1'>
                            <div className='flex gap-3 max-w-[500px]'>
                                <div className='flex-2'>
                                    <InputLabel
                                        label="Ticket Amount"
                                        placeholder="Enter ticket amount"
                                        size="max-w-[500px]"
                                        type="text"
                                        setValue={setTicketAmount} 
                                        value={ticketAmount} 
                                    />
                                </div>
                                <div className='flex-1 flex flex-col gap-1 w-full'>
                                    <LabelText text={"Ticket Color"} />
                                    <div className='flex gap-2 mt-1'>
                                        <div
                                            style={{ backgroundColor: "#3B82F6" }}
                                            className="w-[38px] h-[38px] rounded-full flex-shrink-0 custom-border-gray"
                                        />
                                        <div
                                            style={{ backgroundColor: "#3B82F6" }}
                                            className="h-[38px] w-full max-w-[140px] rounded-md custom-border-gray flex justify-center items-center"
                                        >
                                            <p className='text-[12px]'>#3B82F6</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* button */}
                <div className='mt-10 flex justify-end gap-2'>
                    <ButtonDefault size='' text='Back' onClick={() => router.back()} />
                    <ButtonBG size='' text='Next' />
                </div>
            </div>
        </div>
    )
}

export default Page
