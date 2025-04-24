import { api } from "./axios.service";

export const TimeService = {
  async fetchTimes(page: number, size: number, search?: string, status?: string) {
    const res: any = await api.post({
      path: "/api/times",
      body: {
        page,
        size,
        search,
        status,
      },
    });

    const rawData = res?.data || [];
    return {
      data: rawData.map((item: any) => ({
        id: item.route_time_id,
        name: item.route_time_name,
        schedule: item.route_time_array,
        status: "Active", // ถ้า backend มี status จริงให้ map มาใช้ตรงนี้
      })),
      total: res.total || rawData.length,
    };
  },

  async createTime(data: { name: string; schedule: string; status: string }) {
    return await api.post({
      path: "/api/times/create",
      body: {
        route_time_name: data.name,
        route_time_array: data.schedule,
        route_time_com_id: 1,
      },
    });
  },

  async updateTime(id: number, data: { name: string; schedule: string; status: string }) {
    return await api.put({
      path: "/api/times/update",
      params: id,
      body: {
        route_time_name: data.name,
        route_time_array: data.schedule,
        route_time_com_id: 1,
      },
    });
  },

  async deleteTime(id: number) {
    return await api.delete({
      path: "/api/times",
      params: id,
    });
  },
};
