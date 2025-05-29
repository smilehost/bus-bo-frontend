// src/types.ts
import { USER_TIER, STATUS, TICKET_TYPE } from "@/constants/enum";
export type Company = { id: string; name: string };
export type User = { user_tier: USER_TIER; name: string; company_id: string };
export type Time = { id: string; name: string; times: string[]; status: STATUS };
export type Schedule = { id: string; name: string };
export type Station = { id: string; name: string; coordinates: string };

export type RouteData = {
    route_id: string;
    route_name_th: string;
    route_name_en: string;
    route_color: string;
    route_status: STATUS;
    route_com_id: string;
    route_date_id: string;
    route_time_id: string;
    route_array: string;
    route_ticket_count: number;
    route_date: {
          route_date_id: number,
          route_date_name: string,
          route_date_start: string,
          route_date_end: string,
          route_date_mon: number,
          route_date_tue: number,
          route_date_wen: number,
          route_date_thu: number,
          route_date_fri: number,
          route_date_sat: number,
          route_date_sun: number,
          route_date_com_id: number
        },
    route_ticket_url_header?: string
    route_ticket_url_footer?: string
};

export type Route = {
    data: RouteData[],
    page: number,
    size: number,
    total: number,
    totalPages: number
};

export type Ticket = {
    data: TicketProps[],
    page: number,
    size: number,
    total: number,
    totalPages: number
};

export type TicketPriceType = {
    id: string,
    name: string,
    company_id: string
}

export type TicketRoutePrice = {
    from: string,
    to: string,
    price: number,
    ticket_price_type_id: string,
    route_ticket_price_id?: string
}

export type TicketListProps = { type: string; price: number };

export type TicketProps = {
    id?: string;
    ticketName_th: string;
    ticketName_en: string;
    ticket_type: TICKET_TYPE;
    ticket_amount: string;
    ticket_color: string;
    ticket_status?: number,
    ticket_price?: TicketRoutePrice[];
    route_id: string;
    route?: {
        route_name_th: string,
        route_name_en: string,
        route_status: number,
    }
    
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
