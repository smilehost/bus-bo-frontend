import { create } from 'zustand';

type Schedule = {
    id: string;
    name: string;
};

type ScheduleStore = {
    scheduleData: Schedule[];
    setScheduleData: (newData: Schedule[]) => void;
    addSchedule: (newSchedule: Schedule) => void;
    updateSchedule: (id: string, updatedSchedule: Schedule) => void;
    deleteSchedule: (id: string) => void;
};

export const useScheduleStore = create<ScheduleStore>((set) => ({
    scheduleData: [
        { id: '1', name: 'Daily' },
        { id: '2', name: 'Everyday' },
        { id: '3', name: 'on weekends' },
        { id: '4', name: 'songkran' },
    ],

    setScheduleData: (newData) => set({ scheduleData: newData }),
    addSchedule: (newSchedule) => set((state) => ({
        scheduleData: [...state.scheduleData, newSchedule],
    })),
    updateSchedule: (id, updatedSchedule) => set((state) => ({
        scheduleData: state.scheduleData.map((schedule) =>
            schedule.id === id ? updatedSchedule : schedule
        ),
    })),
    deleteSchedule: (id) => set((state) => ({
        scheduleData: state.scheduleData.filter((schedule) => schedule.id !== id),
    })),
}));
