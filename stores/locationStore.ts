// src/stores/location.store.ts
import { create } from "zustand";
import { LocationItem } from "@/types/location";
import { LocationService } from "@/services/location.service";
import { CreateLocationPayload, UpdateLocationPayload } from "@/payloads/location.payload";
import { getComId } from "@/utils/getComId";

interface LocationState {
  locations: LocationItem[];
  total: number;
  isLoading: boolean;
  getLocations: (page: number, size: number, search?: string) => Promise<void>;
  createLocation: (location: LocationItem) => Promise<void>;
  updateLocation: (id: number, location: LocationItem) => Promise<void>;
  deleteLocation: (id: number) => Promise<void>;
  getLocationById: (id: number) => Promise<LocationItem | undefined>;
}
const  com_id  = getComId();

export const useLocationStore = create<LocationState>((set) => ({
  locations: [],
  total: 0,
  isLoading: false,
  

  getLocations: async (page, size, search) => {
    set({ isLoading: true });
    try {
      const res = (await LocationService.fetchLocations({ page, size, search })) as {
        result: UpdateLocationPayload[];
      };

      const rawData = res.result || [];
      const mapped: LocationItem[] = rawData.map((item: UpdateLocationPayload) => ({
        id: item.route_location_id,
        name: item.route_location_name,
        lat: item.route_location_lat,
        long: item.route_location_long,
      }));

      set({ locations: mapped, total: mapped.length });
    } catch (error) {
      console.error("fetchLocations error:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  createLocation: async (location) => {
    const payload: CreateLocationPayload = {
      route_location_name: location.name,
      route_location_lat: location.lat,
      route_location_long: location.long,
      route_location_com_id: com_id!,
    };
    await LocationService.createLocation(payload);
  },

  updateLocation: async (id, location) => {
    const payload: UpdateLocationPayload = {
      route_location_id: id,
      route_location_name: location.name,
      route_location_lat: location.lat,
      route_location_long: location.long,
      route_location_com_id: com_id!,
    };
    await LocationService.updateLocation(id, payload);
  },

  deleteLocation: async (id) => {
    await LocationService.deleteLocation(id);
  },

  getLocationById: async (id: number): Promise<LocationItem | undefined> => {
    try {
      const res = await LocationService.getLocationById(id) as { result: UpdateLocationPayload };
      const item = res.result;

      const mapped: LocationItem = {
        id: item.route_location_id,
        name: item.route_location_name,
        lat: item.route_location_lat,
        long: item.route_location_long,
      };

      return mapped;
    } catch (error) {
      console.error("getRouteById error:", error);
      return undefined;
    }
  },
}));
