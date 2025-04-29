import { LocationService } from "@/services/location.service";
import { LocationItem } from "@/types/location.type";
import {
  CreateLocationPayload,
  UpdateLocationPayload,
} from "@/payloads/location.payload";

export const ManageLocationController = {
  async fetchLocations(page: number, size: number, search?: string) {
    try {
      const res = (await LocationService.fetchLocations({
        page,
        size,
        search,
      })) as { result: any[] };
      console.log("DEBUG fetchLocations response:", res);

      const rawData = res.result || [];
      const total = rawData.length;

      const data: LocationItem[] = rawData.map((item: any) => ({
        id: item.route_location_id,
        name: item.route_location_name,
        lat: item.route_location_lat,
        long: item.route_location_long,
      }));

      return { data, total };
    } catch (error) {
      console.error("FetchLocations error:", error);
      throw error;
    }
  },

  async getLocationById(id: number): Promise<LocationItem> {
    const res = (await LocationService.getLocationById(id)) as any;
    return {
      id: res.route_location_id,
      name: res.route_location_name,
      lat: res.route_location_lat,
      long: res.route_location_long,
    };
  },

  async createLocation(location: LocationItem) {
    const payload: CreateLocationPayload = {
      route_location_name: location.name,
      route_location_lat: location.lat,
      route_location_long: location.long,
      route_location_com_id: 1,
    };
    return await LocationService.createLocation(payload);
  },

  async updateLocation(id: number, location: LocationItem) {
    const payload: UpdateLocationPayload = {
      route_location_id: id,
      route_location_name: location.name,
      route_location_lat: location.lat,
      route_location_long: location.long,
      route_location_com_id: 1,
    };
    return await LocationService.updateLocation(id, payload);
  },

  async deleteLocation(id: number) {
    return await LocationService.deleteLocation(id);
  },
};
