"use client"

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
//component
import TitleHeader from '@/app/components/Title/TitleHeader'
import FormRouteTicket from '@/app/components/Form/FormRouteTicket'
import TicketPriceFixed from '@/app/components/Model/TicketPriceFixed'

//const 
import { TICKET_TYPE } from '@/constants/enum'
import { useRouter, useParams } from 'next/navigation'

//mock
import { useTicketStore } from '@/stores/ticketStore'

//type 
import { TicketProps } from '@/types/types'

export type TicketTypePrice = {
    type: string,
    price: number
}

function Page() {

    const { ticketData } = useTicketStore();
    const router = useRouter();
    const pathname = usePathname();

    const params = useParams();

    //velues
    const [tickets, setTickets] = useState<TicketProps[]>();
    const [ticketNameTH, setTicketNameTH] = useState<string>('');
    const [ticketNameEN, setTicketNameEN] = useState<string>('');
    const [ticketAmount, setTicketAmount] = useState<string>('');
    const [ticketColor, setTicketColor] = useState<string>('#3B82F6');
    const [ticketType, setTicketType] = useState<TICKET_TYPE>();
    const [ticketTypePrice, setTicketTypePrice] = useState<TicketTypePrice[]>([])
    const [ticketCheckList, setTicketCheckList] = useState<string[]>([])
    const [ticketTypeList, setTicketTypeList] = useState<string[]>([
        "Normal", "Student"
    ]);

    //Default Ticket
    useEffect(() => {
        if (params?.id !== undefined) {
            const foundValue = ticketData.filter((value) => value.route_id === params?.id);
            if (foundValue) {
                setTickets(foundValue);
            }
        }
    }, [params, ticketData])

    const [newType, setNewType] = useState("");

    const handleAddType = () => {
        const trimmed = newType.trim();
        if (trimmed && !ticketTypeList.includes(trimmed)) {
            setTicketTypeList([...ticketTypeList, trimmed]);
            setNewType("");
        }
    };

    const handleValidateNext = () => {
        if (!ticketNameTH || !ticketNameEN || !ticketAmount || !ticketColor || !ticketType || ticketCheckList.length <= 0) {
            alert("กรอกไม่ครบ")
            return;
        }

        if (ticketType === TICKET_TYPE.FIXED) {
            handleOpenModel();
            return;
        }

        if (ticketType === TICKET_TYPE.TIERED) {
            router.push(`${pathname}/tiered`)
            return;
        }

    }

    const handleSubmit = () => {
        console.log("Submit ticket data")
        console.log("ticketNameTH:", ticketNameTH)
        console.log("ticketNameEN:", ticketNameEN)
        console.log("ticketAmount:", ticketAmount)
        console.log("ticketColor:", ticketColor)
        console.log("ticketType:", ticketType)
        console.log("ticketTypePrice:", ticketTypePrice)
    }

    //handle ticket fixed price model
    const [ModelOpen, setModelOpen] = useState(false)
    const handleOpenModel = () => setModelOpen(true)
    const handleCloseModel = () => setModelOpen(false)

    return (
        <div>
            <TitleHeader text={"Add New Route Ticket"} />
            {tickets && tickets.length > 0 && (
                <div className='mt-4'>
                    <p className='font-medium'>Tickets</p>
                    <div className='flex gap-4 mt-1'>
                        {tickets.map((item, index) => (
                            <div key={index} className='shadow-xs px-7 rounded-md text-center bg-white relative overflow-hidden'>
                                <div className={` w-[8px] h-full absolute left-0`}
                                    style={{
                                        backgroundColor: item.ticket_color
                                    }}
                                />
                                <p className='text-[14px] py-1'>{item.id}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className='p-5 custom-frame-content'>
                <FormRouteTicket
                    ticketNameTH={ticketNameTH}
                    setTicketNameTH={setTicketNameTH}
                    ticketNameEN={ticketNameEN}
                    setTicketNameEN={setTicketNameEN}
                    ticketAmount={ticketAmount}
                    setTicketAmount={setTicketAmount}
                    ticketColor={ticketColor}
                    setTicketColor={setTicketColor}
                    ticketType={ticketType}
                    setTicketType={setTicketType}
                    ticketCheckList={ticketCheckList}
                    setTicketCheckList={setTicketCheckList}
                    ticketTypeList={ticketTypeList}
                    setTicketTypeList={setTicketTypeList}
                    newType={newType}
                    setNewType={setNewType}
                    handleAddType={handleAddType}
                    handleValidateNext={handleValidateNext}
                />
            </div>
            <TicketPriceFixed open={ModelOpen} onClose={handleCloseModel} listType={ticketCheckList} onHandle={handleSubmit} setTicketTypePrice={setTicketTypePrice} />

        </div>

    )
}

export default Page
