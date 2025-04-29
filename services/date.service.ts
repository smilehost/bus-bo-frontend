import { api } from "@/services/axios.service";
import {
  CreateDatePayload,
  UpdateDatePayload,
  FetchDatesQuery,
} from "@/payloads/date.payload";

export const DateService = {
  async fetchDates(query: FetchDatesQuery) {
    return await api.get({
      path: "/api/dates",
      query: query as unknown as Record<string, string | number>,
    });
  },

  async createDate(payload: CreateDatePayload) {
    return await api.post({
      path: "/api/dates",
      body: payload,
    });
  },

  async updateDate(id: number, payload: UpdateDatePayload) {
    return await api.put({
      path: "/api/dates",
      params: id,
      body: payload,
    });
  },

  async deleteDate(id: number) {
    return await api.delete({
      path: "/api/dates",
      params: id,
    });
  },
};
