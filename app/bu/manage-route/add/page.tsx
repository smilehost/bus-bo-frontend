"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';

//type
import { LocationItem } from '@/types/location';

//component 
import FormRoute from '@/app/components/Form/FormRoute/FormRoute';
import TitlePage from '@/app/components/Title/TitlePage';

//mui
import { SelectChangeEvent } from '@mui/material';

//store
import { useRouteStore } from '@/stores/routeStore';
import { useLocationStore } from '@/stores/locationStore';
import { useUserStore } from '@/stores/userStore';

//toast
import { toast } from 'react-toastify';
import { getComId } from '@/utils/getComId';

function Page() {

    //router
    const router = useRouter();

    //store
    const { addRoute } = useRouteStore();
    const { locations, getLocations } = useLocationStore();
    const  com_id  = getComId();

    //get locations
    useEffect(() => {
        setRouteStatusId(1)
        setRouteComId(com_id!);
        getLocations(1, 5, '');
    }, [getLocations])
    
    useEffect(() => {
        // console.log("locations: ", locations)
        setListA(locations);

    }, [locations]);

    //use state
    const [routeName, setRouteName] = useState<string>('')
    const [routeNameTH, setRouteNameTH] = useState<string>('')
    const [routeStatusId, setRouteStatusId] = useState<number>()
    const [routeComId, setRouteComId] = useState<number>()
    const [routeColor, setRouteColor] = useState<string>('#3B82F6'); // ตั้งค่าสีเริ่มต้น
    const [listA, setListA] = useState<LocationItem[]>([]);
    const [listB, setListB] = useState<LocationItem[]>([]);
    const [listStations, setListStations] = useState<number[]>([]);

    //select time
    const [selectedTime, setSelectedTime] = useState<number>(); // ค่าที่จะเก็บเวลา
    const handleChangeTime = (event: SelectChangeEvent<string>) => {
        setSelectedTime(parseInt(event.target.value)); // อัปเดตค่าเมื่อเลือกเวลาใหม่
    };

    //select schedule
    const [schedule, setSchedule] = useState<string>('');
    const handleChangeSchedule = (event: SelectChangeEvent<string>) => {
        setSchedule(event.target.value); // อัปเดตค่าเมื่อเลือกเวลาใหม่
    };


    useEffect(() => {
        const stationIds = listB?.map(station => station.id);
        setListStations(stationIds);
    }, [listB]);

    const handleSubmit = async () => {
        const routeArray = listStations.map((id) => id).join(',');
        const payload = {
            route_name_th: routeNameTH,
            route_name_en: routeName,
            route_color: routeColor,
            route_status: Number(routeStatusId),
            route_com_id: Number(routeComId),
            route_date_id: Number(schedule),
            route_time_id: Number(selectedTime),
            route_array: routeArray
        };

        const result = await addRoute(payload);

        if (result.success) {
            toast.success("Create route successfully!");
            router.back();
        } else {
            toast.error(`Error: ${result.message}`);
        }
    };

    return (
        <div>
            <TitlePage title={"Create Route"} />
            <FormRoute
                routeNameTH={routeNameTH}
                setRouteNameTH={setRouteNameTH}
                routeName={routeName}
                setRouteName={setRouteName}
                routeColor={routeColor}
                setRouteColor={setRouteColor}
                listA={listA}
                setListA={setListA}
                listB={listB}
                setListB={setListB}
                selectedTime={selectedTime?.toString() || ''}
                handleChangeTime={handleChangeTime}
                schedule={schedule}
                handleChangeSchedule={handleChangeSchedule}
                handleSubmit={handleSubmit}
                disable={false}
            />
        </div>
    )
}

export default Page
