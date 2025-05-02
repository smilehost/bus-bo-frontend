import { api } from "./axios.service";
import {
  CreateLocationPayload,
  UpdateLocationPayload,
  FetchLocationsQuery,
} from "@/payloads/location.payload";

export const LocationService = {
  async fetchLocations(query: FetchLocationsQuery) {
    return await api.get({
      path: "/api/routeLocations/all",
      query: query as unknown as Record<string, string | number>,
    });
  },

  async getLocationById(id: number) {
    return await api.get({
      path: "/api/routeLocations",
      params: id,
    });
  },

  async createLocation(payload: CreateLocationPayload) {
    return await api.post({
      path: "/api/routeLocations",
      body: payload,
    });
  },

  async updateLocation(id: number, payload: UpdateLocationPayload) {
    return await api.put({
      path: "/api/routeLocations",
      params: id,
      body: payload,
    });
  },

  async deleteLocation(id: number) {
    return await api.delete({
      path: "/api/routeLocations",
      params: id,
    });
  },
};
