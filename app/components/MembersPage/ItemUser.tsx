import React from 'react'
import Image from 'next/image'

//components
import Profile from '@/app/components/Profile'
import StatusText from '@/app/components/StatusText'
import ButtonDefault from '@/app/components/Form/ButtonDefault'

//const
import { STATUS } from '@/constants/enum'

type ItemUserMemberProps = {
    name: string,
    tel: string,
    status: STATUS,
    company: string,
    tripsTotal: number,
    lastTransaction: string
    index: number
    onClick?: () => void;
}

function ItemUser({ name, tel, status, company, tripsTotal, lastTransaction,index, onClick }: ItemUserMemberProps) {
    return (
        <div
  className="p-5 flex justify-between items-center animate-fade-in"
  style={{
    animationDelay: `${index * 80}ms`,
    animationDuration: "600ms",
    animationFillMode: "both",
  }}
>
  <div className="flex gap-3 items-center">
    <Profile size="w-[48px] h-[48px]" charactor={name[0]} />
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-4">
        <p className="text-[16px]">{name}</p>
        <StatusText type={status} />
      </div>
      <div className="flex items-center gap-1">
        <Image
          src={"/icons/phone-gray.svg"}
          width={16}
          height={16}
          alt="icon"
          priority
        />
        <p className="text-[#6B7280] text-[12px]">{tel}</p>
      </div>
    </div>
  </div>
  <div className="flex items-end gap-5">
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <Image
          src={"/icons/user-gray.svg"}
          width={14}
          height={14}
          alt="icon"
          priority
        />
        <p className="text-[#6B7280] text-[12px]">{company}</p>
      </div>
      <div className="flex items-center gap-1">
        <Image
          src={"/icons/ticket-gray.svg"}
          width={14}
          height={14}
          alt="icon"
          priority
        />
        <p className="text-[#6B7280] text-[12px]">{tripsTotal} trips total</p>
      </div>
    </div>
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <p className="text-[12px]">Last Transaction</p>
      </div>
      <div className="flex items-center gap-1">
        <Image
          src={"/icons/calendar-gray.svg"}
          width={14}
          height={14}
          alt="icon"
          priority
        />
        <p className="text-[#6B7280] text-[12px]">{lastTransaction}</p>
      </div>
    </div>
    <div>
      <ButtonDefault size="h-[38px]" text="View Details" onClick={onClick} />
    </div>
  </div>
</div>

    )
}

export default ItemUser