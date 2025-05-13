"use client"

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation';
//component
import RouteTicketForm from '@/app/components/Form/RouteTicketForm'

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

  //13/05/68 ติดปัญหา add เกิน > 3 stations ไม่ได้ api ถูกแล้วน่าจะแค่แสดงผลผิด

  return (
    <div>
      {ticketData && <RouteTicketForm ticketData={ticketData} routeId={routeId}/>}
    </div>
  )
}

export default Page
