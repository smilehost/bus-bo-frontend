import React from 'react'
import { STATUS } from '@/constants/enum'

type StatusTextProps = {
    type: STATUS
}
function StatusText({ type }: StatusTextProps) {
    return (
        <div className={`px-3 py-1 rounded-xl w-fit text-[10px] font-medium
        ${type === STATUS.ACTIVE && "bg-[#DCFCE7] text-[#166534]"}
        ${type === STATUS.INACTIVE && "bg-[#F3F4F6] "}
           ${type === STATUS.CANCELLED && "bg-[#FEE2E2] text-[#991B1B]"}
        `}>
            {type}
        </div>
    )
}

export default StatusText
