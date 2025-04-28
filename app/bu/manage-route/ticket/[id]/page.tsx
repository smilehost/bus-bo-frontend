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

//icon
import { Bolt, Table } from "lucide-react";

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
    const [ticketActive, setTicketActive] = useState<string>();

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

    useEffect(() => {
        const ticket = ticketData.find((item) => item.id === ticketActive);


        if (ticketActive === undefined) {
            setTicketNameTH("")
            setTicketNameEN("")
            setTicketAmount("")
            setTicketColor("")
            setTicketType(undefined)
            setTicketTypePrice([])
            setTicketCheckList([]);
            setTicketTypeList([]);
        }

        if (!ticket) return;

        const ticketListName = ticket?.ticket_list.map((item) => item.type)
        setTicketNameTH(ticket?.ticketName_th)
        setTicketNameEN(ticket?.ticketName_en)
        setTicketAmount(ticket?.ticket_amount)
        setTicketColor(ticket?.ticket_color)
        setTicketType(ticket?.ticket_type)
        setTicketTypePrice(ticket?.ticket_list)
        setTicketCheckList(ticketListName);
        setTicketTypeList(ticketListName);


    }, [ticketActive])

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
                            <div key={index}
                                className={`${ticketActive === item.id ? "bg-gray-200" : "bg-white"} w-[200px] cursor-pointer shadow-xs px-7 rounded-md relative overflow-hidden`}
                                onClick={() => {
                                    if (ticketActive === item.id) {
                                        setTicketActive(undefined); // ถ้าคลิกตัวเดิม ซ้ำ → ล้างค่า
                                    } else {
                                        setTicketActive(item.id); // ถ้าไม่ใช่ → set เป็น id นั้น
                                    }
                                }}
                            >
                                <div className={` w-[8px] h-full absolute left-0`}
                                    style={{
                                        backgroundColor: item.ticket_color
                                    }}
                                />
                                <div className='flex flex-col gap-1 py-2'>
                                    <p className='text-[12px] whitespace-nowrap text-ellipsis overflow-hidden'>{item.ticketName_th}</p>
                                    <p className='text-[12px] whitespace-nowrap text-ellipsis overflow-hidden'>{item.ticketName_en}</p>
                                </div>
                                {item.ticket_type === TICKET_TYPE.FIXED ? (
                                    <Bolt size={16} className="text-gray-500 absolute top-0 right-0 m-2" />
                                ) : (item.ticket_type === TICKET_TYPE.TIERED) && (
                                    <Table size={16} className="text-gray-500 absolute top-0 right-0 m-2" />
                                )}
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
