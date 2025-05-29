export interface CreateLocationPayload {
  route_location_name: string;
  route_location_lat: string;
  route_location_long: string;
  route_location_com_id: number;
}

export interface UpdateLocationPayload extends CreateLocationPayload {
  route_location_id: number;
}

export interface FetchLocationsQuery {
  page: number;
  size: number;
  search?: string;
}
