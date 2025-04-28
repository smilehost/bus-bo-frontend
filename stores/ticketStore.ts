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
};

export const useTicketStore = create<TicketStore>((set) => ({
     ticketData: [
            {
                id: "T12345",
                ticketName_th: "รอบเช้า",
                ticketName_en: "Morning",
                ticket_type: TICKET_TYPE.FIXED,
                ticket_amount: "2",
                ticket_color: "#3B82F6",
                ticket_list: [
                    {
                        type: "Normal",
                        price: 200
                    },
                    {
                        type: "Man",
                        price: 100
                    },
                    {
                        type: "Student",
                        price: 200
                    },
                ],
                route_id: "2"
            },
            {
                id: "T12347",
                ticketName_th: "รอบเย็นsdfsfsdfsdfssdsdssdsdssddf",
                ticketName_en: "Test",
                ticket_type: TICKET_TYPE.FIXED,
                ticket_amount: "2",
                ticket_color: "#10B981",
                ticket_list: [
                    {
                        type: "Normal",
                        price: 200
                    },
                    {
                        type: "Student",
                        price: 200
                    },
                ],
                route_id: "3"
            },
            {
                id: "T12232",
                ticketName_th: "รอบไหน",
                ticketName_en: "Test test",
                ticket_type: TICKET_TYPE.TIERED,
                ticket_amount: "2",
                ticket_color: "#F59E0B",
                ticket_list: [
                    {
                        type: "Normal",
                        price: 200
                    },
                    {
                        type: "Student",
                        price: 200
                    },
                ],
                route_id: "3"
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
}));
