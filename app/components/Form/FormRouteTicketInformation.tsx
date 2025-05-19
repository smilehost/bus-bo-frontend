import React from 'react'

//component
import InputLabel from '@/app/components/Form/InputLabel'
import LabelText from '@/app/components/Form/LabelText'
import ButtonDefault from '@/app/components/Form/ButtonDefault'
import ButtonBG from '@/app/components/Form/ButtonBG'
import ColorRoute from '@/app/components/Form/ColorRoute'
import TextError from '../TextError'

//const
import { TICKET_TYPE } from '@/constants/enum'

//type
import { TicketPriceType } from '@/types/types'

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
  ticketChecked?: string[]
  initialTicketChecked?: string[]
  setTicketChecked: (value: string[]) => void;
  ticketTypeList?: TicketPriceType[];
  setTicketTypeList: (value: TicketPriceType[]) => void;
  newType: string;
  setNewType: (value: string) => void;
  handleAddType: () => void;
  handleValidateNext: () => void;
  handleBack?: () => void;
  isEditMode?: boolean;
  error?: string;
};

function FormRouteTicketInformation({
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
  newType,
  setNewType,
  handleAddType,
  handleValidateNext,
  ticketChecked,
  initialTicketChecked,
  setTicketChecked,
  ticketTypeList,
  handleBack,
  error,
  isEditMode = false
}: FormRouteTicketProps) {

  const handleChecked = (id: string) => {
    // กำหนดค่า fallback ให้ ticketChecked เป็น array ว่างถ้า undefined
    const currentChecked = ticketChecked || [];
    const isChecked = currentChecked.includes(id);
    const newChecked = isChecked
      ? currentChecked.filter((item) => item !== id)
      : [...currentChecked, id];

    setTicketChecked(newChecked); // ✅ ไม่ error แล้ว
  };

  return (
    <>
      {/* form */}
      <form className='flex gap-x-3 gap-y-4 flex-wrap'>
        <div className='flex w-full gap-3'>
          <div className="flex-1">
            <InputLabel
              label="Ticket Name (Thai)"
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
                <ButtonDefault
                  text={"Fixed Price"}
                  size={`flex-1 max-w-[244px] h-[38px] ${isEditMode && "bg-gray-200"} ${ticketType === TICKET_TYPE.FIXED && "custom-bg-main"}`}
                  onClick={() => !isEditMode && setTicketType(TICKET_TYPE.FIXED)}
                />
                <ButtonDefault
                  text={"Tiered Price"}
                  size={`flex-1 max-w-[244px] h-[38px] ${isEditMode && "bg-gray-200"} ${ticketType === TICKET_TYPE.TIERED && "custom-bg-main"}`}
                  onClick={() => !isEditMode && setTicketType(TICKET_TYPE.TIERED)}
                />
              </div>
            </div>
            {ticketType && (
              <div className='flex flex-col gap-2 mt-3'>
                <LabelText text="Ticket Price Type" />
                <div className='custom-border-gray rounded-md p-3'>
                  <div className='flex flex-col gap-1'>
                    {ticketTypeList?.map((item, index) => {
                      const isMatch = ticketChecked?.some((c) => item.id === c)
                      const isLocked = initialTicketChecked?.includes(item.id); 

                      return (
                        <div key={index} className='flex items-center gap-2'>
                          <input
                            type="checkbox"
                            className='cursor-pointer'
                            checked={isMatch}
                            disabled={isLocked}
                            onChange={() => handleChecked(item.id)}
                          />
                          <p className='text-[14px]'>{item.name}</p>
                        </div>
                      )
                    })}
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
                  type="number"
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
      </form>

      {/* button */}
      <div className='mt-10 flex flex-col items-end'>
        {error && (
          <TextError text={error} />
        )}
        <div className='flex gap-2 mt-3'>
          {handleBack && (
            <ButtonDefault size='' text='Back' onClick={handleBack} />
          )}
          <ButtonBG size='' text='Next' onClick={handleValidateNext} />
        </div>

      </div>
    </>
  )
}

export default FormRouteTicketInformation
