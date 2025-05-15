import { Bolt, Table } from "lucide-react";
import { TICKET_TYPE } from "@/constants/enum";

//type 
import { TicketProps } from "@/types/types";

type TicketBoxProps = {
    ticket: TicketProps;
    isActive?: boolean;
    onClick?: () => void;
};

function TicketBox({ ticket, isActive = false, onClick }: TicketBoxProps) {
    const { ticket_color, ticketName_en, ticketName_th, ticket_type } = ticket;
    return (
        <div
            className={`${isActive ? "bg-gray-200" : "bg-white"} w-[200px] cursor-pointer shadow-xs px-7 rounded-md relative overflow-hidden`}
            onClick={onClick}
        >
            <div className="w-[8px] h-full absolute left-0" style={{ backgroundColor: ticket_color }} />
            <div className="flex flex-col gap-1 py-2">
                <p className="text-[12px] custom-ellipsis-style">{ticketName_en}</p>
                <p className="text-[12px] custom-ellipsis-style">{ticketName_th}</p>
            </div>
            {ticket_type === TICKET_TYPE.FIXED && (
                <Bolt size={16} className="text-gray-500 absolute top-0 right-0 m-2" />
            )}
            {ticket_type === TICKET_TYPE.TIERED && (
                <Table size={16} className="text-gray-500 absolute top-0 right-0 m-2" />
            )}
        </div>
    );
};

export default TicketBox
