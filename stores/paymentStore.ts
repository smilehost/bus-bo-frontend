import { create } from 'zustand';
import { PaymentService } from '@/services/payment.service'; // <- คุณต้องสร้างไฟล์นี้แยกต่างหาก
import { FetchPaymentQuery, getPaymentPayload, InsertPaymentPayload } from '@/payloads/payment.payload';

type PaymentStoreProps = {
    paymentData: getPaymentPayload[];
    setData: (newData: getPaymentPayload[]) => void;
    getPayments: (com_id: number) => Promise<getPaymentPayload[] | undefined>; // แก้ตรงนี้

    createPayment: (payload: InsertPaymentPayload) => Promise<{ success: boolean; message?: string }>;
    updatePayment: (id: number, payload: InsertPaymentPayload) => Promise<{ success: boolean; message?: string }>;
    deletePayment: (id: number) => Promise<{ success: boolean; message?: string }>;
    updatePaymentStatus: (
        id: number,
        status: number
    ) => Promise<{ success: boolean; message?: string }>;
    clearPayment: () => void;

};

export const usePaymentStore = create<PaymentStoreProps>((set) => ({
    paymentData: [],

    setData: (newData) => set({ paymentData: newData }),

    getPayments: async (com_id) => {
        try {
            const query: FetchPaymentQuery = {
                com_id
            };
            const res = await PaymentService.fetchPayment(query) as {
                result: getPaymentPayload[];
            };

            set({ paymentData: res.result });
            return res.result;
        } catch (error) {
            console.error("getPayments error:", error);
            return undefined;
        }
    },

    createPayment: async (payload) => {
        try {
            await PaymentService.createPayment(payload);
            return { success: true };
        } catch (error: unknown) {
            console.error("createPayment error:", error);
            const err = error as { message?: string };
            return { success: false, message: err.message || "Unknown error" };
        }
    },

    updatePayment: async (id, payload) => {
        try {
            await PaymentService.updatePayment(id, payload);
            return { success: true };
        } catch (error: unknown) {
            console.error("updatePayment error:", error);
            const err = error as { message?: string };
            return { success: false, message: err.message || "Unknown error during update" };
        }
    },

    updatePaymentStatus: async (id: number, status: number) => {
        try {

            await PaymentService.updatePaymentStatus({ status: status, payment_method_id: id });

            return { success: true };
        } catch (error) {
            console.error("updateTicketStatus error:", error);
            return {
                success: false,
                message: (error as any)?.message || "Unknown error during update",
            };
        }
    },

    deletePayment: async (id) => {
        try {
            const res = await PaymentService.deletePayment(id) as { message: string };
            return { success: true, message: res.message || 'Deleted successfully' };
        } catch (error: unknown) {
            console.error("deletePayment error:", error);
            const axiosError = error as { response?: { data?: { message?: string } }, message?: string };
            return {
                success: false,
                message: axiosError?.response?.data?.message || axiosError?.message || "Unknown error",
            };
        }
    },
    clearPayment: () => {
        set({
            paymentData: [],
        });
    },
}));