import { api } from "@/services/axios.service";
import { CreateRouteTicketPayload, UpdateRouteTicketPayload, FetchTicketQuery } from '@/payloads/route.ticket.payload'

export const RouteTicketService = {

    async fetchTickets(query: FetchTicketQuery,
    ) {
        return await api.get({
            path: "/api/routeTicket/all",
            query: query as unknown as Record<string, string | number>,
        });
    },

    async createTicket(payload: CreateRouteTicketPayload) {
        return await api.post({
            path: "/api/routeTicket/create",
            body: payload,
        });
    },

    async getTicketById(id: number) {
        return await api.get({
            path: "/api/routeTicket/ticket",
            params: id,
        });
    },

    async getTicketByRoute(id: number) {
        return await api.get({
            path: "/api/routeTicket/route",
            params: id,
        });
    },

    async getTicketByLocation(id: number) {
        return await api.get({
            path: "/api/routeTicket",
            params: id,
        });
    },

    async getTicketPriceType() {
        return await api.get({
            path: "/api/routeTicket/priceType"
        });
    },

    async updateTicket(id: number, payload: UpdateRouteTicketPayload) {
        return await api.put({
            path: "/api/routeTicket",
            params: id,
            body: payload,
        });
    },

    async updateTicketStatus(id: number, payload: { route_ticket_status: number }) {
        return await api.put({
            path: "/api/routeTicket",
            params: `${id}/status`,
            body: payload,
        });
    },

    async deleteTicket(id: number) {
        return await api.delete({
            path: "/api/routeTicket",
            params: id,
        });
    },
}