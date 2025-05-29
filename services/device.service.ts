import { FetchDeviceQuery, InsertDevice } from "@/payloads/device.payload";
import { api } from "@/services/axios.service";

export const DeviceService = {

    async getDevices(query: FetchDeviceQuery,
    ) {
        return await api.get({
            path: "/device",
            query: query as unknown as Record<string, string | number>,
        });
    },

    async getDeviceById(id: number) {
        return await api.get({
            path: "/device",
            params: id,
        });
    },

    async createDevice(payload: InsertDevice) {
        return await api.post({
            path: "/device",
            body: payload,
        });
    },

    async updateDevice(id: number, payload: InsertDevice) {
        return await api.put({
            path: "/device",
            params: id,
            body: payload,
        });
    },

    async updateDeviceStatus(id: number, payload: { status: number }) {
        return await api.patch({
            path: "/device",
            params: `${id}/status`,
            body: payload,
        });
    },

    async deleteDevice(id: number) {
        return await api.delete({
            path: "/device",
            params: id,
        });
    },
}