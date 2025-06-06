import { CreateRouteTicketPriceType, RouteTicketPriceType } from "@/payloads/route.ticket.type.payload";
import { api } from "@/services/axios.service";

export const RouteTicketPriceTypeService = {

    async getTicketPriceType() {
        return await api.get({
            path: "/ticketPriceType"
        });
    },

    async createTicketType(payload: CreateRouteTicketPriceType) {
        return await api.post({
            path: "/ticketPriceType",
            body: payload,
        });
    },

    async updateTicketType(id: number, payload: RouteTicketPriceType) {
        return await api.put({
            path: "/ticketPriceType",
            params: id,
            body: payload,
        });
    },

    async deleteTicketType(id: number) {
        return await api.delete({
            path: "/ticketPriceType",
            params: id,
        });
    },
}