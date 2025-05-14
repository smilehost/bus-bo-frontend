import { api } from "@/services/axios.service";
import {
  FetchCompanyQuery,
  CreateCompanyPayload,
  UpdateCompanyPayload,
} from "@/payloads/company.payload";

export const CompanyService = {
  async fetchCompanies(query: FetchCompanyQuery) {
    return await api.get({
      path: "/api/company/all",
      query: query as unknown as Record<string, string | number>,
    });
  },

  async fetchCompanyById(id: string) {
    return await api.get({
      path: "/api/company",
      params: id,
    });
  },

  async createCompany(payload: CreateCompanyPayload) {
    return await api.post({
      path: "/api/company",
      body: payload,
    });
  },

  async updateCompany(id: number, payload: UpdateCompanyPayload) {
    return await api.put({
      path: "/api/company",
      params: id,
      body: payload,
    });
  },

  async deleteCompany(id: string) {
    return await api.delete({
      path: "/api/company",
      params: id,
    });
  },
};
