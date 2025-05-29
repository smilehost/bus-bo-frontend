export interface FetchMemberQuery {
  page: number;
  size: number;
  search?: string;
  status?: string;
  companyId?: string;
}

export interface CreateMemberPayload {
  username: string;
  password: string;
  name: string;
  role: string;
}

export interface UpdateMemberPayload {
  account_id: number;
  account_name: string;
}

export interface UpdateMemberStatusPayload {
  id: string;
  status: number;
}

export interface UpdatePasswordPayload {
  id: string;
  password: string;
}
