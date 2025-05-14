import { api } from "@/services/axios.service";

export const RouteTicketPriceTypeService = {

    async getTicketPriceType() {
        return await api.get({
            path: "/api/routeTicket/priceType"
        });
    },

}