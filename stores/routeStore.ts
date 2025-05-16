// src/store/routeStore.ts
import { create } from 'zustand';
import { Route } from '@/types/types';

import { RouteService } from '@/services/route.service';
import { RouteData } from '@/types/types';

import { CreateRoutePayload, UpdateRoutePayload } from '@/payloads/route.payload';

interface RouteStore {
  routeData: Route;
  isLoading: boolean;
  setRouteData: (newData: Route) => void;
  addRoute: (newRoute: CreateRoutePayload) => Promise<{ success: boolean; message?: string }>;
  updateRoute: (
    id: number,
    updatedRoute: UpdateRoutePayload
  ) => Promise<{ success: boolean; message?: string }>;
  updateRouteStatus: (
    id: number,
    status: number
  ) => Promise<{ success: boolean; message?: string }>;
  deleteRoute: (
    id: number,
  ) => Promise<{ success: boolean; message?: string }>;
  getRouteById: (id: number) => Promise<RouteData | undefined>;
  getRoutes: (page: number, size: number, search: string, status: string) => Promise<void>;
};

export const useRouteStore = create<RouteStore>((set) => ({
  routeData: {
    data: [],
    page: 1,
    size: 10,
    total: 0,
    totalPages: 0
  },
  isLoading: false,

  setRouteData: (newData) => set({ routeData: newData }),

  addRoute: async (
    newRoute
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const payload: CreateRoutePayload = {
        route_name_th: newRoute.route_name_th,
        route_name_en: newRoute.route_name_en,
        route_color: newRoute.route_color,
        route_status: Number(newRoute.route_status),
        route_com_id: Number(newRoute.route_com_id),
        route_date_id: Number(newRoute.route_date_id),
        route_time_id: Number(newRoute.route_time_id),
        route_array: newRoute.route_array
      };
      await RouteService.createRoute(payload);
      return { success: true };
    } catch (error) {
      console.error("create route error:", error);
      return { success: false, message: (error as any)?.message || "Unknown error" };
    }
  },

  updateRoute: async (
    id,
    updatedRoute
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const payload: UpdateRoutePayload = {
        route_id: Number(id),
        route_name_th: updatedRoute.route_name_th,
        route_name_en: updatedRoute.route_name_en,
        route_color: updatedRoute.route_color,
        route_status: Number(updatedRoute.route_status),
        route_com_id: Number(updatedRoute.route_com_id),
        route_date_id: Number(updatedRoute.route_date_id),
        route_time_id: Number(updatedRoute.route_time_id),
        route_array: updatedRoute.route_array
      };
      await RouteService.updateRoute(id, payload);
      return { success: true };
    } catch (error) {
      console.error("updateRoute error:", error);
      return { success: false, message: (error as any)?.message || "Unknown error" };
    }
  },

  updateRouteStatus: async (id, status) => {
    try {
      const payload = {
        route_status: status,
      };
      await RouteService.updateRouteStatus(id, payload);
      return { success: true };
    } catch (error) {
      console.error("updateRouteStatus error:", error);
      return {
        success: false,
        message: (error as any)?.message || "Unknown error",
      };
    }
  },

  deleteRoute: async (id): Promise<{ success: boolean; message?: string }> => {
    try {
      await RouteService.deleteRoute(id);
      return { success: true };
    } catch (error) {
      console.error("delete route error:", error);
      return { success: false, message: (error as any)?.message || "Unknown error" };
    }
  },

  getRoutes: async (page: number, size: number, search?: string, status?: string) => {
    try {
      const res = await RouteService.fetchRoutes({
        page,
        size,
        search,
        status
      }) as { result: Route };

      set({ routeData: res.result }); // อัปเดต routeData โดยตรง
    } catch (error) {
      console.error("getRoutes error:", error);
      set({
        routeData: {
          data: [],
          page: 1,
          size: 10,
          total: 0,
          totalPages: 0
        },
      }); // เคลียร์ข้อมูลกรณี error
    }
  },

  getRouteById: async (id: number): Promise<RouteData | undefined> => {
    try {
      const res = await RouteService.getRouteById(id) as { result: RouteData };
      return res.result;
    } catch (error) {
      console.error("getRouteById error:", error);
      return undefined;
    }
  }

}));


