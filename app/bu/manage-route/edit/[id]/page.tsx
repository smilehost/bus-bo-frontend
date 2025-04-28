"use client"

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation';

//type
import { StationProps } from '@/types/stations';
import { RouteType } from '@/types/routes';

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
    const routeData = useDataStore(state => state.routeData);

    const params = useParams()
    //set default value
    const [routeIndexData, setRouteIndexData] = useState<RouteType>()
    useEffect(() => {
        if (params?.id !== undefined) {
            const foundRoute = routeData.find((value) => value.id === params?.id);
            if (foundRoute) {
                const routeIndexData: RouteType = {
                    id: foundRoute.id,
                    route: foundRoute.route,
                    company: foundRoute.company_id,
                    schedule: foundRoute.schedule_id,
                    times: foundRoute.times_id,
                    status: foundRoute.status,
                    routeColor: foundRoute.routeColor,
                    stations: foundRoute.stations
                };

                setRouteIndexData(routeIndexData);
            }
        }
    }, [params, routeData])

    useEffect(() => {
        if (routeIndexData) {
            setRouteName(routeIndexData.route);
            setSelectedTime(routeIndexData.times.toString());
            setSchedule(routeIndexData.schedule.toString());
            setRouteColor(routeIndexData.routeColor.toString())

            // ดึง station ที่ id ตรงกับ routeIndexData.stations
            const stationObjects = routeIndexData.stations.map((stationId) => {
                return transformedList.find((s) => s.id === stationId);
            }).filter(Boolean) as StationProps[];

            setListB(stationObjects);

            // เอา station ที่ยังไม่ถูกเลือก (ไม่อยู่ใน listB)
            const filteredListA = transformedList.filter(
                (station) => !stationObjects.some((s) => s.id === station.id)
            );
            setListA(filteredListA);
        }
    }, [routeIndexData]);

    const transformedList = stationData.map((station) => ({
        id: station.id,
        name: station.name,
    }));

    //select route name
    const [routeName, setRouteName] = useState<string>('')

    //route color
    const [routeColor, setRouteColor] = useState<string>('#3B82F6'); // ตั้งค่าสีเริ่มต้น

    //select station
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

    if (!routeIndexData) {
        return null;
    }
    return (
        <div>
            <TitleHeader text={"Edit Route"} />
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
