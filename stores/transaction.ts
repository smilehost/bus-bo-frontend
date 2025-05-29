import { transactionService } from "@/services/transaction.service";
import { create } from "zustand";

interface TransactionMap {
  transaction_lat: string;
  transaction_long: string;
  transaction_route_id: number;
  transaction_amount: string;
  transaction_payment_method_id: number;
}

interface TransactionStore {
  transaction_lat: string;
  transaction_long: string;
  transaction_route_id: number;
  transaction_amount: string;
  transaction_payment_method_id: number;

  getTransactionMap: () => Promise<TransactionMap[] | undefined>;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transaction_lat: "",
  transaction_long: "",
  transaction_route_id: 0,
  transaction_amount: "",
  transaction_payment_method_id: 0,

  getTransactionMap: async () => {
    try {
      const res = await transactionService.getTransaction() as {
        result: TransactionMap[];
      };
      if (res.result.length > 0) {
        const first = res.result[0];
        set({
          transaction_lat: first.transaction_lat,
          transaction_long: first.transaction_long,
          transaction_route_id: first.transaction_route_id,
          transaction_amount: first.transaction_amount,
          transaction_payment_method_id: first.transaction_payment_method_id,
        });
      }
      console.log("res.result", res.result);
      return res.result;
    } catch (error) {
      console.error("getTransactionMap error:", error);
      return undefined;
    }
  }
}));
