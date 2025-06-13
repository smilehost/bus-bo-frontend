// src/store/ticketStore.ts
import { create } from 'zustand';
import { Ticket, TicketProps } from '@/types/types';

import { RouteTicketService } from '@/services/route.ticket.service';
import { CreateRouteTicketPayload, RoutePriceTicket, UpdateRouteTicketPayload } from '@/payloads/route.ticket.payload';


type TicketStore = {
    ticketData: TicketProps[];
    ticketDataList: Ticket;
    setTicketData: (newData: TicketProps[]) => void;
    addTicket: (newTicket: CreateRouteTicketPayload) => void;
    updateTicket: (id: number, updatedTicket: UpdateRouteTicketPayload) => Promise<{ success: boolean; message?: string }>
    updateTicketStatus: (id: number, status: number) => Promise<{ success: boolean; message?: string }>
    deleteTicket: (
        id: number,
    ) => Promise<{ success: boolean; message?: string }>;
    getTicketByRouteId: (id: number) => Promise<TicketProps[] | undefined>;
    getTicketById: (id: number) => Promise<TicketProps | undefined>;
    getTickets: (page: number, size: number, search: string, status: string) => Promise<void>;
};

export const useTicketStore = create<TicketStore>((set) => ({
    ticketData: [],
    ticketDataList: {
        data: [],
        page: 1,
        size: 10,
        total: 0,
        totalPages: 0
    },

    // ฟังก์ชันการตั้งค่าข้อมูล
    setTicketData: (newData) => set({ ticketData: newData }),

    getTickets: async (page: number, size: number, search?: string, status?: string) => {
        try {
            const res = await RouteTicketService.fetchTickets({
                page,
                size,
                search,
                status
            }) as { result: { data: UpdateRouteTicketPayload[]; page: number; size: number; total: number; totalPages: number } };

            const rawData = res.result.data as UpdateRouteTicketPayload[];

            const transformedData: TicketProps[] = rawData.map((item) => ({
                id: String(item.route_ticket_id),
                ticketName_th: item.route_ticket_name_th,
                ticketName_en: item.route_ticket_name_en,
                ticket_type: item.route_ticket_type,
                ticket_amount: String(item.route_ticket_amount),
                ticket_color: item.route_ticket_color,
                ticket_status: item.route_ticket_status,
                route_id: String(item.route_ticket_route_id),
                route: item.route
            }));

            set({
                ticketDataList: {
                    ...res.result,
                    data: transformedData,
                },
            });
        } catch (error) {
            console.error("getTicket error:", error);
            set({
                ticketDataList: {
                    data: [],
                    page: 1,
                    size: 10,
                    total: 0,
                    totalPages: 0
                },
            });
        }
    },

    // ฟังก์ชันการเพิ่มข้อมูล
    addTicket: async (
        newTicket
    ): Promise<{ success: boolean; message?: string }> => {
        try {
            const payload: CreateRouteTicketPayload = newTicket;
            await RouteTicketService.createTicket(payload);
            return { success: true };
        } catch (error: unknown) {
            console.error("create route error:", error);

            let errorMessage = "Unknown error";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            return { success: false, message: errorMessage };
        }
    },

    // ฟังก์ชันการอัปเดตข้อมูล
    updateTicket: async (
        id: number,
        updatedTicket: UpdateRouteTicketPayload
    ): Promise<{ success: boolean; message?: string }> => {
        try {
            await RouteTicketService.updateTicket(id, updatedTicket);

            // ถ้า API สำเร็จ ค่อยอัปเดตใน state
            set((state) => ({
                ticketData: state.ticketData.map((ticket) =>
                    Number(ticket.id) === id ? { ...ticket, ...updatedTicket } : ticket
                ),
            }));

            return { success: true };
        } catch (error: unknown) {
            console.error("update route error:", error);

            let errorMessage = "Unknown error during update";
            if (error instanceof Error) {
                errorMessage = error.message;
            }

            return {
                success: false,
                message: errorMessage,
            };
        }
    },

    updateTicketStatus: async (id, status) => {
        try {
            await RouteTicketService.updateTicketStatus(id, { route_ticket_status: status });

            // อัปเดตสถานะใน state ทันที
            set((state) => ({
                ticketData: state.ticketData.map((ticket) =>
                    Number(ticket.id) === id
                        ? { ...ticket, ticket_status: status }
                        : ticket
                ),
            }));
            return { success: true };
        } catch (error: unknown) {
            console.error("updateTicketStatus error:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Unknown error during update",
            };
        }
    },

    // ฟังก์ชันการลบข้อมูล
    deleteTicket: async (id: number): Promise<{ success: boolean; message?: string }> => {
        try {
            await RouteTicketService.deleteTicket(id);
            return { success: true };
        } catch (error: unknown) {
            console.error("delete ticket error:", error);

            let errorMessage = "Unknown error";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            return { success: false, message: errorMessage };
        }
    },

    getTicketById: async (id: number): Promise<TicketProps | undefined> => {
        try {
            const res = await RouteTicketService.getTicketById(id) as { route_ticket: UpdateRouteTicketPayload; route_ticket_price: RoutePriceTicket[] };
            const ticket = res.route_ticket;
            const price = res.route_ticket_price;

            const merged: TicketProps = {
                id: ticket.route_ticket_id.toString(),
                ticketName_th: ticket.route_ticket_name_th,
                ticketName_en: ticket.route_ticket_name_en,
                ticket_type: ticket.route_ticket_type,
                ticket_amount: ticket.route_ticket_amount.toString(),
                ticket_color: ticket.route_ticket_color,
                ticket_status: ticket.route_ticket_status,
                route_id: ticket.route_ticket_route_id.toString(),
                ticket_price: price?.map((priceItem: RoutePriceTicket) => ({
                    id: priceItem.route_ticket_price_id,
                    from: priceItem.route_ticket_location_start?.toString(),
                    to: priceItem.route_ticket_location_stop?.toString(),
                    price: Number(priceItem.price), // แปลงจาก string เป็น number
                    ticket_price_type_id: priceItem.route_ticket_price_type_id?.toString(),
                    route_ticket_price_id: priceItem.route_ticket_price_id?.toString(),
                })) || [],
            };

            return merged;
        } catch (error) {
            console.error("getTicketById error:", error);
            return undefined;
        }
    },

    getTicketByRouteId: async (id: number): Promise<TicketProps[] | undefined> => {
        try {
            const res = await RouteTicketService.getTicketByRoute(id) as { result: UpdateRouteTicketPayload[] };

            const mappedTickets: TicketProps[] = res.result.map((ticket) => ({
                id: ticket.route_ticket_id?.toString(),
                ticketName_th: ticket.route_ticket_name_th,
                ticketName_en: ticket.route_ticket_name_en,
                ticket_type: ticket.route_ticket_type,
                ticket_amount: ticket.route_ticket_amount?.toString(),
                ticket_color: ticket.route_ticket_color,
                ticket_status: ticket.route_ticket_status,
                route_id: ticket.route_ticket_route_id?.toString(),

                // ✅ map ticket_price ให้มีโครงสร้างที่ต้องการ
                ticket_price: ticket.route_ticket_price?.map((priceItem: RoutePriceTicket) => ({
                    id: priceItem.route_ticket_price_id,
                    from: priceItem.route_ticket_location_start?.toString(),
                    to: priceItem.route_ticket_location_stop?.toString(),
                    price: Number(priceItem.price), // แปลงจาก string เป็น number
                    ticket_price_type_id: priceItem.route_ticket_price_type_id?.toString(),
                    route_ticket_price_id: priceItem.route_ticket_price_id?.toString(),
                })) || [],
            }));

            return mappedTickets;
        } catch (error) {
            console.error("getTicketByRouteId error:", error);
            return undefined;
        }
    }

}));
