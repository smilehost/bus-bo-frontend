export interface CreateRoutePayload {
    route_name_th: string,
    route_name_en: string,
    route_color: string,
    route_status: number,
    route_com_id: number,
    route_date_id: number,
    route_time_id: number,
    route_array: string  
}

export interface FetchRouteQuery {
    page: number;
    size: number;
    search?: string;
    status?: string; // Added status property
  }