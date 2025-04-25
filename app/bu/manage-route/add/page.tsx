"use client"

import React, { useState, useEffect } from 'react'

//type
import { StationProps } from '@/types/stations';

//component 
import FormRoute from '@/app/components/Form/FormRoute';
import TitleHeader from '@/app/components/Title/TitleHeader';

//mui
import { SelectChangeEvent } from '@mui/material';

//mock
import { useDataStore } from "@/stores/dataStore";

function Page() {

    //mock
    const stationData = useDataStore(state => state.stationData);

    //select route name
    const [routeName, setRouteName] = useState<string>('')

    //route color
    const [routeColor, setRouteColor] = useState<string>('#3B82F6')

    //select station
    const transformedList = stationData.map((station, index) => ({
        id: (index + 1).toString(),
        name: station.name,
    }));
    const [listA, setListA] = useState<StationProps[]>(transformedList);
    const [listB, setListB] = useState<StationProps[]>([]);
    const [listStations, setListStations] = useState<string[]>([]);

    //select time
    const [selectedTime, setSelectedTime] = useState<string>(''); // ค่าที่จะเก็บเวลา
    const handleChangeTime = (event: SelectChangeEvent<string>) => {
        setSelectedTime(event.target.value); // อัปเดตค่าเมื่อเลือกเวลาใหม่
    };

    //select schedule
    const [schedule, setSchedule] = useState<string>('');
    const handleChangeSchedule = (event: SelectChangeEvent<string>) => {
        setSchedule(event.target.value); // อัปเดตค่าเมื่อเลือกเวลาใหม่
    };


    useEffect(() => {
        const stationIds = listB.map(station => station.id);
        setListStations(stationIds);
    }, [listB]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Route Name: ", routeName)
        console.log("Route Color: ", routeColor)
        console.log("Time: ", selectedTime)
        console.log("Schedule: ", schedule)
        console.log("listStations", listStations)
    }

    return (
        <div>
            <TitleHeader text={"Add New Route"} />
            <FormRoute
                routeName={routeName}
                setRouteName={setRouteName}
                routeColor={routeColor}
                setRouteColor={setRouteColor}
                listA={listA}
                setListA={setListA}
                listB={listB}
                setListB={setListB}
                selectedTime={selectedTime}
                handleChangeTime={handleChangeTime}
                schedule={schedule}
                handleChangeSchedule={handleChangeSchedule}
                handleSubmit={handleSubmit}
            />
        </div>
    )
}

export default Page
