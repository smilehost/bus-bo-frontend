// src/store/companyStore.ts
import { create } from 'zustand';
import { TicketPriceType } from '@/types/types';

import { RouteTicketPriceTypeService } from '@/services/route.ticket.type.service';
import { CreateRouteTicketPriceType, RouteTicketPriceType } from '@/payloads/route.ticket.type.payload';

type TicketPriceTypeProps = {
  ticketPriceTypeData: TicketPriceType[];
  setData: (newData: TicketPriceType[]) => void;
  addTicketType: (newTicketType: CreateRouteTicketPriceType) => Promise<{ success: boolean; message?: string }>;
  updateTicketPriceType: (id: number, updatedTicketType: RouteTicketPriceType) => Promise<{ success: boolean; message?: string }>
  deleteTicketType: (
    id: number,
  ) => Promise<{ success: boolean; message?: string }>;
  getTicketPriceType: () => Promise<TicketPriceType[] | undefined>;
};

export const useTicketPriceTypeStore = create<TicketPriceTypeProps>((set) => ({
  ticketPriceTypeData: [],

  // เซ็ตข้อมูลใหม่ทั้งหมด
  setData: (newData) => set({ ticketPriceTypeData: newData }),

  // เพิ่มข้อมูลใหม่
  addTicketType: async (
    newTicketType
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const payload: CreateRouteTicketPriceType = newTicketType;

      // console.log("From API: ",payload)
      await RouteTicketPriceTypeService.createTicketType(payload);
      return { success: true };
    } catch (error) {
      console.error("create ticket type error:", error);
      return { success: false, message: (error as any)?.message || "Unknown error" };
    }
  },

  // อัปเดตข้อมูล
  updateTicketPriceType: async (
    id: number,
    updatedTicketType: RouteTicketPriceType
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      await RouteTicketPriceTypeService.updateTicketType(id, updatedTicketType);

      // ถ้า API สำเร็จ ค่อยอัปเดตใน state
      set((state) => ({
        ticketPriceTypeData: state.ticketPriceTypeData,
      }));

      return { success: true };
    } catch (error) {
      console.error("update ticket type error:", error);
      return {
        success: false,
        message: (error as any)?.message || "Unknown error during update",
      };
    }
  },

  deleteTicketType: async (id): Promise<{ success: boolean; message?: string }> => {
    try {
      await RouteTicketPriceTypeService.deleteTicketType(id);
      return { success: true };
    } catch (error) {
      console.error("delete ticket type error:", error);
      return { success: false, message: (error as any)?.message || "Unknown error" };
    }
  },

  // ดึงข้อมูลจาก API และ map ให้อยู่ใน format ที่ต้องการ
  getTicketPriceType: async (): Promise<TicketPriceType[] | undefined> => {
    try {
      const res = await RouteTicketPriceTypeService.getTicketPriceType() as {
        result: {
          route_ticket_price_type_id: number;
          route_ticket_price_type_name: string;
          route_ticket_price_type_com_id: number;
        }[];
      };

      const mapped = res.result.map((item) => ({
        id: item.route_ticket_price_type_id.toString(),
        name: item.route_ticket_price_type_name,
        company_id: item.route_ticket_price_type_com_id.toString(),
      }));

      set({ ticketPriceTypeData: mapped });
      return mapped;
    } catch (error) {
      console.error("getTicketPriceType error:", error);
      return undefined;
    }
  }
}));