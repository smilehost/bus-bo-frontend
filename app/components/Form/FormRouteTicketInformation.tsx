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
import { getTextFormTicket, useLanguageContext } from '@/app/i18n/translations'

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
  const { isTH } = useLanguageContext();
  const text = getTextFormTicket({ isTH });

  return (
    <>
      <form className="flex flex-wrap gap-4 w-full">
        {/* Ticket Name (Thai) */}
        <div className="w-full sm:w-[calc(50%-8px)]">
          <InputLabel
            label={text.nameTH}
            placeholder='เช่น ขอนแก่น - โคราช'
            type="text"
            value={ticketNameTH}
            setValue={setTicketNameTH}
          />
        </div>

        {/* Ticket Name (English) */}
        <div className="w-full sm:w-[calc(50%-8px)]">
          <InputLabel
            label={text.nameEN}
            placeholder='e.g. Khon Kaen - Korat'
            type="text"
            value={ticketNameEN}
            setValue={setTicketNameEN}
          />
        </div>

        {/* Ticket Type */}
        <div className="w-full sm:w-[calc(50%-8px)] flex flex-col justify-end">
          <LabelText text={text.ticketTypeLabel} />
          <div className="flex gap-2 mt-2 flex-wrap">
            <ButtonDefault
              text={text.fixedText}
              size={`flex-1 min-w-[140px] max-w-[244px] h-[38px] ${isEditMode ? 'bg-gray-200' : ''
                } ${ticketType === TICKET_TYPE.FIXED ? 'custom-bg-main' : ''}`}
              onClick={() => !isEditMode && setTicketType(TICKET_TYPE.FIXED)}
            />
            <ButtonDefault
              text={text.tieredText}
              size={`flex-1 min-w-[140px] max-w-[244px] h-[38px] ${isEditMode ? 'bg-gray-200' : ''
                } ${ticketType === TICKET_TYPE.TIERED ? 'custom-bg-main' : ''}`}
              onClick={() => !isEditMode && setTicketType(TICKET_TYPE.TIERED)}
            />
          </div>
        </div>

        {/* Ticket Amount & Color */}
        <div className="w-full md:w-[calc(50%-8px)]">
          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <div className="w-full sm:w-2/3">
              <InputLabel
                label={text.amountLabel}
                placeholder={text.amountPlaceholder}
                type="amount"
                value={ticketAmount}
                setValue={setTicketAmount}
              />
            </div>
            <div className="w-full sm:w-1/3">
              <ColorRoute
                color={ticketColor}
                setRouteColor={setTicketColor}
                label={text.colorLabel}
                size_circle="w-[38px] h-[38px]"
                size_input="w-full"
              />
            </div>
          </div>
        </div>

        {/* Ticket Price Type */}
        <div className="w-full md:w-[calc(50%-8px)] mt-3">
          {ticketType && (
            <div className={`flex flex-col  w-full max-w-96`}>
              <LabelText text={text.priceTypeLabel} />
              <div
                className="mt-2 h-23 overflow-y-auto custom-border-gray rounded-md p-3 flex flex-col gap-1 scrollbar"
              >
                {ticketTypeList?.map((item, index) => {
                  const isMatch = ticketChecked?.some((c) => item.id === c);
                  const isLocked = initialTicketChecked?.includes(item.id);
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="cursor-pointer"
                        checked={isMatch}
                        disabled={isLocked}
                        onChange={() => handleChecked(item.id)}
                      />
                      <p className="text-[14px]">{item.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </form>

      {/* old version don't responsive design */}

      {/* <form className='flex gap-x-3 gap-y-4 flex-wrap'>
        <div className={`${gap_style} flex w-full flex-wrap`}>
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
        <div className={`${gap_style} flex flex-wrap w-full`}>
          <div className={`flex-1`}>
            <div className={`flex flex-col ${gap_style}`}>
              <LabelText text={"Ticket Type"} />
              <div className={`flex ${gap_style}`}>
                <ButtonDefault
                  text={"Fixed Price"}
                  size={`custom-ellipsis-style flex-1 max-w-[244px] h-[38px] ${isEditMode && "bg-gray-200"} ${ticketType === TICKET_TYPE.FIXED && "custom-bg-main"}`}
                  onClick={() => !isEditMode && setTicketType(TICKET_TYPE.FIXED)}
                />
                <ButtonDefault
                  text={"Tiered Price"}
                  size={`custom-ellipsis-style flex-1 max-w-[244px] h-[38px] ${isEditMode && "bg-gray-200"} ${ticketType === TICKET_TYPE.TIERED && "custom-bg-main"}`}
                  onClick={() => !isEditMode && setTicketType(TICKET_TYPE.TIERED)}
                />
              </div>
            </div>

          </div>
          <div className='flex-1'>
            <div className={`flex ${gap_style} max-w-[500px] flex-wrap`}>
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
                <ColorRoute color={ticketColor} setRouteColor={setTicketColor} label='Ticket Color' size_circle='w-[38px] h-[38px]' size_input='w-full min-w-16' />
              </div>

            </div>
          </div>
        </div>
        <div className='flex  w-full'>

          {ticketType && (
            <div className={`flex flex-col ${gap_style} mt-3 w-full max-w-96`}>
              <LabelText text="Ticket Price Type" />
              <div className='h-23 overflow-y-auto custom-border-gray rounded-md p-3 flex flex-col gap-1'
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
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
            </div>
          )}

        </div>
      </form> */}

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
