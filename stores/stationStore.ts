import { create } from 'zustand';

type Station = {
    id: string;
    name: string;
    coordinates: string;
};

type StationStore = {
    stationData: Station[];
    setStationData: (newData: Station[]) => void;
    addStation: (newStation: Station) => void;
    updateStation: (id: string, updatedStation: Station) => void;
    deleteStation: (id: string) => void;
};

export const useStationStore = create<StationStore>((set) => ({
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

    setStationData: (newData) => set({ stationData: newData }),
    addStation: (newStation) => set((state) => ({
        stationData: [...state.stationData, newStation],
    })),
    updateStation: (id, updatedStation) => set((state) => ({
        stationData: state.stationData.map((station) =>
            station.id === id ? updatedStation : station
        ),
    })),
    deleteStation: (id) => set((state) => ({
        stationData: state.stationData.filter((station) => station.id !== id),
    })),
}));
