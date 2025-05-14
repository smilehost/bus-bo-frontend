export type CompanyItem = {
  id: string;          // com_id (string เพื่อรองรับกับระบบ Next.js หรือแปลงเป็น string จาก number)
  name: string;        // com_name
  prefix: string;      // com_prefix
  status: number;      // com_status (1 = Active, 0 = Inactive)
};

export interface FetchCompaniesResult {
  data: CompanyItem[];
  total: number;
}
