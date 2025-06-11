import { FetchPaymentQuery, InsertPaymentPayload } from "@/payloads/payment.payload";
import { api } from "@/services/axios.service";

export const PaymentService = {
    async fetchPayment(query: FetchPaymentQuery) {
        return await api.get({
            path: "/paymentMethod",
            query: query as unknown as Record<string, string | number>,
        });
    },

    async getPaymentById(id: number) {
        return await api.get({
            path: "/paymentMethod",
            params: id,
        });
    },

    async createPayment(payload: InsertPaymentPayload) {
        return await api.post({
            path: "/paymentMethod",
            body: payload,
        });
    },

    async updatePayment(id: number, payload: InsertPaymentPayload) {
        return await api.put({
            path: "/paymentMethod",
            params: id,
            body: payload,
        });
    },

    async deletePayment(id: number) {
        return await api.delete({
            path: "/paymentMethod",
            params: id,
        });
    },

    async updatePaymentStatus(payload: { status: number, payment_method_id: number }) {
        return await api.patch({
            path: "/paymentMethod/status",
            body: payload,
        });
    },

}