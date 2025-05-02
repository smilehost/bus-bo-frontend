"use client"

import React, { useEffect, useState } from 'react'

//component
import TitleHeader from '@/app/components/Title/TitleHeader'
import FormRouteTicket from '@/app/components/Form/FormRouteTicket'
import TicketPriceFixed from '@/app/components/Form/TicketPriceFixed'
import TierdPriceTable from '@/app/components/Table/TierdPriceTable'
import ButtonBG from '@/app/components/Form/ButtonBG'
import ButtonDefault from '@/app/components/Form/ButtonDefault'

//const 
import { TICKET_TYPE } from '@/constants/enum'
import { useParams } from 'next/navigation'

//mock
import { useTicketStore } from '@/stores/ticketStore'
import { useRouteStore } from '@/stores/routeStore'
import { useTicketPriceStore } from '@/stores/ticketPriceTypeStore'
import { useUserStore } from '@/stores/userStore'

//type 
import { TicketProps, TicketPriceType } from '@/types/types'
import { Route } from '@/types/types'

//icon
import { Bolt, Table } from "lucide-react";

//mui
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Typography from '@mui/material/Typography';

export type TicketPriceTypeFixed = {
  id_type: string,
  price: number
}

function Page() {

  const { updateTicket, addTicket, getTicketByRouteId, getTicketById } = useTicketStore();
  const { getRouteById } = useRouteStore();
  const { getTypeTicketByCompanyId } = useTicketPriceStore();
  const { userData } = useUserStore()

  const params = useParams();

  // useEffect(() => {
  //     handleTestApi();
  // }, [])

  // const [testApi, setTestApi] = useState();
  // const handleTestApi = async () => {
  //     try {
  //         const response = await axios.get("http://94.237.73.171:8000/api/ticket/priceType", {
  //             headers: {
  //                 com_id: `1`
  //             }
  //         });

  //         setTestApi(response.data)

  //     } catch (error) {
  //         console.error("API Error:", error);
  //     }
  // };
  // console.log("testApi: ", testApi)

  //velues
  const [routeActive, setRouteActive] = useState<Route>();

  const [tickets, setTickets] = useState<TicketProps[]>();
  const [ticketActive, setTicketActive] = useState<string>();
  const [ticketNameTH, setTicketNameTH] = useState<string>('');
  const [ticketNameEN, setTicketNameEN] = useState<string>('');
  const [ticketAmount, setTicketAmount] = useState<string>('');
  const [ticketColor, setTicketColor] = useState<string>('');
  const [ticketType, setTicketType] = useState<TICKET_TYPE>();
  const [ticketPriceFixed, setTicketPriceFixed] = useState<TicketPriceTypeFixed[]>([])
  const [ticketChecked, setTicketChecked] = useState<string[]>([])
  const [ticketTypeList, setTicketTypeList] = useState<TicketPriceType[]>([]);

  //Default Ticket
  useEffect(() => {
    const routeId = params?.id?.toString() || ''
    const com_id = userData.company_id

    const ticketData = getTicketByRouteId(routeId)
    const routeData = getRouteById(routeId)
    const priceTypeTemp = getTypeTicketByCompanyId(com_id)

    setTickets(ticketData)
    setRouteActive(routeData)
    setTicketTypeList(priceTypeTemp)

  }, [params, getRouteById, getTicketByRouteId])

  //active ticket
  useEffect(() => {
    const ticketId = ticketActive || ''
    const ticket = getTicketById(ticketId);

    //find price type checked
    const ticketChecked = Array.from(new Set(
      ticket?.ticket_price
        ?.filter((item) =>
          ticketTypeList.some((type) => type.id === item.ticket_price_type_id)
        )
        .map(item => item.ticket_price_type_id)
    ));

    setTicketChecked(ticketChecked)

    if (!ticketId) {
      setTicketNameTH("")
      setTicketNameEN("")
      setTicketAmount("")
      setTicketColor("")
      setTicketType(undefined)
    }

    if (!ticket) return;
    setTicketNameTH(ticket?.ticketName_th)
    setTicketNameEN(ticket?.ticketName_en)
    setTicketAmount(ticket?.ticket_amount)
    setTicketColor(ticket?.ticket_color)
    setTicketType(ticket?.ticket_type)

  }, [ticketActive])

  const [newType, setNewType] = useState("");

  const handleAddType = () => {
    if (!newType) {
      return;
    }
    setNewType('')
  };

  //Form steps
  const [activeStep, setActiveStep] = React.useState(0);

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleValidateNext = () => {
    if (!ticketNameTH || !ticketNameEN || !ticketAmount || !ticketColor || !ticketType || ticketChecked.length <= 0) {
      alert("กรอกไม่ครบ")
      return;
    }

    if (ticketType === TICKET_TYPE.FIXED) {
      const tempTicketPriceFixed = ticketChecked.map((id_type) => ({
        id_type: id_type,
        price: 0
      }));
      setTicketPriceFixed(tempTicketPriceFixed);
    }

    if (ticketType === TICKET_TYPE.TIERED) {

    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  const handleSubmit = () => {

    if (!ticketType || !params.id) return;

    const tempId = ticketActive || "123"
    const tempTicket = {
      id: tempId,
      ticketName_th: ticketNameTH,
      ticketName_en: ticketNameEN,
      ticket_type: ticketType,
      ticket_amount: ticketAmount,
      ticket_color: ticketColor,
      ticket_price_fixed: ticketPriceFixed,
      ticket_price: [],
      route_id: params.id.toString()
    }
    if (ticketActive) {
      updateTicket(ticketActive, tempTicket)
    } else {
      addTicket(tempTicket)
      setTicketActive(tempId);
    }

    console.log("Submit ticket data");
  };

  // console.log("ticket: ", tickets)
  // console.log("routeActive: ", routeActive)

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
                  if (activeStep > 0) return;
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
        <Box sx={{}}>
          <Stepper activeStep={activeStep} orientation="vertical">
            <Step className=''>
              <StepLabel
                optional={
                  <Typography variant="caption">
                    {ticketActive ? (
                      <>{ticketActive} - Edit</>
                    ) : (
                      <>Ticket - Create</>
                    )}
                  </Typography>
                }
                sx={{
                  '.MuiStepIcon-root': {
                    color: '#F97316 !important',
                  },
                  '&.Mui-completed .MuiStepIcon-root': {
                    color: '#F97316 !important', // สีเมื่อ completed
                  },
                  '&.Mui-active .MuiStepIcon-root': {
                    color: '#F97316 !important', // สีเมื่อ active
                  },
                }}
              >
              </StepLabel>
              <StepContent className='pt-5'>
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
                  ticketChecked={ticketChecked}
                  setTicketChecked={setTicketChecked}
                  ticketTypeList={ticketTypeList}
                  setTicketTypeList={setTicketTypeList}
                  isEditMode={ticketActive ? true : false}
                />
              </StepContent>
            </Step>
            <Step className=''>
              <StepLabel
                optional={
                  <Typography variant="caption">
                    {ticketActive ? (
                      <>{ticketActive} - Manage Price</>
                    ) : (
                      <>Ticket - Manage Price</>
                    )}
                  </Typography>
                }

                sx={{
                  '.MuiStepIcon-root': {
                    color: '#F97316 !important',
                  },
                  '&.Mui-completed .MuiStepIcon-root': {
                    color: '#F97316 !important', // สีเมื่อ completed
                  },
                  '&.Mui-active .MuiStepIcon-root': {
                    color: '#F97316 !important', // สีเมื่อ active
                  },
                }}
              >
              </StepLabel>
              <StepContent className='pt-5'>
                {ticketType === TICKET_TYPE.TIERED ? (
                  <>
                    <TierdPriceTable />
                    <div className='flex gap-3 mt-8 justify-end'>
                      <ButtonDefault text="Back" size='' onClick={handleBack} />
                      <ButtonBG text="Confirm" size='' />
                    </div>
                  </>
                ) : ticketType === TICKET_TYPE.FIXED && (
                  <>
                    <TicketPriceFixed listType={ticketPriceFixed} setTicketTypePrice={setTicketPriceFixed} />
                    <div className='flex gap-3 mt-8 justify-end'>
                      <ButtonDefault text="Back" size='' onClick={handleBack} />
                      <ButtonBG text="Confirm" size='' onClick={handleSubmit} />
                    </div>
                  </>
                )}

              </StepContent>
            </Step>
          </Stepper>
        </Box>

      </div>
      {/* <TicketPriceFixed open={ModelOpen} onClose={handleCloseModel} listType={ticketTypePrice} onHandle={handleSubmit} setTicketTypePrice={setTicketTypePrice} /> */}

    </div>

  )
}

export default Page
