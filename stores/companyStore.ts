import { create } from "zustand";
import { CompanyItem } from "@/types/company"; 
import {
  CreateCompanyPayload,
  UpdateCompanyPayload,
  FetchCompanyQuery,
} from "@/payloads/company.payload";
import { CompanyService } from "@/services/company.service";

interface CompanyStore {
  companies: CompanyItem[]; 
  total: number;
  isLoading: boolean;

  getCompanies: (
    page: number,
    size: number,
    search?: string,
    status?: string
  ) => Promise<void>;
  createCompany: (company: Omit<CompanyItem, "id">) => Promise<void>;
  updateCompany: (id: string, company: CompanyItem) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  getCompanyById: (id: string) => Promise<CompanyItem | undefined>;
}

export const useCompanyStore = create<CompanyStore>((set) => ({
  companies: [],
  total: 0,
  isLoading: false,

  getCompanies: async (page, size, search, status) => {
    set({ isLoading: true });
    try {
      const query: FetchCompanyQuery = {
        page,
        size,
        search: search || "",
        status: status || "",
      };
      const res = await CompanyService.fetchCompanies(query);
      const rawData = (res as { result: UpdateCompanyPayload[] }).result || [];

      const mapped: CompanyItem[] = rawData.map((item: UpdateCompanyPayload) => ({
        id: item.com_id.toString(),
        name: item.com_name,
        prefix: item.com_prefix,
        status: item.com_status,
      }));

      set({ companies: mapped, total: mapped.length });
    } catch (error) {
      console.error("getCompanies error:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  createCompany: async (company) => {
    const payload: CreateCompanyPayload = {
      com_name: company.name,
      com_prefix: company.prefix,
      com_status: company.status,
    };
    await CompanyService.createCompany(payload);
  },

  updateCompany: async (id, company) => {
    const payload: UpdateCompanyPayload = {
      com_id: typeof id === "string" ? parseInt(id) : id, // ปลอดภัยทั้ง string/number
      com_name: company.name,
      com_prefix: company.prefix,
      com_status: company.status,
    };
    await CompanyService.updateCompany(typeof id === "string" ? parseInt(id, 10) : id, payload);
  },

  deleteCompany: async (id) => {
    await CompanyService.deleteCompany(id);
  },

  getCompanyById: async (id) => {
    try {
      const res = await CompanyService.fetchCompanyById(id);
      const item = (res as { result: UpdateCompanyPayload }).result;
      return {
        id: item.com_id.toString(),
        name: item.com_name,
        prefix: item.com_prefix,
        status: item.com_status,
      };
    } catch (error) {
      console.error("getCompanyById error:", error);
      return undefined;
    }
  },
}));
