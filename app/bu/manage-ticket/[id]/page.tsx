"use client"

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation';
//component
import FromRouteTicketByStep from '@/app/components/Form/FormRouteTicketByStep'
import TitlePage from '@/app/components/Title/TitlePage';

//store
import { useTicketStore } from '@/stores/routeTicketStore'
import { TicketProps } from '@/types/types';

function Page() {
    const { id } = useParams();
    const { getTicketById } = useTicketStore();

    const idTicket = Number(id)

    const [ticketData, setTicketData] = useState<TicketProps[]>();

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            const data = await getTicketById(idTicket);
            if (data) {
                setTicketData([data]);
            } else {
                setTicketData([]); 
            }
        };
        fetchData();

    }, [id, getTicketById]);

    return (
        <div>
            <TitlePage title={"Edit Route Ticket"} />
            {ticketData && <FromRouteTicketByStep ticketData={ticketData} routeId={Number(ticketData[0]?.route_id)} ticketActiveConfig={idTicket.toString()} />}
        </div>
    )
}

export default Page
