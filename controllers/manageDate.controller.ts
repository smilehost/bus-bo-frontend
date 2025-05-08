// src/controllers/manageDate.controller.ts
import { DateService } from "@/services/date.service";
import { DateItem } from "@/types/date.type";
import { CreateDatePayload, UpdateDatePayload } from "@/payloads/date.payload";

export const ManageDateController = {
    async fetchDates(page: number, size: number, search?: string, status?: string) {
    const res = await DateService.fetchDates({ page, size, search, status });
    const rawData = Array.isArray(res) ? res : [];
    const total = rawData.length; 

    const data: DateItem[] = rawData.map((item: any) => ({
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
      status:
        new Date(item.route_date_end) < new Date() ? "Inactive" : "Active",
    }));
    return { data, total };
  },

  async createDate(date: DateItem) {
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
      route_date_com_id: 1,
    };
    return await DateService.createDate(payload);
  },

  async updateDate(id: number, date: DateItem) {
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
      route_date_com_id: 1,
    };
    return await DateService.updateDate(id, payload);
  },

  async deleteDate(id: number) {
    return await DateService.deleteDate(id);
  },
};
