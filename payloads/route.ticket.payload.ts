import { TICKET_TYPE } from "@/constants/enum";

export interface RoutePriceTicket {
    route_ticket_price_id?: number,
    route_ticket_price_type_id: number,
    route_ticket_location_start: number,
    route_ticket_location_stop: number,
    price: string,
    route_ticket_price_route_id: number,
}

export interface CreateRouteTicketPayload {
    route_ticket_name_th: string,
    route_ticket_name_en: string,
    route_ticket_color: string,
    route_ticket_status: number,
    route_ticket_route_id: number,
    route_ticket_amount: number,
    route_ticket_type: TICKET_TYPE,
    route_ticket_price?: RoutePriceTicket[]
    route?: {
        route_name_th: string,
        route_name_en: string,
        route_status: number,
    }
}

export interface UpdateRouteTicketPayload extends CreateRouteTicketPayload {
    route_ticket_id: number;
}

export interface FetchTicketQuery {
    page: number;
    size: number;
    search?: string;
    status?: string;
}
