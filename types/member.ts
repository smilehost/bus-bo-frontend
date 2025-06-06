export type MemberItem = {
  id: string;              // account_id
  username: string;        // account_username
  name: string;            // account_name
  role: string;            // account_role
  status: number;          // account_status
  com_id: number;       // account_com_id
};

export interface FetchMembersResult {
  data: MemberItem[];
  total: number;
}
