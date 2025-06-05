import { api } from "./axios.service";

export const transactionService = {
    getTransaction: async () => {
        return await api.get({
            path: "/transaction/position"
        });
    },
}