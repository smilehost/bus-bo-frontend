export interface FetchDatesQuery {
  page: number;
  size: number;
  search?: string;
  status?: string; // Added status property
}

export interface CreateDatePayload {
  route_date_name: string;
  route_date_start: string;
  route_date_end: string;
  route_date_mon: number;
  route_date_tue: number;
  route_date_wen: number;
  route_date_thu: number;
  route_date_fri: number;
  route_date_sat: number;
  route_date_sun: number;
  route_date_com_id: number;
}

export interface UpdateDatePayload extends CreateDatePayload {
  route_date_id: number;
}
