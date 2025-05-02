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
        data: any[];
        total: number;
      };
      const data: TimeItem[] = res.data.map((item) => ({
        id: item.route_time_id,
        name: item.route_time_name,
        schedule: Array.isArray(item.route_time_array)
          ? item.route_time_array
          : item.route_time_array.split(",").map((t: string) => t.trim()),
      }));

      return { data, total: res.total };
    } catch (error) {
      console.error("FetchTimes error:", error);
      throw error;
    }
  },

  async createTime(name: string, schedule: string[]) {
    await TimeService.createTime({
      routeTimeName: name,
      routeTimeArray: schedule,
      routeTimeComIdd: 1,
    });
  },

  async updateTime(id: number, name: string, schedule: string[]) {
    await TimeService.updateTime(id, {
      route_time_id: id,
      route_time_name: name,
      route_time_array: schedule.join(","),
      route_time_com_id: 1,
    });
  },

  async deleteTime(id: number) {
    await TimeService.deleteTime(id);
  },
};
