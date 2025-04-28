import { create } from 'zustand';
import { USER_TIER, STATUS, TICKET_TYPE } from '@/constants/enum';

type Company = { id: string; name: string };
type User = { user_tier: USER_TIER; name: string; company_id: string };
type Time = { id: string; name: string; times: string[]; status: STATUS };
type Schedule = { id: string; name: string };
type Station = { id: string; name: string; coordinates: string };

type Route = {
    id: string;
    route: string;
    status: STATUS;
    routeColor: string;
    stations: string[];
    ticket_amount?: string;
    times_id: string;
    company_id: string;
    schedule_id: string;
};

type TicketListProps = {
    type: string,
    price: number
}

export type TicketProps = {
    id: string;
    ticketName_th: string;
    ticketName_en: string;
    ticket_type: string;
    ticket_amount: string;
    ticket_color: string;
    ticket_list: TicketListProps[];
    route_id: string;
};

type Member = {
    id: string;
    member_name: string;
    member_phone: string;
    member_status: STATUS;
    member_company_id: string;
    member_tripsTotal: number;
    member_lastTransaction: string;
};

type DataStore = {
    companyData: Company[];
    userData: User;
    timeData: Time[];
    scheduleData: Schedule[];
    stationData: Station[];
    routeData: Route[];
    membersData: Member[];
    ticketData: TicketProps[];
};

export const useDataStore = create<DataStore>(() => ({
    ticketData: [
        {
            id: "T12345",
            ticketName_th: "as",
            ticketName_en: "as",
            ticket_type: TICKET_TYPE.FIXED,
            ticket_amount: "2",
            ticket_color: "#3B82F6",
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
            route_id: "2"
        },
        {
            id: "T12347",
            ticketName_th: "as",
            ticketName_en: "as",
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
            ticketName_th: "as",
            ticketName_en: "as",
            ticket_type: TICKET_TYPE.FIXED,
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

    routeData: [
        {
            id: '1',
            company_id: '3',
            route: 'Northern Express',
            schedule_id: '1',
            times_id: '2',
            status: STATUS.ACTIVE,
            routeColor: '#3B82F6',
            stations: ['1', '4', '2', '5'],
            ticket_amount: "0", // จะถูกอัปเดตผ่านฟังก์ชัน
        },
        {
            id: '2',
            company_id: '1',
            route: 'Southern Route',
            schedule_id: '3',
            times_id: '2',
            status: STATUS.ACTIVE,
            routeColor: '#10B981',
            stations: ['1', '4', '2', '5'],
            ticket_amount: "0",
        },
        {
            id: '3',
            company_id: '4',
            route: 'Eastern Circuit',
            schedule_id: '1',
            times_id: '3',
            status: STATUS.INACTIVE,
            routeColor: '#F59E0B',
            stations: ['1', '4', '2', '5'],
            ticket_amount: "0",
        },
        {
            id: '4',
            company_id: '2',
            route: 'Western Line',
            schedule_id: '2',
            times_id: '3',
            status: STATUS.ACTIVE,
            routeColor: '#8B5CF6',
            stations: ['1', '4', '2', '5'],
            ticket_amount: "0",
        },
    ],

    companyData: [
        { id: '1', name: 'Northern Bus Co.' },
        { id: '2', name: 'Southern Express' },
        { id: '3', name: 'Eastern Transport' },
        { id: '4', name: 'Western Motors' },
        { id: '5', name: 'Bussing Transit' },
    ],

    userData: {
        user_tier: USER_TIER.ADMIN,
        name: 'TEST USER',
        company_id: '4',
    },

    timeData: [
        {
            id: '1',
            name: 'รอบเช้า',
            times: ['08:00', '09:00', '15:00'],
            status: STATUS.ACTIVE,
        },
        {
            id: '2',
            name: 'รอบเช้า',
            times: ['08:00', '09:00'],
            status: STATUS.ACTIVE,
        },
        {
            id: '3',
            name: 'รอบเช้า',
            times: ['08:00', '15:00'],
            status: STATUS.ACTIVE,
        },
    ],

    scheduleData: [
        { id: '1', name: 'Daily' },
        { id: '2', name: 'Everyday' },
        { id: '3', name: 'on weekends' },
        { id: '4', name: 'songkran' },
    ],

    stationData: [
        { id: '1', name: 'Khon Kaen Bus Terminal', coordinates: '' },
        { id: '2', name: 'Bangkok (Mo Chit) Terminal', coordinates: '' },
        { id: '3', name: 'Nakhon Ratchasima Station', coordinates: '' },
        { id: '4', name: 'Udon Thani Terminal', coordinates: '' },
        { id: '5', name: 'Chiang Mai Arcade Terminal', coordinates: '' },
        { id: '6', name: 'Ubon Ratchathani Station', coordinates: '' },
        { id: '7', name: 'Phitsanulok Bus Station', coordinates: '' },
        { id: '8', name: 'Surat Thani Bus Terminal', coordinates: '' },
        { id: '9', name: 'Hat Yai Bus Terminal', coordinates: '' },
    ],



    membersData: [
        {
            id: '1',
            member_name: 'Emily Davis',
            member_phone: '555-123-4567',
            member_status: STATUS.ACTIVE,
            member_company_id: '2',
            member_tripsTotal: 15,
            member_lastTransaction: '5/10/2023',
        },
        {
            id: '2',
            member_name: 'John Smith',
            member_phone: '555-123-4567',
            member_status: STATUS.INACTIVE,
            member_company_id: '3',
            member_tripsTotal: 3,
            member_lastTransaction: '5/10/2023',
        },
        {
            id: '3',
            member_name: 'Suphanat Jomoro',
            member_phone: '555-123-4567',
            member_status: STATUS.CANCELLED,
            member_company_id: '1',
            member_tripsTotal: 22,
            member_lastTransaction: '5/10/2023',
        },
        {
            id: '4',
            member_name: 'Michael Brown',
            member_phone: '555-123-4567',
            member_status: STATUS.ACTIVE,
            member_company_id: '4',
            member_tripsTotal: 5,
            member_lastTransaction: '5/10/2023',
        },
    ],
}));
