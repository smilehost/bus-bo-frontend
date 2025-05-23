"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

//component
import FormRouteTicketInformation from '@/app/components/Form/FormRouteTicketInformation'
import TicketPriceFixed from '@/app/components/Form/TicketPriceFixed'
import TierdPriceTable from '@/app/components/Table/TierdPriceTable'
import ButtonBG from '@/app/components/Form/ButtonBG'
import ButtonDefault from '@/app/components/Form/ButtonDefault'
import TextError from '@/app/components/TextError'
import TicketBox from '../Box/TicketBox'

//const 
import { TICKET_TYPE } from '@/constants/enum'

//stores
import { useTicketStore } from '@/stores/routeTicketStore'
import { useRouteStore } from '@/stores/routeStore'
import { useTicketPriceTypeStore } from '@/stores/routeTicketPriceTypeStore'

//type 
import { TicketProps, TicketPriceType, TicketRoutePrice, RouteData } from '@/types/types'

//toast
import { toast } from 'react-toastify'

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

export interface RouteTicketFormProps {
  ticketData: TicketProps[]
  routeId: number
  ticketActiveConfig: string
}

function FromRouteTicketByStep({ ticketData, routeId, ticketActiveConfig }: RouteTicketFormProps) {

  const router = useRouter();
  //stores
  const { updateTicket, addTicket, getTicketByRouteId, getTicketById } = useTicketStore();
  const { getRouteById } = useRouteStore();
  const { getTicketPriceType } = useTicketPriceTypeStore();

  //use state
  const [error, setError] = useState<string>('');
  const [routeActive, setRouteActive] = useState<RouteData>();
  const [tickets, setTickets] = useState<TicketProps[]>();
  const [ticketActive, setTicketActive] = useState<string>(ticketActiveConfig);
  const [ticketNameTH, setTicketNameTH] = useState<string>('');
  const [ticketNameEN, setTicketNameEN] = useState<string>('');
  const [ticketAmount, setTicketAmount] = useState<string>('');
  const [ticketColor, setTicketColor] = useState<string>('');
  const [ticketStatus, setTicketStatus] = useState<number>(1);
  const [ticketType, setTicketType] = useState<TICKET_TYPE>();
  const [ticketPriceFixed, setTicketPriceFixed] = useState<TicketPriceTypeFixed[]>([]);
  const [ticketPriceList, setTicketPriceList] = useState<TicketRoutePrice[]>([]);
  const [ticketChecked, setTicketChecked] = useState<string[]>([]);
  const [ticketTypeList, setTicketTypeList] = useState<TicketPriceType[]>([]);
  const [newType, setNewType] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [checkConfirm, setCheckConfirm] = useState(true);
  const [initialTicketChecked, setInitialTicketChecked] = useState<string[]>([]);
  const [isSaveTable, setSaveTable] = useState<number>(0)

  // ------------------- UTIL ----------------------
  const resetTicketForm = () => {
    setTicketNameTH('');
    setTicketNameEN('');
    setTicketAmount('');
    setTicketColor('');
    setTicketType(undefined);
    setTicketPriceList([]);
    setTicketChecked([]);
    setInitialTicketChecked([]);
    setTicketStatus(1)
  };

  //Handle FixedPrice
  const buildFixedPriceList = (): TicketRoutePrice[] => {
    const stations = routeActive?.route_array.split(',') || [];
    const ticketPrices: TicketRoutePrice[] = [];
    for (let i = 0; i < stations.length - 1; i++) {
      for (let j = i + 1; j < stations.length; j++) {
        ticketPriceFixed.forEach((type) => {
          const from = stations[i];
          const to = stations[j];
          const typeId = type.id_type;

          // 🔍 หา ticket ที่มี from-to-type ตรงกัน
          const existing = ticketPriceList.find(
            (item) =>
              item.from === from &&
              item.to === to &&
              item.ticket_price_type_id === typeId
          );
          ticketPrices.push({
            from,
            to,
            price: type.price,
            ticket_price_type_id: typeId,
            ...(existing?.route_ticket_price_id && {
              route_ticket_price_id: existing.route_ticket_price_id,
            }),
          });
        });
      }
    }
    return ticketPrices;
  };
  useEffect(() => {
    setTicketPriceList(buildFixedPriceList())
  }, [ticketPriceFixed])

  // ------------------ DATA FETCH -----------------
  const fetchTicketByRouteID = async () => {
    try {
      const ticketDataNew = await getTicketByRouteId(routeId);
      setTickets(ticketDataNew || ticketData);
      return ticketDataNew; // เผื่อใช้ค่าที่ return ต่อ
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      return [];
    }
  };

  // get Route of ticket and ticket type
  useEffect(() => {
    const tempRouteId = Number(routeId)
    const fetchDefaults = async () => {
      const [routeData, priceTypeTemp] = await Promise.all([
        getRouteById(tempRouteId),
        getTicketPriceType()
      ]);
      await fetchTicketByRouteID();
      setRouteActive(routeData);
      setTicketTypeList(priceTypeTemp || []);
    };

    fetchDefaults();
  }, [routeId]);

  //config default value of ticket
  useEffect(() => {
    const fetchTicket = async () => {
      if (!ticketActive) {
        resetTicketForm();
        return;
      }

      const ticket = await getTicketById(+ticketActive);
      if (!ticket) return;

      const checked = Array.from(new Set(
        ticket.ticket_price?.map(item => item.ticket_price_type_id)
      ));

      setInitialTicketChecked(checked)
      setTicketChecked(checked);
      setTicketNameTH(ticket.ticketName_th);
      setTicketNameEN(ticket.ticketName_en);
      setTicketAmount(ticket.ticket_amount.toString());
      setTicketColor(ticket.ticket_color);
      setTicketType(ticket.ticket_type);
      setTicketPriceList(ticket.ticket_price || []);
      setTicketStatus(Number(ticket.ticket_status))
    };

    fetchTicket();
  }, [ticketActive, ticketTypeList]);

  // ----------------- FORM ACTION ------------------

  const handleAddType = () => {
    if (!newType) return;
    setNewType('');
  };

  //Return Form
  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setCheckConfirm(false);
    setError('');
  };

  //Next Form
  const handleValidateNext = () => {
    if (!ticketNameTH || !ticketNameEN || !ticketAmount || !ticketColor || !ticketType || ticketChecked.length <= 0) {
      setError("Please fill in completely.");
      return;
    }
    setError('');

    if (ticketType === TICKET_TYPE.FIXED) {
      const tempFixed = ticketChecked.map((id_type) => ({
        id_type,
        name: ticketTypeList.find((item) => item.id === id_type)?.name || '',
        price: ticketPriceList?.find((item) => item.ticket_price_type_id === id_type)?.price || 0
      }));
      setTicketPriceFixed(tempFixed);
    }

    setActiveStep((prev) => prev + 1);
  };

  //Validate Price List
  const ValidTicketPriceList = (ticketPrices: TicketRoutePrice[]): boolean => {
    return ticketPrices.length > 0 && ticketPrices.every(tp => tp.price && tp.price > 0);
  };
  const ValidTicketPriceType = (ticketPrice: TicketRoutePrice[], ticketChecked: string[]) => {
    if (ticketPrice?.length > 0) {
      return ticketChecked.every((id) =>
        ticketPrice.some((ticket) => ticket.ticket_price_type_id === id)
      );
    }
    return true;
  };

  //Submit Form
  const handleSubmit = async () => {
    if (!ticketType || !routeId) return;

    const tempTicketPrice: TicketRoutePrice[] = ticketPriceList.filter((item) =>
      ticketChecked.includes(item.ticket_price_type_id)
    );

    //validate price
    const isValidTicketPrice = ValidTicketPriceList(tempTicketPrice)
    const isValidTicketPriceType = ValidTicketPriceType(tempTicketPrice, ticketChecked);

    if (!isValidTicketPrice || !isValidTicketPriceType) {
      setError("Please fill in completely.");
      return;
    }
    setError('');

    //check update or create
    const isUpdate = !!ticketActive;

    //set payload
    const ticketId = Number(ticketActive)
    const formattedPayload = {
      ...(isUpdate && { route_ticket_id: ticketId }),
      route_ticket_name_th: ticketNameTH,
      route_ticket_name_en: ticketNameEN,
      route_ticket_color: ticketColor,
      route_ticket_status: ticketStatus,
      route_ticket_route_id: Number(routeId),
      route_ticket_amount: parseInt(ticketAmount),
      route_ticket_type: ticketType,
      route_ticket_price: tempTicketPrice.map((item) => ({
        ...(isUpdate && item.route_ticket_price_id && {
          route_ticket_price_id: Number(item.route_ticket_price_id),
        }),
        route_ticket_price_type_id: Number(item.ticket_price_type_id),
        route_ticket_location_start: parseInt(item.from),
        route_ticket_location_stop: parseInt(item.to),
        price: item.price.toString(),
        route_ticket_price_route_id: Number(routeId)
      }))
    };

    //fetch create, update to api
    try {
      if (isUpdate) {
        await updateTicket(ticketId, formattedPayload)
        toast.success("Update Success!");
        if (ticketActiveConfig) {
          router.push("/bu/manage-ticket")
        }
      } else {
        await addTicket(formattedPayload); // ใช้ฟังก์ชันเพิ่มใหม่
        toast.success("Create Success!")
      }
      if (!ticketActiveConfig) {
        resetTicketForm();
        handleBack();
      }
      setTicketActive(ticketActiveConfig);
      await fetchTicketByRouteID();
    } catch (error) {
      console.error("❌ Submit Failed", error);
      toast.error("Submit Failed!");
    }
  };

  //update price list (save only table)
  const updateTicketPriceList = (priceTable: TicketRoutePrice[]) => {
    const updatedList = [...ticketPriceList];
    priceTable.forEach((newItem) => {
      const index = updatedList.findIndex(
        (oldItem) =>
          oldItem.from === newItem.from &&
          oldItem.to === newItem.to &&
          oldItem.ticket_price_type_id === newItem.ticket_price_type_id
      );

      if (index !== -1) {
        updatedList[index] = { ...updatedList[index], ...newItem };
      } else {
        updatedList.push({ ...newItem });
      }
    });

    setSaveTable(0)
    setTicketPriceList(updatedList);
  };

  //validate price list set disabled btn
  useEffect(() => {
    const isValidTicketPriceType = ValidTicketPriceType(ticketPriceList, ticketChecked)
    const isValidTicketPrice = ValidTicketPriceList(ticketPriceList)
    if (isSaveTable) {
      setCheckConfirm(true)
      return;
    }
    if (isValidTicketPriceType && isValidTicketPrice) {
      setCheckConfirm(false)
    } else {
      setCheckConfirm(true)
    }
  }, [ticketPriceList, ticketChecked, isSaveTable])

  return (
    <div>
      {tickets && tickets.length > 0 && (
        <div className="mt-4">
          <p className="font-medium">Tickets</p>
          <div className="flex flex-wrap gap-4 mt-1">
            {!ticketActiveConfig
              ? tickets.map((item, index) => (
                <TicketBox
                  key={index}
                  ticket={item}
                  isActive={ticketActive === item.id}
                  onClick={() => {
                    if (activeStep > 0) {
                      toast.error("Please go back or finish editing before proceeding.");
                      return
                    };
                    setError("");
                    if (ticketActiveConfig && item.id) return setTicketActive(item.id);
                    if (ticketActive === item.id) {
                      setTicketActive(ticketActiveConfig)
                      return
                    };
                    if (item.id) setTicketActive(item.id);
                  }}
                />
              ))
              : (
                <TicketBox
                  ticket={{
                    ticket_color: ticketData[0].ticket_color,
                    ticketName_en: ticketData[0].ticketName_en,
                    ticketName_th: ticketData[0].ticketName_th,
                    ticket_type: ticketData[0].ticket_type ?? TICKET_TYPE.FIXED,
                    ticket_amount: '0',
                    route_id: '0'
                  }}
                  isActive={true}
                />
              )}
          </div>
        </div>
      )}

      <div className='p-5 custom-frame-content mt-5'>
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
                <FormRouteTicketInformation
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
                  initialTicketChecked={initialTicketChecked}
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
                              stations={routeActive?.route_array.split(',') || []}
                              ticketTypePriceName={ticketTypeList.find((item) => item.id === ticketTypeId)?.name || 'Ticket Price Type'}
                              ticketTypePriceId={ticketTypeId}
                              handleSaveTable={updateTicketPriceList}
                              setSaveTable={setSaveTable}
                              saveTable={isSaveTable}
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
                        <ButtonBG text="Confirm" size='' onClick={handleSubmit} disbled={checkConfirm} />
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
                        <ButtonBG text="Confirm" size='' onClick={handleSubmit} disbled={checkConfirm} />
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

export default FromRouteTicketByStep
