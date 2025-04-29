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

//mui
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export type TicketTypePrice = {
    type: string,
    price: number,
}

function Page() {

    const { ticketData, updateTicket, addTicket } = useTicketStore();

    const router = useRouter();
    const pathname = usePathname();

    const params = useParams();

    //velues
    const [tickets, setTickets] = useState<TicketProps[]>();
    const [ticketActive, setTicketActive] = useState<string>();

    const [ticketNameTH, setTicketNameTH] = useState<string>('');
    const [ticketNameEN, setTicketNameEN] = useState<string>('');
    const [ticketAmount, setTicketAmount] = useState<string>('');
    const [ticketColor, setTicketColor] = useState<string>('');
    const [ticketType, setTicketType] = useState<TICKET_TYPE>();
    const [ticketTypePrice, setTicketTypePrice] = useState<TicketTypePrice[]>([])
    const [ticketTypeList, setTicketTypeList] = useState<TicketTypePrice[]>([
        {
            type: "Normal",
            price: 0,
        },
        {
            type: "Student",
            price: 0
        }
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
        }

        if (!ticket) return;

        setTicketNameTH(ticket?.ticketName_th)
        setTicketNameEN(ticket?.ticketName_en)
        setTicketAmount(ticket?.ticket_amount)
        setTicketColor(ticket?.ticket_color)
        setTicketType(ticket?.ticket_type)
        setTicketTypePrice(ticket?.ticket_list)
        setTicketTypeList(ticket?.ticket_list);

    }, [ticketActive])


    const [newType, setNewType] = useState("");

    const handleAddType = () => {
        if (!newType) {
            return;
        }
        setTicketTypeList([
            ...ticketTypeList,
            {
                type: newType,
                price: 0
            }
        ])
        setNewType('')
    };

    const handleValidateNext = () => {
        if (!ticketNameTH || !ticketNameEN || !ticketAmount || !ticketColor || !ticketType || ticketTypePrice.length <= 0) {
            alert("กรอกไม่ครบ")
            return;
        }

        if (ticketType === TICKET_TYPE.FIXED) {
            if (ticketTypePrice.length <= 0) return;
            handleOpenModel();
            return;
        }

        if (ticketType === TICKET_TYPE.TIERED) {
            if (ticketActive) {
                router.push(`${pathname}/tiered/${ticketActive}`)
            } else {
                router.push(`${pathname}/tiered/create`)
            }
            return;
        }

    }

    const handleSubmit = (prices: TicketTypePrice[]) => {
        setTicketTypePrice(prices); // หรือจะใช้ในที่อื่นเลยก็ได้

        if (!ticketType || !params.id) return;

        const tempId = ticketActive || "123"
        const tempTicket = {
            id: tempId,
            ticketName_th: ticketNameTH,
            ticketName_en: ticketNameEN,
            ticket_type: ticketType,
            ticket_amount: ticketAmount,
            ticket_color: ticketColor,
            ticket_list: prices,
            route_id: params.id.toString()
        }
        if (ticketActive) {
            updateTicket(ticketActive, tempTicket)
        } else {
            addTicket(tempTicket)
            setTicketActive(tempId);
        }

        console.log("Submit ticket data");
        console.log("ticketTypePrice:", prices); // ใช้ข้อมูลที่ทันสมัย
    };

    //handle ticket fixed price model
    const [ModelOpen, setModelOpen] = useState(false)
    const handleOpenModel = () => setModelOpen(true)
    const handleCloseModel = () => setModelOpen(false)

    //form steps
    const steps = [
        {
            label: 'Select campaign settings',
            description: `For each ad campaign that you create, you can control how much
                    you're willing to spend on clicks and conversions, which networks
                    and geographical locations you want your ads to show on, and more.`,
        },
        {
            label: 'Create an ad group',
            description:
                'An ad group contains one or more ads which target a shared set of keywords.',
        },
        {
            label: 'Create an ad',
            description: `Try out different ad text to see what brings in the most customers,
                    and learn how to enhance your ads using features like ad extensions.
                    If you run into any problems with your ads, find out how to tell if
                    they're running and how to resolve approval issues.`,
        },
    ];

    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

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
                                        setTicketActive(undefined);
                                    } else {
                                        setTicketActive(item.id);
                                    }
                                }}
                            >
                                <div className={` w-[8px] h-full absolute left-0`}
                                    style={{
                                        backgroundColor: item.ticket_color
                                    }}
                                />
                                <div className='flex flex-col gap-1 py-2'>
                                    <p className='text-[12px] custom-ellipsis-style'>{item.ticketName_th}</p>
                                    <p className='text-[12px] custom-ellipsis-style'>{item.ticketName_en}</p>
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
                <Box sx={{ maxWidth: 400 }}>
                    <Stepper activeStep={activeStep} orientation="vertical">
                        {steps.map((step, index) => (
                            <Step key={step.label}>
                                <StepLabel
                                    optional={
                                        index === steps.length - 1 ? (
                                            <Typography variant="caption">Last step</Typography>
                                        ) : null
                                    }
                                >
                                    {step.label}
                                </StepLabel>
                                <StepContent>
                                    <Typography>{step.description}</Typography>
                                    <Box sx={{ mb: 2 }}>
                                        <Button
                                            variant="contained"
                                            onClick={handleNext}
                                            sx={{ mt: 1, mr: 1 }}
                                        >
                                            {index === steps.length - 1 ? 'Finish' : 'Continue'}
                                        </Button>
                                        <Button
                                            disabled={index === 0}
                                            onClick={handleBack}
                                            sx={{ mt: 1, mr: 1 }}
                                        >
                                            Back
                                        </Button>
                                    </Box>
                                </StepContent>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length && (
                        <Paper square elevation={0} sx={{ p: 3 }}>
                            <Typography>All steps completed - you&apos;re finished</Typography>
                            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                                Reset
                            </Button>
                        </Paper>
                    )}
                </Box>
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
                    newType={newType}
                    setNewType={setNewType}
                    handleAddType={handleAddType}
                    handleValidateNext={handleValidateNext}
                    ticketTypePrice={ticketTypePrice}
                    setTicketTypePrice={setTicketTypePrice}
                    ticketTypeList={ticketTypeList}
                    setTicketTypeList={setTicketTypeList}
                    isEditMode={ticketActive ? true : false}
                />
            </div>
            <TicketPriceFixed open={ModelOpen} onClose={handleCloseModel} listType={ticketTypePrice} onHandle={handleSubmit} setTicketTypePrice={setTicketTypePrice} />

        </div>

    )
}

export default Page
