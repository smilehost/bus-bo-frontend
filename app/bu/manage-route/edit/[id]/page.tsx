"use client"

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation';

//type
import { StationProps } from '@/types/stations';
import { RouteType } from '@/types/routes';

//component 
import FormRoute from '@/app/components/Form/FormRoute';

//mui
import { SelectChangeEvent } from '@mui/material';

//mock
import { stationData } from '@/provider/Provider';
import { routeData } from '@/provider/Provider';


function Page() {

    const params = useParams()
    //set default value
    const [routeIndexData, setRouteIndexData] = useState<RouteType>()
    // useEffect(() => {
    //     if (params?.id !== undefined) {
    //         const id = params.id
    //         if (id) {
    //             console.log(route)
    //             const route = routeData.find((value) => value.id === id);
    //             setRouteIndexData(route)
    //         }
    //     }
    // }, [params])

    useEffect(() => {
        if (routeIndexData) {
            // กำหนดค่าเริ่มต้นของ routeName
            setRouteName(routeIndexData.route);

            // กำหนดค่าเริ่มต้นของ time
            setSelectedTime(routeIndexData.times.toString());

            // กำหนดค่าเริ่มต้นของ schedule
            setSchedule(routeIndexData.schedule.toString()); // กำหนดเป็น string

            // กำหนด 
        }
    }, [routeIndexData]);

    //select route name
    const [routeName, setRouteName] = useState<string>('')

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
        console.log("Time: ", selectedTime)
        console.log("Schedule: ", schedule)
        console.log("listStations", listStations)
    }

    if (!routeIndexData) {
        return null;
    }
    return (
        <div>
            <p className='text-[20px] font-bold'>Edit Route</p>
            <FormRoute
                routeName={routeName}
                setRouteName={setRouteName}
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
