"use client"

import DevicePage from '@/app/components/DevicePage/DevicePage'
import React from 'react'
import { useSearchParams } from 'next/navigation'

function Page() {
  const searchParams = useSearchParams();
  const comId = searchParams.get("comId")
  
  return (
    <div>
      <DevicePage comId={Number(comId)} />
    </div>
  )
}

export default Page
