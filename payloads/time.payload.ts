export interface CreateTimePayload {
    routeTimeName: string;
    routeTimeArray: string[];
    routeTimeComIdd: number;
  }
  
  export interface UpdateTimePayload {
    route_time_id: number;
    route_time_name: string;
    route_time_array: string;
    route_time_com_id: number;
  }
  
  export interface FetchTimesQuery {
    page: number;
    size: number;
    search?: string;
  }
  