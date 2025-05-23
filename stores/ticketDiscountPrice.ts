// src/store/companyStore.ts
import { InsertTicketDiscount, RouteTicketDiscount } from '@/payloads/route.ticket.discount.payload';
import { RouteTicketDiscountService } from '@/services/route.ticket.discount.service';
import { create } from 'zustand';

type TicketDiscountPriceProps = {
    ticketDiscountPrice: RouteTicketDiscount[],
    addTicketDiscount: (newDiscount: InsertTicketDiscount) => Promise<{ success: boolean; message?: string }>,
    updateTicketDiscount:  (id: number, updateDiscount: InsertTicketDiscount) => Promise<{ success: boolean; message?: string }>,
    updateTicketDiscountStatus: (id: number, status: number) => Promise<{ success: boolean; message?: string }>,
    deleteTicketDiscount: (
        id: number,
    ) => Promise<{ success: boolean; message?: string }>,
    fetchTicketDiscount: () => Promise<RouteTicketDiscount[] | undefined>
};

export const useTicketDiscountPrice = create<TicketDiscountPriceProps>((set) => ({
    ticketDiscountPrice: [],

    fetchTicketDiscount: async (): Promise<RouteTicketDiscount[] | undefined> => {
        try {
            const res = await RouteTicketDiscountService.getTicketDiscount() as {
                result: RouteTicketDiscount[];
            };

            const mapped = res.result.map((item) => ({
                ticket_discount_id: item.ticket_discount_id,
                ticket_discount_name: item.ticket_discount_name,
                ticket_discount_type: item.ticket_discount_type,
                ticket_discount_value: item.ticket_discount_value,
                ticket_discount_status: item.ticket_discount_status,
                ticket_discount_com_id: item.ticket_discount_com_id

            }));

            set({ ticketDiscountPrice: mapped });
            return mapped;
        } catch (error) {
            console.error("getTicketPriceType error:", error);
            return undefined;
        }
    },

    updateTicketDiscountStatus: async (id, status) => {
        try {
            await RouteTicketDiscountService.updateTicketDiscountStatus(id, { ticket_discount_status: status });

            // อัปเดตสถานะใน state ทันที
            set((state) => ({
                ticketDiscountPrice: state.ticketDiscountPrice.map((ticket) =>
                    Number(ticket.ticket_discount_id) === id
                        ? { ...ticket, ticket_discount_status: status }
                        : ticket
                ),
            }));
            return { success: true };
        } catch (error) {
            console.error("updateTicketDiscountStatus error:", error);
            return {
                success: false,
                message: (error as any)?.message || "Unknown error during update",
            };
        }
    },

    addTicketDiscount: async (
        newDiscount
    ): Promise<{ success: boolean; message?: string }> => {
        try {
            const payload: InsertTicketDiscount = newDiscount;

            // console.log("From API: ",payload)
            await RouteTicketDiscountService.createTicketDiscount(payload);
            return { success: true };
        } catch (error: unknown) {
            console.error("create ticket type error:", error);
            const err = error as { message?: string };
            return { success: false, message: err.message || "Unknown error" };
        }
    },

    updateTicketDiscount: async (
        id: number,
        updateDiscount: InsertTicketDiscount
    ): Promise<{ success: boolean; message?: string }> => {
        try {
            await RouteTicketDiscountService.updateTicketDiscount(id, updateDiscount);

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

    deleteTicketDiscount: async (id): Promise<{ success: boolean; message?: string }> => {
        try {
            const res = await RouteTicketDiscountService.deleteTicketDiscount(id) as { message: string };
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
}));