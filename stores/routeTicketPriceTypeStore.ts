// src/store/companyStore.ts
import { create } from 'zustand';
import { TicketPriceType } from '@/types/types';

import { RouteTicketPriceTypeService } from '@/services/route.ticket.type.service';

type TicketPriceTypeProps = {
    ticketPriceTypeData: TicketPriceType[];
    setData: (newData: TicketPriceType[]) => void;
    addData: (newCompany: TicketPriceType) => void;
    updateData: (id: string, updatedCompany: TicketPriceType) => void;
    deleteData: (id: string) => void;
    getTicketPriceType: () => Promise<TicketPriceType[] | undefined>;
};

export const useTicketPriceStore = create<TicketPriceTypeProps>((set) => ({
    ticketPriceTypeData: [],
  
    // เซ็ตข้อมูลใหม่ทั้งหมด
    setData: (newData) => set({ ticketPriceTypeData: newData }),
  
    // เพิ่มข้อมูลใหม่
    addData: (newItem) => set((state) => ({
      ticketPriceTypeData: [...state.ticketPriceTypeData, newItem],
    })),
  
    // อัปเดตข้อมูล
    updateData: (id, updatedData) => set((state) => ({
      ticketPriceTypeData: state.ticketPriceTypeData.map((item) =>
        item.id === id ? updatedData : item
      ),
    })),
  
    // ลบข้อมูล
    deleteData: (id) => set((state) => ({
      ticketPriceTypeData: state.ticketPriceTypeData.filter((item) => item.id !== id),
    })),
  
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