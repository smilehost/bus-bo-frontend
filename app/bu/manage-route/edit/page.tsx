"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

//type
import { LocationItem } from '@/types/location';
import { RouteData } from '@/types/types';

//component 
import FormRoute from '@/app/components/Form/FormRoute/FormRoute';
import TitlePage from '@/app/components/Title/TitlePage';

//mui
import { SelectChangeEvent } from '@mui/material';

//api
import { useRouteStore } from '@/stores/routeStore';
import { useLocationStore } from '@/stores/locationStore';

//toast
import { toast } from 'react-toastify';


function Page() {

    //search params
    const searchParams = useSearchParams();
    const id = searchParams.get("id")

    //router
    const router = useRouter();

    //api
    const { getRouteById, updateRoute } = useRouteStore();
    const { locations, getLocations } = useLocationStore();

    //set default value
    const [routeIndexData, setRouteIndexData] = useState<RouteData>()

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                const route: RouteData | undefined = await getRouteById(Number(id)); // แปลง id เป็น number ถ้าจาก URL
                setRouteIndexData(route);
            }
        };

        fetchData();

    }, [id, getRouteById]);

    //get location data
    useEffect(() => {
        if (routeIndexData) {
            setRouteName(routeIndexData.route_name_en);
            setRouteNameTH(routeIndexData.route_name_th);
            setRouteComId(Number(routeIndexData.route_com_id));
            setRouteStatusId(Number(routeIndexData.route_status));
            setSchedule(routeIndexData.route_date_id)
            setSelectedTime(Number(routeIndexData.route_time_id));
            setSchedule(Number(routeIndexData.route_date_id).toString());
            setRouteColor(routeIndexData.route_color)
            setHeaderUrl(routeIndexData.route_ticket_url_header || "")
            setFooterUrl(routeIndexData.route_ticket_url_footer || "")
            getLocations(1, 5, '');
        }
    }, [routeIndexData, getLocations]);

    //get locations
    useEffect(() => {
        if (!routeIndexData) return;
        // console.log("locations: ", locations)
        setListA(locations);

        const stations = routeIndexData.route_array.split(',').map((station) => station.trim());

        // ดึง station ที่ id ตรงกับ routeIndexData.stations
        const stationObjects = stations.map((stationId) => {
            return locations.find((s) => s.id === parseInt(stationId));
        }).filter(Boolean) as LocationItem[];

        setListB(stationObjects);

        // เอา station ที่ยังไม่ถูกเลือก (ไม่อยู่ใน listB)
        const filteredListA = locations.filter(
            (station) => !stationObjects.some((s) => s?.id === station.id)
        );

        setListA(filteredListA);
    }, [locations]);


    const [routeName, setRouteName] = useState<string>('')
    const [routeNameTH, setRouteNameTH] = useState<string>('')
    const [routeStatusId, setRouteStatusId] = useState<number>()
    const [routeComId, setRouteComId] = useState<number>()
    const [routeColor, setRouteColor] = useState<string>('#3B82F6'); // ตั้งค่าสีเริ่มต้น
    const [listA, setListA] = useState<LocationItem[]>([]);
    const [listB, setListB] = useState<LocationItem[]>([]);
    const [listStations, setListStations] = useState<number[]>([]);
    const [headerUrl, setHeaderUrl] = useState<string>('')
    const [footerUrl, setFooterUrl] = useState<string>('')

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
            route_id: Number(id),
            route_name_th: routeNameTH,
            route_name_en: routeName,
            route_color: routeColor,
            route_status: Number(routeStatusId),
            route_com_id: Number(routeComId),
            route_date_id: Number(schedule),
            route_time_id: Number(selectedTime),
            route_array: routeArray,
            route_ticket_url_header: headerUrl,
            route_ticket_url_footer: footerUrl
        };

        const result = await updateRoute(Number(id), payload);

        if (result.success) {
            toast.success("Update route successfully!");
            router.back();
        } else {
            toast.error(`Error: ${result.message}`);
        }
    };

    if (!routeIndexData) {
        return null;
    }
    return (
        <div>
            <TitlePage title={"Edit Route"} />
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
                disable={!!id}
                headerUrl={headerUrl}
                setHeaderUrl={setHeaderUrl}
                footerUrl={footerUrl}
                setFooterUrl={setFooterUrl}
            />
        </div>
    )
}

export default Page
