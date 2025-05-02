// src/store/companyStore.ts
import { create } from 'zustand';
import { TicketPriceType } from '@/types/types';

type TicketPriceTypeProps = {
    ticketPriceTypeData: TicketPriceType[];
    setData: (newData: TicketPriceType[]) => void;
    addData: (newCompany: TicketPriceType) => void;
    updateData: (id: string, updatedCompany: TicketPriceType) => void;
    deleteData: (id: string) => void;
    getTypeTicketByCompanyId: (id: string) => TicketPriceType[];
};

export const useTicketPriceStore = create<TicketPriceTypeProps>((set) => ({
    ticketPriceTypeData: [
        {
            id: "1",
            name: "Normal",
            company_id: "1"
        },
        {
            id: "2",
            name: "Student",
            company_id: "1"
        },
        {
            id: "3",
            name: "VIP",
            company_id: "1"
        },
        {
            id: "4",
            name: "Vip",
            company_id: "2"
        },
        {
            id: "5",
            name: "Super Vip",
            company_id: "2"
        },
    ],

    // ฟังก์ชันการเพิ่มข้อมูล
    setData: (newData) => set({ ticketPriceTypeData: newData }),

    // ฟังก์ชันการเพิ่มข้อมูล
    addData: (newCompany) => set((state) => ({
        ticketPriceTypeData: [...state.ticketPriceTypeData, newCompany],
    })),

    // ฟังก์ชันการอัปเดตข้อมูล
    updateData: (id, updatedData) => set((state) => ({
        ticketPriceTypeData: state.ticketPriceTypeData.map((ticket) =>
            ticket.id === id ? updatedData : ticket
        ),
    })),

    // ฟังก์ชันการลบข้อมูล
    deleteData: (id) => set((state) => ({
        ticketPriceTypeData: state.ticketPriceTypeData.filter((ticket) => ticket.id !== id),
    })),

    getTypeTicketByCompanyId: () => [],
}));

useTicketPriceStore.setState((state) => ({
    ...state,
    getTypeTicketByCompanyId: (id: string) => {
        const { ticketPriceTypeData } = useTicketPriceStore.getState();
        return ticketPriceTypeData.filter((item) => item.company_id === id);
    },    
}));