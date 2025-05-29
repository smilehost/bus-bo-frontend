import { create } from "zustand";
import { DeviceService } from "@/services/device.service";
import { DevicePayload, InsertDevice } from "@/payloads/device.payload";

interface DeviceStoreProps {
    devices: DevicePayload;
    addDevice: (newData: InsertDevice) => Promise<{ success: boolean; message?: string }>;
    updateDevice: (id: number, updateDevice: InsertDevice) => Promise<{ success: boolean; message?: string }>
    deleteDevice: (
        id: number,
    ) => Promise<{ success: boolean; message?: string }>;
    getDeviceById: (id: number) => Promise<DevicePayload | undefined>;
    getDevices: (page: number, size: number, search: string, status: string, com_id: number) => Promise<void>;
    updateDeviceStatus: (
        id: number,
        status: number
    ) => Promise<{ success: boolean; message?: string }>;
    clearDevices: () => void; // ← เพิ่มตรงนี้

}

export const useDeviceStore = create<DeviceStoreProps>((set) => ({
    devices: {
        data: {
            com_id: 0,
            com_name: "",
            com_prefix: "",
            com_status: 0,
            devices: []
        },
        page: 1,
        size: 10,
        total: 0,
        totalPages: 0
    },

    // เพิ่มข้อมูลใหม่
    addDevice: async (
        newData
    ): Promise<{ success: boolean; message?: string }> => {
        try {
            const payload: InsertDevice = newData;

            await DeviceService.createDevice(payload);
            return { success: true };
        } catch (error: unknown) {
            console.error("create ticket type error:", error);
            const err = error as { message?: string };
            return { success: false, message: err.message || "Unknown error" };
        }
    },

    // อัปเดตข้อมูล
    updateDevice: async (
        id: number,
        updateDevice: InsertDevice
    ): Promise<{ success: boolean; message?: string }> => {
        try {
            await DeviceService.updateDevice(id, updateDevice);

            // ถ้า API สำเร็จ ค่อยอัปเดตใน state
            set((state) => ({
                devices: state.devices,
            }));

            return { success: true };
        } catch (error: unknown) {
            console.error("update ticket type error:", error);
            const err = error as { message?: string };
            return {
                success: false,
                message: err.message || "Unknown error during update",
            };
        }
    },

    deleteDevice: async (id): Promise<{ success: boolean; message?: string }> => {
        try {
            const res = await DeviceService.deleteDevice(id) as { message: string };
            return {
                success: true,
                message: res.message || 'Deleted successfully',
            };
        } catch (error: unknown) {
            console.error("delete ticket type error:", error);
            const axiosError = error as { response?: { data?: { message?: string } }, message?: string };
            return {
                success: false,
                message:
                    axiosError?.response?.data?.message ||
                    axiosError?.message ||
                    "Unknown error",
            };
        }
    },
    getDevices: async (page: number, size: number, search?: string, status?: string, com_id?: number) => {
        try {
            const res = await DeviceService.getDevices({
                page,
                size,
                search,
                status,
                com_id
            }) as { result: DevicePayload };

            set({ devices: res.result }); // อัปเดต routeData โดยตรง
        } catch (error) {
            console.error(error);
            set({
                devices: {
                    data: {
                        com_id: 0,
                        com_name: "",
                        com_prefix: "",
                        com_status: 0,
                        devices: []
                    },
                    page: 1,
                    size: 10,
                    total: 0,
                    totalPages: 0
                },
            }); // เคลียร์ข้อมูลกรณี error
        }
    },
    getDeviceById: async (id: number): Promise<DevicePayload | undefined> => {
        try {
            const res = await DeviceService.getDeviceById(id) as { result: DevicePayload };
            return res.result;
        } catch (error) {
            console.error("getRouteById error:", error);
            return undefined;
        }
    },
    updateDeviceStatus: async (id, status) => {
        try {
            const payload = {
                status: status,
            };
            await DeviceService.updateDeviceStatus(id, payload);
            return { success: true };
        } catch (error: unknown) {
            console.error("updateRouteStatus error:", error);

            let message = "Unknown error";
            if (error instanceof Error) {
                message = error.message;
            }

            return { success: false, message };
        }
    },
    clearDevices: () => {
        set({
            devices: {
                data: {
                    com_id: 0,
                    com_name: "",
                    com_prefix: "",
                    com_status: 0,
                    devices: [],
                },
                page: 1,
                size: 10,
                total: 0,
                totalPages: 0,
            },
        });
    },


}));
