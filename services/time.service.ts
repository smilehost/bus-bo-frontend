import { api } from "./axios.service";
import {
  CreateTimePayload,
  UpdateTimePayload,
  FetchTimesQuery,
} from "../payloads/time.payload";

export const TimeService = {
  async fetchTimes(query: FetchTimesQuery) {
    return await api.get({
      path: "/routeTimes/all",
      query: query as unknown as Record<string, string | number>,
    });
  },

  async getTimeById(id: number) {
    return await api.get({
      path: "/routeTimes",
      params: id,
    });
  },

  async createTime(payload: CreateTimePayload) {
    return await api.post({
      path: "/routeTimes",
      body: payload,
    });
  },

  async updateTime(id: number, payload: UpdateTimePayload) {
    return await api.put({
      path: "/routeTimes",
      params: id,
      body: payload,
    });
  },

  async deleteTime(id: number) {
    return await api.delete({
      path: "/routeTimes",
      params: id,
    });
  },
};
