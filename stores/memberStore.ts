// src/store/memberStore.ts
import { create } from 'zustand';
import { Member } from '@/types/types';
import { STATUS } from '@/constants/enum';

type MemberStore = {
    membersData: Member[];
    setMemberData: (newData: Member[]) => void;
    addMember: (newMember: Member) => void;
    updateMember: (id: string, updatedMember: Member) => void;
    deleteMember: (id: string) => void;
};

export const useMemberStore = create<MemberStore>((set) => ({
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

    // เซตข้อมูลสมาชิกทั้งหมด (เช่น ตอน fetch จาก API)
    setMemberData: (newData) => set({ membersData: newData }),

    // เพิ่มสมาชิกใหม่
    addMember: (newMember) => set((state) => ({
        membersData: [...state.membersData, newMember],
    })),

    // อัปเดตข้อมูลสมาชิก
    updateMember: (id, updatedMember) => set((state) => ({
        membersData: state.membersData.map((member) =>
            member.id === id ? updatedMember : member
        ),
    })),

    // ลบสมาชิก
    deleteMember: (id) => set((state) => ({
        membersData: state.membersData.filter((member) => member.id !== id),
    })),
}));
