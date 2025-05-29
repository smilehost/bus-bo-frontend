import { InsertTicketDiscount } from "@/payloads/route.ticket.discount.payload";
import { api } from "@/services/axios.service";

export const RouteTicketDiscountService = {

    async getTicketDiscount() {
        return await api.get({
            path: "/ticketdiscount/all"
        });
    },

    async getTicketDiscountById(id: number) {
        return await api.get({
            path: "/ticketdiscount",
            params: id,
        });
    },

    async createTicketDiscount(payload: InsertTicketDiscount) {
        return await api.post({
            path: "/ticketdiscount",
            body: payload,
        });
    },

    async updateTicketDiscount(id: number, payload: InsertTicketDiscount) {
        return await api.put({
            path: "/ticketdiscount",
            params: id,
            body: payload,
        });
    },

    async updateTicketDiscountStatus(id: number, payload: { ticket_discount_status: number }) {
        return await api.put({
            path: "/ticketdiscount/changeStatus",
            params: id,
            body: payload,
        });
    },

    async deleteTicketDiscount(id: number) {
        return await api.delete({
            path: "/ticketdiscount",
            params: id,
        });
    },
}