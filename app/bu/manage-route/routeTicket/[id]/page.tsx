"use client"

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation';
//component
import RouteTicketForm from '@/app/components/Form/RouteTicketForm'
import TitlePage from '@/app/components/Title/TitlePage';

//store
import { useTicketStore } from '@/stores/routeTicketStore'
import { TicketProps } from '@/types/types';

function Page() {
  const { id } = useParams();
  const { getTicketByRouteId } = useTicketStore();

  const routeId = Number(id)

  const [ticketData, setTicketData] = useState<TicketProps[]>();

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      const data = await getTicketByRouteId(routeId);
      setTicketData(data);
    };
    
    fetchData();
  }, [id, getTicketByRouteId]);

  return (
    <div>
      <TitlePage title={"Add New Route Ticket"} />
      {ticketData && <RouteTicketForm ticketData={ticketData} routeId={routeId} ticketActiveConfig=''/>}
    </div>
  )
}

export default Page
