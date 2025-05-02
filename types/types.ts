// src/types.ts
import { USER_TIER, STATUS, TICKET_TYPE } from "@/constants/enum";
export type Company = { id: string; name: string };
export type User = { user_tier: USER_TIER; name: string; company_id: string };
export type Time = { id: string; name: string; times: string[]; status: STATUS };
export type Schedule = { id: string; name: string };
export type Station = { id: string; name: string; coordinates: string };

export type Route = {
    id: string;
    route: string;
    status: STATUS;
    routeColor: string;
    stations: string[];
    ticket_amount?: string;
    times_id: string;
    company_id: string;
    schedule_id: string;
};

export type TicketPriceType = {
    id: string,
    name: string,
    company_id: string
}

export type TicketRoutePrice = {
    id: string,
    from: string,
    to: string,
    price: number,
    ticket_price_type_id: string,
}

export type TicketListProps = { type: string; price: number };

export type TicketProps = {
    id: string;
    ticketName_th: string;
    ticketName_en: string;
    ticket_type: TICKET_TYPE;
    ticket_amount: string;
    ticket_color: string;
    ticket_price: TicketRoutePrice[];
    route_id: string;
};

export type Member = {
    id: string;
    member_name: string;
    member_phone: string;
    member_status: STATUS;
    member_company_id: string;
    member_tripsTotal: number;
    member_lastTransaction: string;
};

export type DataStore = {
    companyData: Company[];
    userData: User;
    timeData: Time[];
    scheduleData: Schedule[];
    stationData: Station[];
    routeData: Route[];
    membersData: Member[];
    ticketData: TicketProps[];
};
