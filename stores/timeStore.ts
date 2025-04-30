import { create } from "zustand";
import { TimeItem } from "@/types/time.type";
import { TimeService } from "@/services/time.service";
import { CreateTimePayload, UpdateTimePayload } from "@/payloads/time.payload";

interface TimeState {
  times: TimeItem[];
  total: number;
  isLoading: boolean;
  getTimes: (page: number, size: number, search?: string) => Promise<void>;
  createTime: (name: string, schedule: string[]) => Promise<void>;
  updateTime: (id: number, name: string, schedule: string[]) => Promise<void>;
  deleteTime: (id: number) => Promise<void>;
}

export const useTimeStore = create<TimeState>((set) => ({
  times: [],
  total: 0,
  isLoading: false,

  getTimes: async (page, size, search) => {
    set({ isLoading: true });
    try {
      const res = (await TimeService.fetchTimes({ page, size, search })) as {
        result: any[];
      };
      const rawData = res.result || [];

      const mapped: TimeItem[] = rawData.map((item: any) => ({
        id: item.route_time_id,
        name: item.route_time_name,
        schedule: Array.isArray(item.route_time_array)
          ? item.route_time_array
          : item.route_time_array
              .split(",")
              .map((t: string) => t.trim())
              .filter((t: string) => t),
      }));

      set({ times: mapped, total: mapped.length });
    } catch (error) {
      console.error("getTimes error:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  createTime: async (name: string, schedule: string[]) => {
    try {
      const payload: CreateTimePayload = {
        route_time_name: name,
        route_time_array: schedule,
        route_time_com_id: 1,
      };
      await TimeService.createTime(payload);
    } catch (error) {
      console.error("createTime error:", error);
    }
  },

  updateTime: async (id, name, schedule: string[]) => {
    try {
      const payload: UpdateTimePayload = {
        route_time_id: id,
        route_time_name: name,
        route_time_array: schedule.join(","),
        route_time_com_id: 1,
      };
      await TimeService.updateTime(id, payload);
    } catch (error) {
      console.error("updateTime error:", error);
    }
  },

  deleteTime: async (id) => {
    try {
      await TimeService.deleteTime(id);
    } catch (error) {
      console.error("deleteTime error:", error);
    }
  },
}));
