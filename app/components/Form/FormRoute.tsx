import React from 'react'
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

//mock
import { useDataStore } from "@/stores/dataStore";

//type
import { StationProps } from '@/types/stations';

type FormRouteProps = {
  routeName?: string | undefined;
  setRouteName: React.Dispatch<React.SetStateAction<string>>;
  routeColor: string;
  setRouteColor: React.Dispatch<React.SetStateAction<string>>;
  listA: StationProps[];
  setListA: React.Dispatch<React.SetStateAction<StationProps[]>>;
  listB: StationProps[];
  setListB: React.Dispatch<React.SetStateAction<StationProps[]>>;
  selectedTime: string;
  handleChangeTime: (event: SelectChangeEvent<string>) => void;
  schedule: string;
  handleChangeSchedule: (event: SelectChangeEvent<string>) => void;
  handleSubmit: (e: React.FormEvent) => void;
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
  handleSubmit
}: FormRouteProps) {
  const router = useRouter();

  const scheduleData = useDataStore(state => state.scheduleData);
  const timeData = useDataStore(state => state.timeData);

  console.log('routeColor', routeColor)

  return (
    <form onSubmit={handleSubmit} className='bg-white px-5 py-7 rounded-lg mt-5 w-full'>
      <div className="lg:mx-20">
        <div className='flex justify-between flex-wrap gap-3'>
          {/* route name */}
          <InputLabel
            label="Route Name"
            placeholder="Enter route name"
            type="text"
            setValue={setRouteName}
            value={routeName}
            size='min-w-[300px] xl:w-[400px] max-w-[400px]'
          />
          {/* color */}
          <ColorRoute color={routeColor} setRouteColor={setRouteColor} />
        </div>
        <div className='flex justify-between flex-wrap lg:mt-5 gap-3 mt-3'>
          {/* time */}
          <SelectTime
            selectedTime={selectedTime}
            onChange={handleChangeTime}
            timeData={timeData}
          />
          {/* Schedule */}
          <SelectInputAndAdd
            data={scheduleData}
            value={schedule}
            onChange={handleChangeSchedule}

          />
        </div>
      </div>
      <div className='flex flex-col justify-center items-center mt-8'>
        <p className='text-[16px] font-bold'>Stations</p>
        <p className='text-[12px] text-[#6B7280]'>Add stations in order from start to end</p>
      </div>
      <div className='border-[#D1D5DB] border-1 mt-3 py-8 px-8 rounded-sm'>
        <DragDrop listA={listA} setListA={setListA} setListB={setListB} listB={listB} />
      </div>
      <div className='mt-5 flex items-center justify-end gap-3'>
        <ButtonDefault size="" text="Cancel" onClick={() => router.back()} />
        <ButtonBG size="" text="Add Route" />
      </div>
    </form>
  )
}

export default FormRoute
