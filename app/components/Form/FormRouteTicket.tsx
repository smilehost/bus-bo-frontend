import React from 'react'
import { useRouter } from 'next/navigation'

//component
import InputLabel from '@/app/components/Form/InputLabel'
import LabelText from '@/app/components/Form/LabelText'
import ButtonDefault from '@/app/components/Form/ButtonDefault'
import ButtonBG from '@/app/components/Form/ButtonBG'
import ColorRoute from '@/app/components/Form/ColorRoute'

import { TICKET_TYPE } from '@/constants/enum'

type FormRouteTicketProps = {
    ticketNameTH: string;
    setTicketNameTH: (value: string) => void;
    ticketNameEN: string;
    setTicketNameEN: (value: string) => void;
    ticketAmount: string;
    setTicketAmount: (value: string) => void;
    ticketColor: string;
    setTicketColor: React.Dispatch<React.SetStateAction<string>>;
    ticketType?: TICKET_TYPE;
    setTicketType: (value: TICKET_TYPE) => void;
    ticketCheckList: string[];
    setTicketCheckList: (value: string[]) => void;
    ticketTypeList: string[];
    setTicketTypeList: (value: string[]) => void;
    newType: string;
    setNewType: (value: string) => void;
    handleAddType: () => void;
    handleValidateNext: () => void;
};

function FormRouteTicket({
    ticketNameTH,
    setTicketNameTH,
    ticketNameEN,
    setTicketNameEN,
    ticketAmount,
    setTicketAmount,
    ticketColor,
    setTicketColor,
    ticketType,
    setTicketType,
    ticketCheckList,
    setTicketCheckList,
    ticketTypeList,
    newType,
    setNewType,
    handleAddType,
    handleValidateNext,
}: FormRouteTicketProps) {
    const router = useRouter();
    return (
        <>
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
                                                <input
                                                    type="checkbox"
                                                    className='cursor-pointer'
                                                    checked={ticketCheckList.includes(item)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setTicketCheckList([...ticketCheckList, item]);
                                                        } else {
                                                            setTicketCheckList(ticketCheckList.filter(i => i !== item));
                                                        }
                                                    }}
                                                />
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
                            <div className='flex-2 '>
                                <InputLabel
                                    label="Ticket Amount"
                                    placeholder="Enter ticket amount"
                                    size="max-w-[500px]"
                                    type="text"
                                    setValue={setTicketAmount}
                                    value={ticketAmount}
                                />
                            </div>
                            <div className='flex-1 '>
                                <ColorRoute color={ticketColor} setRouteColor={setTicketColor} label='Ticket Color' size_circle='w-[38px] h-[38px]' size_input='w-full' />
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* button */}
            <div className='mt-10 flex justify-end gap-2'>
                <ButtonDefault size='' text='Back' onClick={() => router.back()} />
                <ButtonBG size='' text='Next' onClick={handleValidateNext} />
            </div>

        </>
    )
}

export default FormRouteTicket
