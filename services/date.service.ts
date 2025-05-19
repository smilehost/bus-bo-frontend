import { api } from "@/services/axios.service";
import {
  CreateDatePayload,
  UpdateDatePayload,
  FetchDatesQuery,
} from "@/payloads/date.payload";

export const DateService = {
  async fetchDates(query: FetchDatesQuery) {
    return await api.get({
      path: "/routeDates/all",
      query: query as unknown as Record<string, string | number>,
    });
  },

  async fetchDateById(id: number) {
    return await api.get({
      path: "/routeDates",
      params: id,
    });
  },

  async createDate(payload: CreateDatePayload) {
    return await api.post({
      path: "/routeDates",
      body: payload,
    });
  },

  async updateDate(id: number, payload: UpdateDatePayload) {
    return await api.put({
      path: "/routeDates",
      params: id,
      body: payload,
    });
  },

  async deleteDate(id: number) {
    return await api.delete({
      path: "/routeDates",
      params: id,
    });
  },
};
