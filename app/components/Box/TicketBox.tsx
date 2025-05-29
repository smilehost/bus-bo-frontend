import { Bolt, OctagonX, Table } from "lucide-react";
import { STATUS, TICKET_TYPE } from "@/constants/enum";

//type 
import { TicketProps } from "@/types/types";
import { Tooltip } from "@mui/material";

type TicketBoxProps = {
    ticket: TicketProps;
    isActive?: boolean;
    onClick?: () => void;
    isTicketActive?: boolean;
};

function TicketBox({ ticket, isActive = false, onClick, isTicketActive = false }: TicketBoxProps) {
    const { ticket_color, ticketName_en, ticketName_th, ticket_type } = ticket;

    return (
       <Tooltip title={isTicketActive ?  STATUS.INACTIVE: ""}>
         <div
            className={`${isTicketActive && isActive && "bg-red-200"} ${isTicketActive && "bg-red-100"} ${isActive && !isTicketActive && "bg-gray-200"} ${!isActive && !isTicketActive && "bg-white"} w-[200px] cursor-pointer shadow-xs px-7 rounded-md relative overflow-hidden`}
            onClick={onClick}
        >
            <div className="w-[8px] h-full absolute left-0" style={{ backgroundColor: ticket_color }} />
            <div className="flex flex-col gap-1 py-2">
                <p className="text-[12px] custom-ellipsis-style">{ticketName_th}</p>
                <p className="text-[12px] custom-ellipsis-style">{ticketName_en}</p>
            </div>
            {ticket_type === TICKET_TYPE.FIXED && (
                <Bolt size={16} className={`${isTicketActive ? "text-red-500":"text-gray-500"}  absolute top-0 right-0 m-2`} />
            )}
            {ticket_type === TICKET_TYPE.TIERED && (
                <Table size={16} className={`${isTicketActive ? "text-red-500":"text-gray-500"}  absolute top-0 right-0 m-2`} />
            )}
            {isTicketActive && (
                <OctagonX size={16} className="text-red-500 absolute bottom-0 right-0 m-2" />
            )}
        </div>
       </Tooltip>
    );
};

export default TicketBox
