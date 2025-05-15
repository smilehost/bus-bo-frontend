export interface FetchCompanyQuery {
  page: number;
  size: number;
  search?: string;
  status?: string;
}

export interface CreateCompanyPayload {
  com_name: string;
  com_prefix: string;
  com_status: number;
}

export interface UpdateCompanyPayload extends CreateCompanyPayload {
  com_id: number;
}
