// src/store/routeStore.ts
import { create } from 'zustand';
import { Route } from '@/types/types';

import { RouteService } from '@/services/route.service';

interface RouteStore {
  routeData: Route[];
  setRouteData: (newData: Route[]) => void;
  addRoute: (newRoute: Route) => void;
  updateRoute: (id: string, updatedRoute: Route) => void;
  deleteRoute: (id: string) => void;
  getRouteById: (id: number) => Promise<Route | undefined>;
  getRoutes: (page: number, size: number, search: string) => Promise<void>;
};

// interface RouteState {
//   page: number,
//   size: number,
//   total: number,
//   totalPages: number,
//   data: [
//     {
//       route_id: number,
//       route_name_th: string,
//       route_name_en: string,
//       route_color: string,
//       route_status: number,
//       route_com_id: number,
//       route_date_id: number,
//       route_time_id: number,
//       route_array: string
//     },
//   ]
// }

// export const fetchRoutesFromApi = async () => {
//     try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/route/2`, {
//             headers: {
//                 'com_id': 1,
//             }
//         }); // เปลี่ยน URL ตาม API จริง
//         const routes: Route[] = response.data;

//         useRouteStore.getState().setRouteData(routes); // อัปเดต store
//     } catch (error) {
//         console.error('Failed to fetch routes:', error);
//     }
// };

export const useRouteStore = create<RouteStore>((set, get) => ({
  routeData: [],

  setRouteData: (newData) => set({ routeData: newData }),

  addRoute: (newRoute) =>
    set((state) => ({
      routeData: [...state.routeData, newRoute],
    })),

  updateRoute: (id, updatedRoute) =>
    set((state) => ({
      routeData: state.routeData.map((route) =>
        route.id === id ? updatedRoute : route
      ),
    })),

  deleteRoute: (id) =>
    set((state) => ({
      routeData: state.routeData.filter((route) => route.route_id !== id),
    })),

  getRoutes: async (page: number, size: number, search?: string) => {
    try {
      const res = await RouteService.fetchRoutes({
        page,
        size,
        search,
      }) as { result: Route[] };

      set({ routeData: res.result }); // อัปเดต routeData โดยตรง
    } catch (error) {
      console.error("getRoutes error:", error);
      set({ routeData: [] }); // เคลียร์ข้อมูลกรณี error
    }
  },

  getRouteById: async (id: number): Promise<Route | undefined> => {
    try {
      const res = await RouteService.getRouteById(id) as { result: Route };
      return res.result;
    } catch (error) {
      console.error("getRouteById error:", error);
      return undefined;
    }
  }
  
}));


