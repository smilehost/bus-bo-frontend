// src/services/time.service.ts
import { api } from "./axios.service";

// Type สำหรับข้อมูลจาก backend
export interface RouteTime {
  route_time_id: number;
  route_time_name: string;
  route_time_array: string[];
  route_time_com_id: number;
  status?: string;
}

// Type สำหรับข้อมูลหลังแปลงเพื่อใช้ใน frontend
export interface TimeItem {
  id: number;
  name: string;
  schedule: string[];
  status: string;
}

export interface FetchTimesResult {
  data: TimeItem[];
  total: number;
}

export const TimeService = {
  async fetchTimes(
    page: number,
    size: number,
    search?: string,
    status?: string
  ): Promise<FetchTimesResult> {
    const res = await api.get<{
      data?: RouteTime[];
      total?: number;
    }>({
      path: "/api/times",
      body: {
        page,
        size,
        search,
        status,
      },
    });

    const rawData = res?.data || [];
    const total = res?.total ?? rawData.length;

    const data: TimeItem[] = rawData.map((item) => ({
      id: item.route_time_id,
      name: item.route_time_name,
      schedule: item.route_time_array,
      status: item.status ?? "Active",
    }));

    return { data, total };
  },

  async createTime(data: {
    name: string;
    schedule: string[];
    status?: string;
  }) {
    return await api.post({
      path: "/api/times",
      body: {
        routeTimeName: data.name,
        routeTimeArray: data.schedule,
        routeTimeComIdd: 1, 
      },
    });
  },

  async updateTime(
    id: number,
    data: { name: string; schedule: string[]; status?: string }
  ) {
    return await api.put({
      path: `/api/times`,
      params: id,
      body: {
        route_time_id: id, 
        route_time_name: data.name,
        route_time_array: data.schedule.join(","), 
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
