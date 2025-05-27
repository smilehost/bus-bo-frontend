import { UpdateCompanyPayload } from "./company.payload";

export interface InsertDevice {
    device_serial_number: string,

}

export interface DeviceDataPayload {
    device_id: number,
    device_com_id: number,
    device_serial_number: string,
    device_status: number,
}

export interface DeviceCompanyPayload extends UpdateCompanyPayload {
    devices: DeviceDataPayload[];
}

export interface DevicePayload {
    page: number;
    size: number;
    total: number;
    totalPages: number;
    data: DeviceCompanyPayload[];
}

export interface FetchDeviceQuery {
    page: number;
    size: number;
    search?: string;
    status?: string; // Added status property
}