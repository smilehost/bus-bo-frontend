// src/stores/date.store.ts
import { create } from "zustand";
import { DateItem } from "@/types/date";
import { DateService } from "@/services/date.service";
import { CreateDatePayload, UpdateDatePayload } from "@/payloads/date.payload";
import { getComId } from "@/utils/getComId";

interface DateState {
  dates: DateItem[];
  total: number;
  isLoading: boolean;
  getDates: (
    page: number,
    size: number,
    search?: string,
    status?: string
  ) => Promise<void>;
  createDate: (date: DateItem) => Promise<void>;
  updateDate: (id: number, date: DateItem) => Promise<void>;
  deleteDate: (id: number) => Promise<void>;
  getDateById: (id: number) => Promise<DateItem | undefined>;
}
const com_id = getComId();

export const useDateStore = create<DateState>((set) => ({
  dates: [],
  total: 0,
  isLoading: false,

  getDates: async (page, size, search, status) => {
    set({ isLoading: true });
    try {
      const res = (await DateService.fetchDates({
        page,
        size,
        search,
        status,
      })) as { result: UpdateDatePayload[] };
      const rawData = res.result || [];
      const today = new Date();
      const todayStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      const mapped: DateItem[] = rawData.map((item: any) => {
        const endDate = new Date(item.route_date_end);
        const endDateStart = new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate()
        );

        return {
          id: item.route_date_id,
          name: item.route_date_name,
          startDate: item.route_date_start,
          endDate: item.route_date_end,
          days: {
            mon: item.route_date_mon === 1,
            tue: item.route_date_tue === 1,
            wed: item.route_date_wen === 1,
            thu: item.route_date_thu === 1,
            fri: item.route_date_fri === 1,
            sat: item.route_date_sat === 1,
            sun: item.route_date_sun === 1,
          },
          status: endDateStart < todayStart ? 0 : 1, // Assuming 0 for "Inactive" and 1 for "Active"
        };
      });
      set({ dates: mapped, total: mapped.length });
    } catch (error) {
      console.error("fetchDates error:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  createDate: async (date) => {
    const payload: CreateDatePayload = {
      route_date_name: date.name,
      route_date_start: date.startDate,
      route_date_end: date.endDate,
      route_date_mon: date.days.mon ? 1 : 0,
      route_date_tue: date.days.tue ? 1 : 0,
      route_date_wen: date.days.wed ? 1 : 0,
      route_date_thu: date.days.thu ? 1 : 0,
      route_date_fri: date.days.fri ? 1 : 0,
      route_date_sat: date.days.sat ? 1 : 0,
      route_date_sun: date.days.sun ? 1 : 0,
      route_date_com_id: com_id!,
    };
    await DateService.createDate(payload);
  },

  updateDate: async (id, date) => {
    const payload: UpdateDatePayload = {
      route_date_id: id,
      route_date_name: date.name,
      route_date_start: date.startDate,
      route_date_end: date.endDate,
      route_date_mon: date.days.mon ? 1 : 0,
      route_date_tue: date.days.tue ? 1 : 0,
      route_date_wen: date.days.wed ? 1 : 0,
      route_date_thu: date.days.thu ? 1 : 0,
      route_date_fri: date.days.fri ? 1 : 0,
      route_date_sat: date.days.sat ? 1 : 0,
      route_date_sun: date.days.sun ? 1 : 0,
      route_date_com_id: com_id!,
    };
    await DateService.updateDate(id, payload);
  },

  getDateById: async (id: number): Promise<DateItem | undefined> => {
    try {
      const res = (await DateService.fetchDateById(id)) as { result: DateItem };
      return res.result;
    } catch (error) {
      console.error("getRouteById error:", error);
      return undefined;
    }
  },

  deleteDate: async (id) => {
    await DateService.deleteDate(id);
  },
}));
