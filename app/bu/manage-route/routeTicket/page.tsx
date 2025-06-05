"use client"

import React, { useState, useEffect } from 'react'

//component
import FromRouteTicketByStep from '@/app/components/Form/FormRouteTicketByStep'
import TitlePage from '@/app/components/Title/TitlePage';

//store
import { useTicketStore } from '@/stores/routeTicketStore'
import { TicketProps } from '@/types/types';

import { useSearchParams } from 'next/navigation';
import { store } from '@/stores/store';

function Page() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  const { getTicketByRouteId } = useTicketStore();

  const routeId = Number(id)

  const [ticketData, setTicketData] = useState<TicketProps[]>();
  const lang = store.Translation.use();
  const title = lang === 'EN' ? 'Manage Bus Ticket' : 'จัดการตั๋วรถ';

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
      <TitlePage title={title} />
      {ticketData && routeId && <FromRouteTicketByStep ticketData={ticketData} routeId={routeId} ticketActiveConfig=''/>}
    </div>
  )
}

export default Page
