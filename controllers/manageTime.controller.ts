import { TimeService } from "../services/time.service";
import { TimeItem, FetchTimesResult } from "../types/time.type";

export const ManageTimeController = {
  async fetchTimes(
    page: number,
    size: number,
    search?: string
  ): Promise<FetchTimesResult> {
    try {
      const res = (await TimeService.fetchTimes({ page, size, search })) as {
        result: any[];
      };
      console.log("DEBUG fetchtime response:", res);

      const data: TimeItem[] = res.result.map((item: any) => ({
        id: item.route_time_id,
        name: item.route_time_name,
        schedule: Array.isArray(item.route_time_array)
          ? item.route_time_array
          : item.route_time_array.split(",").map((t: string) => t.trim()),
      }));

      return { data, total: res.result.length };
    } catch (error) {
      console.error("FetchTimes error:", error);
      throw error;
    }
  },

  async getTimeById(id: number): Promise<TimeItem> {
    const res = (await TimeService.getTimeById(id)) as any;
    return {
      id: res.route_time_id,
      name: res.route_time_name,
      schedule: Array.isArray(res.route_time_array)
        ? res.route_time_array
        : res.route_time_array.split(",").map((t: string) => t.trim()),
    };
  },

  async createTime(name: string, schedule: string[]) {
    return await TimeService.createTime({
      route_time_name: name,
      route_time_array: schedule,
      route_time_com_id: 1,
    });
  },

  async updateTime(id: number, name: string, schedule: string[]) {
    return await TimeService.updateTime(id, {
      route_time_id: id,
      route_time_name: name,
      route_time_array: schedule.join(","),
      route_time_com_id: 1,
    });
  },

  async deleteTime(id: number) {
    return await TimeService.deleteTime(id);
  },
};
