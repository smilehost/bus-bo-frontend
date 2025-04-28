// src/store/companyStore.ts
import { create } from 'zustand';
import { Company } from '@/types/types';

type CompanyStore = {
    companyData: Company[];
    setCompanyData: (newData: Company[]) => void;
    addCompany: (newCompany: Company) => void;
    updateCompany: (id: string, updatedCompany: Company) => void;
    deleteCompany: (id: string) => void;
};

export const useCompanyStore = create<CompanyStore>((set) => ({
    companyData: [
        { id: '1', name: 'Northern Bus Co.' },
        { id: '2', name: 'Southern Express' },
        { id: '3', name: 'Eastern Transport' },
        { id: '4', name: 'Western Motors' },
        { id: '5', name: 'Bussing Transit' },
    ],
    
    // ฟังก์ชันการเพิ่มข้อมูล
    setCompanyData: (newData) => set({ companyData: newData }),

    // ฟังก์ชันการเพิ่มข้อมูล
    addCompany: (newCompany) => set((state) => ({
        companyData: [...state.companyData, newCompany],
    })),

    // ฟังก์ชันการอัปเดตข้อมูล
    updateCompany: (id, updatedCompany) => set((state) => ({
        companyData: state.companyData.map((company) =>
            company.id === id ? updatedCompany : company
        ),
    })),

    // ฟังก์ชันการลบข้อมูล
    deleteCompany: (id) => set((state) => ({
        companyData: state.companyData.filter((company) => company.id !== id),
    })),
}));
