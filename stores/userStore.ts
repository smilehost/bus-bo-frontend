import { create } from 'zustand';

//utils
import { getComId } from '@/utils/getComId';
import { getAccountRoleId } from '@/utils/getAccountId';
type UserProps = {
    id: number
    name: string;
    company_id: number;
    account_role: number
};

type UserStore = {
    userData: UserProps;
    setUserData: (newData: UserProps) => void;
};

export const useUserStore = create<UserStore>((set) => ({
    userData: {
        id: 1,
        name: 'TEST USER',
        company_id: Number(getComId()),
        account_role: Number(getAccountRoleId())
    },
    setUserData: (newData) => set({ userData: newData }),
}));
