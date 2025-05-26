import { create } from "zustand";

interface DeviceStoreProps {
    devices: any;

}

export const useDeviceStore = create<DeviceStoreProps>((set) => ({
    devices: [
        {
            id: 1,
            status: 0,
            serial: "1234567890",
            com_id: 1,
            com_name: "Company A",
        },
        {
            id: 2,
            status: 1,
            serial: "0987654321",
            com_id: 1,
            com_name: "Company B",
        },
        {
            id: 3,
            status: 1,
            serial: "0987654321",
            com_id: 1,
              com_name: "Company C",
        },
        {
            id: 4,
            status: 1,
            serial: "0987654321",
            com_id: 1,
              com_name: "Company D",
        },
    ],


}));
