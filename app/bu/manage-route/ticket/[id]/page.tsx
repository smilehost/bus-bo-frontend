"use client"

import React, { useEffect, useState } from 'react'

//component
import TitleHeader from '@/app/components/Title/TitleHeader'
import FormRouteTicket from '@/app/components/Form/FormRouteTicket'
import TicketPriceFixed from '@/app/components/Form/TicketPriceFixed'
import TierdPriceTable from '@/app/components/Table/TierdPriceTable'
import ButtonBG from '@/app/components/Form/ButtonBG'
import ButtonDefault from '@/app/components/Form/ButtonDefault'
import TextError from '@/app/components/TextError'

//const 
import { TICKET_TYPE } from '@/constants/enum'
import { useParams } from 'next/navigation'

//mock
import { useTicketStore } from '@/stores/ticketStore'
import { useRouteStore } from '@/stores/routeStore'
import { useTicketPriceStore } from '@/stores/ticketPriceTypeStore'
import { useUserStore } from '@/stores/userStore'

//type 
import { TicketProps, TicketPriceType, TicketRoutePrice } from '@/types/types'
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
  name: string,
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
  const [error, setError] = useState<string>('');

  const [routeActive, setRouteActive] = useState<Route>();
  const [tickets, setTickets] = useState<TicketProps[]>();
  const [ticketActive, setTicketActive] = useState<string>();
  const [ticketNameTH, setTicketNameTH] = useState<string>('');
  const [ticketNameEN, setTicketNameEN] = useState<string>('');
  const [ticketAmount, setTicketAmount] = useState<string>('');
  const [ticketColor, setTicketColor] = useState<string>('');
  const [ticketType, setTicketType] = useState<TICKET_TYPE>();
  const [ticketPriceFixed, setTicketPriceFixed] = useState<TicketPriceTypeFixed[]>([])
  const [ticketPriceList, setTicketPriceList] = useState<TicketRoutePrice[]>([])
  const [ticketPrice, setTicketPrice] = useState<TicketRoutePrice[]>()
  const [ticketChecked, setTicketChecked] = useState<string[]>([])
  const [ticketTypeList, setTicketTypeList] = useState<TicketPriceType[]>([]);

  //get tickets 
  const routeId = params?.id?.toString() || ''
  const com_id = userData.company_id

  const getTickets = () => {
    const ticketData = getTicketByRouteId(routeId)
    setTickets(ticketData)
  }

  //Default Ticket
  useEffect(() => {
    const routeData = getRouteById(routeId)
    const priceTypeTemp = getTypeTicketByCompanyId(com_id)

    getTickets()
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
      setTicketPriceList([])
    }

    if (!ticket) return;
    setTicketNameTH(ticket?.ticketName_th)
    setTicketNameEN(ticket?.ticketName_en)
    setTicketAmount(ticket?.ticket_amount)
    setTicketColor(ticket?.ticket_color)
    setTicketType(ticket?.ticket_type)
    setTicketPriceList(ticket?.ticket_price)

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

  //validate click next
  const handleValidateNext = () => {
    if (!ticketNameTH || !ticketNameEN || !ticketAmount || !ticketColor || !ticketType || ticketChecked.length <= 0) {
      setError("Please fill in completely.")
      return;
    }

    setError('')

    //Fixed Price
    if (ticketType === TICKET_TYPE.FIXED) {
      const tempTicketPriceFixed = ticketChecked.map((id_type) => ({
        id_type: id_type,
        name: ticketTypeList.find((item) => item.id === id_type)?.name || '',
        price: tickets?.find((ticket) => ticket.id === ticketActive)?.ticket_price?.find((tp) => tp.ticket_price_type_id === id_type)?.price || 0
      }));

      setTicketPriceFixed(tempTicketPriceFixed);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  //submit
  const handleSubmit = () => {

    if (!ticketType || !params.id) return;

    //Fixed Price
    let tempTicketPrice: TicketRoutePrice[] = ticketPriceList;
    if (ticketType === TICKET_TYPE.FIXED) {
      const stations = routeActive?.stations
      if (ticketType === TICKET_TYPE.FIXED && stations && ticketPriceFixed.length > 0) {
        const ticketPrices: TicketRoutePrice[] = [];

        let idCounter = 1;
        for (let i = 0; i < stations.length - 1; i++) {
          for (let j = i + 1; j < stations.length; j++) {
            const from = stations[i];
            const to = stations[j];

            // สร้างรายการราคาทุกประเภท
            ticketPriceFixed.forEach((type) => {
              ticketPrices.push({
                id: idCounter.toString(),
                from: from,
                to: to,
                price: type.price,
                ticket_price_type_id: type.id_type
              });
              idCounter++;
            });
          }
        }
        tempTicketPrice = ticketPrices;
      }
    }

    //Tiered Price
    if (ticketType === TICKET_TYPE.TIERED) {

    }

    const isValidTicketPrice = tempTicketPrice.every(tp => tp.price && tp.price > 0) && tempTicketPrice.length > 0;

    const isValidTicketPriceType = ticketChecked.every((tikketTypeId) => ticketPriceList.some((ticket) => ticket.ticket_price_type_id === tikketTypeId))

    if (!isValidTicketPrice || !isValidTicketPriceType) {
      setError("Please fill in completely.");
      return;
    }

    setError('')

    const tempId = ticketActive || ''
    const tempTicket = {
      id: tempId,
      ticketName_th: ticketNameTH,
      ticketName_en: ticketNameEN,
      ticket_type: ticketType,
      ticket_amount: ticketAmount,
      ticket_color: ticketColor,
      ticket_price: tempTicketPrice,
      route_id: params.id.toString()
    }
    if (ticketActive) {
      updateTicket(ticketActive, tempTicket)
    } else {
      addTicket(tempTicket)
      setTicketActive(tempId);
    }

    getTickets()

    console.log("Submit ticket data");
    console.log(tempTicket)
  };

  //update and create TicketPriceList
  const updateTicketPriceList = () => {
    const updatedList = [...ticketPriceList];

    ticketPrice?.forEach((newItem) => {
      const index = updatedList.findIndex(
        (oldItem) =>
          oldItem.from === newItem.from &&
          oldItem.to === newItem.to &&
          oldItem.ticket_price_type_id === newItem.ticket_price_type_id
      );

      if (index !== -1) {
        // 🔁 อัปเดตข้อมูลที่มีอยู่
        updatedList[index] = {
          ...updatedList[index],
          ...newItem,
        };
      } else {
        // ➕ เพิ่มใหม่
        updatedList.push({
          ...newItem,
          id: '', // หรือปล่อย undefined ถ้าคุณไม่ต้องการตั้ง id ตอนนี้
        });
      }
    });

    setTicketPriceList(updatedList);
  };

  useEffect(() => {
    updateTicketPriceList();

  }, [ticketPrice])

  // console.log("ticket: ", tickets)
  // console.log("routeActive: ", routeActive)

  return (
    <div>
      <TitleHeader text={"Add New Route Ticket"} />
      {tickets && tickets.length > 0 && (
        <div className='mt-4'>
          <p className='font-medium'>Tickets</p>
          <div className='flex flex-wrap gap-4 mt-1'>
            {tickets.map((item, index) => (
              <div key={index}
                className={`${ticketActive === item.id ? "bg-gray-200" : "bg-white"} w-[200px] cursor-pointer shadow-xs px-7 rounded-md relative overflow-hidden`}
                onClick={() => {
                  if (activeStep > 0) return;
                  if (ticketActive === item.id) {
                    setTicketActive(undefined);
                    setError('')
                  } else {
                    setTicketActive(item.id);
                    setError('')
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
                  error={error}
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
                    <div className='flex flex-col gap-8'>
                      {ticketChecked.map((ticketTypeId, index) => {
                        const ticketPriceByTicketTypePriceId = ticketPriceList.filter((item) => item.ticket_price_type_id === ticketTypeId)
                        return (
                          <React.Fragment key={index}>
                            <TierdPriceTable
                              ticketPrice={ticketPriceByTicketTypePriceId}
                              setTicketPrice={setTicketPrice}
                              stations={routeActive?.stations || []}
                              ticketTypePriceName={ticketTypeList.find((item) => item.id === ticketTypeId)?.name || 'Ticket Price Type'}
                              ticketTypePriceId={ticketTypeId}
                            />
                            <hr className='custom-border-gray ' />
                          </React.Fragment >
                        )
                      })}
                    </div>
                    <div className='flex flex-col items-end mt-10'>
                      {error && (
                        <TextError text={error} />
                      )}
                      <div className='flex gap-3 mt-3'>
                        <ButtonDefault text="Back" size='' onClick={handleBack} />
                        <ButtonBG text="Confirm" size='' onClick={handleSubmit} />
                      </div>
                    </div>
                  </>
                ) : ticketType === TICKET_TYPE.FIXED && (
                  <>
                    <div className='flex flex-col gap-8'>
                      <TicketPriceFixed listType={ticketPriceFixed} setTicketTypePrice={setTicketPriceFixed} />
                    </div>
                    <div className='flex flex-col items-end mt-10'>
                      {error && (
                        <TextError text={error} />
                      )}
                      <div className='flex gap-3 mt-3'>
                        <ButtonDefault text="Back" size='' onClick={handleBack} />
                        <ButtonBG text="Confirm" size='' onClick={handleSubmit} />
                      </div>
                    </div>
                  </>
                )}
              </StepContent>
            </Step>
          </Stepper>
        </Box>

      </div>
    </div>

  )
}

export default Page
