"use client"

import React from 'react'

import MemberPageComponent from '@/app/components/MembersPage/MemberPageComponent'
import { useSearchParams } from 'next/navigation'
function Page() {
  const searchParams = useSearchParams();
  const comId = searchParams.get("comId")

  return (
    <div>
      <MemberPageComponent comId={Number(comId)} />
    </div>
  )
}

export default Page
