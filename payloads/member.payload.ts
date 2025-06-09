export interface FetchMemberQuery {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  com_id?: number;
}

export interface CreateMemberPayload {
  username: string;
  password: string;
  name: string;
  role: string;
  com_id: number;
}

export interface UpdateMemberPayload {
  account_id: number;
  account_name: string;
  account_username?: string;
}

export interface UpdateMemberStatusPayload {
  id: string;
  status: number;
}

export interface UpdatePasswordPayload {
  id: string;
  password: string;
}
