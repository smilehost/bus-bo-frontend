import { api } from "@/services/axios.service";
import {
  CreateRoutePayload,
  FetchRouteQuery,
  UpdateRoutePayload,
} from "@/payloads/route.payload";

export const RouteService = {
  async fetchRoutes(query: FetchRouteQuery,
  ) {
    return await api.get({
      path: "/route",
      query: query as unknown as Record<string, string | number>,
    });
  },

  async createRoute(payload: CreateRoutePayload) {
    return await api.post({
      path: "/route",
      body: payload,
    });
  },

  async getRouteById(id: number) {
    return await api.get({
      path: "/route",
      params: id,
    });
  },

  async updateRoute(id: number, payload: UpdateRoutePayload) {
    return await api.put({
      path: "/route",
      params: id,
      body: payload,
    });
  },

  async updateRouteStatus(id: number, status: { route_status: number }) {
    return await api.put({
      path: "/route",
      params: id,
      body: status,
    });
  },

  async deleteRoute(id: number) {
    return await api.delete({
      path: "/route",
      params: id,
    });
  },
}