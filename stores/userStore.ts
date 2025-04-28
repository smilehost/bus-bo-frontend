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
        user_tier: USER_TIER.ADMIN,
        name: 'TEST USER',
        company_id: '4',
    },
    setUserData: (newData) => set({ userData: newData }),
}));
