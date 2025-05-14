// src/store/ticketStore.ts
import { create } from 'zustand';
import { TicketProps } from '@/types/types';

import { RouteTicketService } from '@/services/route.ticket.service';
import { CreateRouteTicketPayload, UpdateRouteTicketPayload } from '@/payloads/route.ticket.payload';


type TicketStore = {
    ticketData: TicketProps[];
    setTicketData: (newData: TicketProps[]) => void;
    addTicket: (newTicket: CreateRouteTicketPayload) => void;
    updateTicket: (id: number, updatedTicket: UpdateRouteTicketPayload) => Promise<{ success: boolean; message?: string }>
    deleteTicket: (id: string) => void;
    getTicketByRouteId: (id: number) => Promise<TicketProps[] | undefined>;
    getTicketById: (id: number) => Promise<TicketProps | undefined>;
};

export const useTicketStore = create<TicketStore>((set) => ({
    ticketData: [],

    // ฟังก์ชันการตั้งค่าข้อมูล
    setTicketData: (newData) => set({ ticketData: newData }),

    // ฟังก์ชันการเพิ่มข้อมูล
    addTicket: async (
        newTicket
    ): Promise<{ success: boolean; message?: string }> => {
        try {
            const payload: CreateRouteTicketPayload = newTicket;

            // console.log("From API: ",payload)
            await RouteTicketService.createTicket(payload);
            return { success: true };
        } catch (error) {
            console.error("create route error:", error);
            return { success: false, message: (error as any)?.message || "Unknown error" };
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
        } catch (error) {
            console.error("update route error:", error);
            return {
                success: false,
                message: (error as any)?.message || "Unknown error during update",
            };
        }
    },

    // ฟังก์ชันการลบข้อมูล
    deleteTicket: (id) => set((state) => ({
        ticketData: state.ticketData.filter((ticket) => ticket.id !== id),
    })),

    getTicketById: async (id: number): Promise<TicketProps | undefined> => {
        try {
            const res = await RouteTicketService.getTicketById(id);
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
                ticket_price: price?.map((priceItem: any) => ({
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
            const res = await RouteTicketService.getTicketByRoute(id) as { result: any[] };

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
                ticket_price: ticket.route_ticket_price?.map((priceItem: any) => ({
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
