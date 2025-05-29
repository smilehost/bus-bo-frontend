export interface CreateRoutePayload {
    route_name_th: string,
    route_name_en: string,
    route_color: string,
    route_status: number,
    route_com_id: number,
    route_date_id: number,
    route_time_id: number,
    route_array: string  ,
    route_ticket_url_header?: string,
    route_ticket_url_footer?: string
}

export interface UpdateRoutePayload extends CreateRoutePayload {
  route_id: number;
}

export interface FetchRouteQuery {
    page: number;
    size: number;
    search?: string;
    status?: string; // Added status property
  }