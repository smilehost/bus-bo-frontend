import { api } from "@/services/axios.service";
import {
    CreateRoutePayload,
    FetchRouteQuery,
} from "@/payloads/route.payload";

export const RouteService = {
    async fetchRoutes(query: FetchRouteQuery,
    ) {
        return await api.get({
            path: "/api/route",
            query: query as unknown as Record<string, string | number>,
        });
    },

    async createRoute(payload: CreateRoutePayload) {
        return await api.post({
            path: "/api/route",
            body: payload,
        });
    },

    async getRouteById(id: number) {
        return await api.get({
            path: "/api/route",
            params: id,
        });
    },
}