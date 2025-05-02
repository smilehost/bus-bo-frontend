import { create } from 'zustand';
import { USER_TIER } from '@/constants/enum';

type User = {
    user_tier: USER_TIER;
    name: string;
    company_id: string;
};

type UserStore = {
    userData: User;
    setUserData: (newData: User) => void;
};

export const useUserStore = create<UserStore>((set) => ({
    userData: {
        id: '1',
        name: 'TEST USER',
        user_tier: USER_TIER.ADMIN,
        company_id: '1',
    },
    setUserData: (newData) => set({ userData: newData }),
}));
