"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { SelectChangeEvent } from '@mui/material';

//component 
import SelectTime from '@/app/components/Form/SelectTime'
import ColorRoute from '@/app/components/Form/ColorRoute'
import InputLabel from '@/app/components/Form/InputLabel'
import DragDrop from '@/app/components/RoutePage/DragDrop'
import ButtonBG from '@/app/components/Form/ButtonBG'
import ButtonDefault from '@/app/components/Form/ButtonDefault'
import SelectInputAndAdd from '@/app/components/Form/SelectInputAndAdd'
import TextError from '../../TextError';

//api
import { useTimeStore } from '@/stores/timeStore';
import { useDateStore } from '@/stores/dateStore';

//type
import { LocationItem } from '@/types/location';

//style
import styles from './FormRoute.module.scss'

type FormRouteProps = {
  routeNameTH?: string | undefined;
  setRouteNameTH: React.Dispatch<React.SetStateAction<string>>;
  routeName?: string | undefined;
  setRouteName: React.Dispatch<React.SetStateAction<string>>;
  routeColor: string;
  setRouteColor: React.Dispatch<React.SetStateAction<string>>;
  listA: LocationItem[];
  setListA: React.Dispatch<React.SetStateAction<LocationItem[]>>;
  listB: LocationItem[];
  setListB: React.Dispatch<React.SetStateAction<LocationItem[]>>;
  selectedTime: string;
  handleChangeTime: (event: SelectChangeEvent<string>) => void;
  schedule: string;
  handleChangeSchedule: (event: SelectChangeEvent<string>) => void;
  handleSubmit: () => void;
  disable: boolean
}

function FormRoute({
  routeName,
  setRouteName,
  routeColor,
  setRouteColor,
  listA,
  setListA,
  listB,
  setListB,
  selectedTime,
  handleChangeTime,
  schedule,
  handleChangeSchedule,
  handleSubmit,
  setRouteNameTH,
  routeNameTH,
  disable = false
}: FormRouteProps) {
  const router = useRouter();

  const { dates, getDates } = useDateStore();
  const { times, getTimes } = useTimeStore();

  const [error, setError] = useState<string>('')

  useEffect(() => {
    getTimes(1, 5, '')
    getDates(1, 5, '')
  }, [])

  const handleValidateSubmit = () => {
    const payload = {
      route_name_th: routeNameTH,
      route_name_en: routeName,
      route_color: routeColor,
      route_date_id: schedule,
      route_time_id: selectedTime,
      route_array: listB
    };

    if (!payload.route_name_th ||
      !payload.route_name_en ||
      !payload.route_color ||
      !payload.route_date_id ||
      !payload.route_time_id ||
      payload.route_array.length < 2
    ) {
      setError("Please fill in completely.")
      return;
    }
    setError("")
    handleSubmit();
  }

  // console.log(listA, listB)
  return (
    <div className='custom-frame-content px-5 py-7 mt-5 w-full'>
      <div className={` mx-auto flex flex-col gap-3 ${styles.customSizeContainer}`}>
        <div className='flex justify-between flex-wrap gap-3'>
          {/* route name en*/}
          <InputLabel
            label="Route Name EN"
            placeholder="Enter Route Name Eng"
            type="text"
            setValue={setRouteName}
            value={routeName}
            size={'min-w-[300px] xl:w-[400px] max-w-[400px]'}
          />
          {/* route name th*/}
          <InputLabel
            label="Route Name TH"
            placeholder="Enter Route Name Thai"
            type="text"
            setValue={setRouteNameTH}
            value={routeNameTH}
            size='min-w-[300px] xl:w-[400px] max-w-[400px]'
          />
        </div>
        <div className='flex justify-between flex-wrap gap-3'>
          {/* time */}
          <SelectTime
            selectedTime={selectedTime}
            onChange={handleChangeTime}
            timeData={times}
          />
          {/* Schedule */}
          <SelectInputAndAdd
            data={dates}
            value={schedule}
            onChange={handleChangeSchedule}
          />
        </div>
        <div className='flex justify-between flex-wrap gap-3'>
          {/* color */}
          <ColorRoute color={routeColor} setRouteColor={setRouteColor} label={"Route Color"} size_circle='w-[38px] h-[38px]' size_input='w-full' size='min-w-[300px] xl:w-[400px] max-w-[400px]' />
        </div>
      </div>
      <div className='flex flex-col justify-center items-center mt-8'>
        <p className='text-[16px] font-bold'>Stations</p>
        <p className='text-[12px] text-[#6B7280]'>Add stations in order from start to end</p>
      </div>
      <div className={`${disable ? "custom-disable-bg" : "bg-white"} border-[#D1D5DB] border-1 mt-3 py-8 px-8 rounded-sm`}>
        <div className={` ${styles.customSizeContainer} mx-auto`}>
          <DragDrop
            listA={listA}
            setListA={setListA}
            setListB={setListB}
            listB={listB}
            disable={disable}
          />
        </div>
      </div>
      <div className='flex flex-col items-end mt-5 '>
        {error && (
          <TextError text={error} />
        )}
        <div className='mt-3 flex items-center justify-end gap-3'>
          <ButtonDefault size="" text="Cancel" onClick={() => router.back()} />
          <ButtonBG size="" text={`${disable ? "Edit Route" : "Add Route"}`} onClick={handleValidateSubmit} />
        </div>
      </div>
    </div>
  )
}

export default FormRoute
