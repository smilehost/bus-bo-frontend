import { create } from 'zustand';
import { STATUS } from '@/constants/enum';

type Time = {
    id: string;
    name: string;
    times: string[];
    status: STATUS;
};

type TimeStore = {
    timeData: Time[];
    setTimeData: (newData: Time[]) => void;
    addTime: (newTime: Time) => void;
    updateTime: (id: string, updatedTime: Time) => void;
    deleteTime: (id: string) => void;
};

export const useTimeStore = create<TimeStore>((set) => ({
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

    setTimeData: (newData) => set({ timeData: newData }),
    addTime: (newTime) => set((state) => ({
        timeData: [...state.timeData, newTime],
    })),
    updateTime: (id, updatedTime) => set((state) => ({
        timeData: state.timeData.map((time) =>
            time.id === id ? updatedTime : time
        ),
    })),
    deleteTime: (id) => set((state) => ({
        timeData: state.timeData.filter((time) => time.id !== id),
    })),
}));
