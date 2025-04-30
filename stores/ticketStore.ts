// src/store/ticketStore.ts
import { create } from 'zustand';
import { TicketProps } from '@/types/types';
import { TICKET_TYPE } from '@/constants/enum';

type TicketStore = {
    ticketData: TicketProps[];
    setTicketData: (newData: TicketProps[]) => void;
    addTicket: (newTicket: TicketProps) => void;
    updateTicket: (id: string, updatedTicket: TicketProps) => void;
    deleteTicket: (id: string) => void;
    getTicketByRouteId: (id: string) => TicketProps[];
    getTicketById: (id: string) => TicketProps | undefined;
};

export const useTicketStore = create<TicketStore>((set) => ({
    ticketData: [
        {
            id: "T12345",
            ticketName_th: "รอบเช้า",
            ticketName_en: "Morning",
            ticket_color: "#3B82F6",
            route_id: "2",
            ticket_amount: "2",
            ticket_type: TICKET_TYPE.FIXED,
            ticket_price: [
                {
                    id: "1",
                    from: "1",
                    to: "2",
                    price: 340,
                    ticket_price_type_id: "1"
                },
                {
                    id: "2",
                    from: "1",
                    to: "3",
                    price: 340,
                    ticket_price_type_id: "1"
                },
                {
                    id: "3",
                    from: "2",
                    to: "3",
                    price: 340,
                    ticket_price_type_id: "1"
                },
                {
                    id: "1",
                    from: "1",
                    to: "2",
                    price: 340,
                    ticket_price_type_id: "2"
                },
                {
                    id: "2",
                    from: "1",
                    to: "3",
                    price: 340,
                    ticket_price_type_id: "2"
                },
                {
                    id: "3",
                    from: "2",
                    to: "3",
                    price: 340,
                    ticket_price_type_id: "2"
                },
            ],
        },

    ],

    // ฟังก์ชันการตั้งค่าข้อมูล
    setTicketData: (newData) => set({ ticketData: newData }),

    // ฟังก์ชันการเพิ่มข้อมูล
    addTicket: (newTicket) => set((state) => ({
        ticketData: [...state.ticketData, newTicket],
    })),

    // ฟังก์ชันการอัปเดตข้อมูล
    updateTicket: (id, updatedTicket) => set((state) => ({
        ticketData: state.ticketData.map((ticket) =>
            ticket.id === id ? updatedTicket : ticket
        ),
    })),

    // ฟังก์ชันการลบข้อมูล
    deleteTicket: (id) => set((state) => ({
        ticketData: state.ticketData.filter((ticket) => ticket.id !== id),
    })),

    getTicketByRouteId: () => [],

    getTicketById: () => undefined
}));


useTicketStore.setState((state) => ({
    ...state,
    getTicketByRouteId: (id: string) => {
        return useTicketStore.getState().ticketData.filter((item) => item.route_id === id);
    },
}));

useTicketStore.setState((state) => ({
    ...state,
    getTicketById: (id: string) => {
        return useTicketStore.getState().ticketData.find((item) => item.id === id);
    },
}));