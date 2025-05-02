// src/store/routeStore.ts
import { create } from 'zustand';
import { Route } from '@/types/types';
import { STATUS } from '@/constants/enum';

type RouteStore = {
    routeData: Route[];
    setRouteData: (newData: Route[]) => void;
    addRoute: (newRoute: Route) => void;
    updateRoute: (id: string, updatedRoute: Route) => void;
    deleteRoute: (id: string) => void;
    getRouteById: (id: string) => Route | undefined;
};

export const useRouteStore = create<RouteStore>((set) => ({
    routeData: [
        {
            id: '1',
            company_id: '3',
            route: 'Northern Express',
            schedule_id: '1',
            times_id: '2',
            status: STATUS.ACTIVE,
            routeColor: '#3B82F6',
            stations: ['1', '2', '3'],
            ticket_amount: "0",
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

    setRouteData: (newData) => set({ routeData: newData }),

    addRoute: (newRoute) =>
        set((state) => ({
            routeData: [...state.routeData, newRoute],
        })),

    updateRoute: (id, updatedRoute) =>
        set((state) => ({
            routeData: state.routeData.map((route) =>
                route.id === id ? updatedRoute : route
            ),
        })),

    deleteRoute: (id) =>
        set((state) => ({
            routeData: state.routeData.filter((route) => route.id !== id),
        })),

    // placeholder, จะ override ทีหลัง
    getRouteById: () => undefined,
}));

useRouteStore.setState((state) => ({
    ...state,
    getRouteById: (id: string) => {
        return useRouteStore.getState().routeData.find((route) => route.id === id);
    },
}));
