import { create } from 'zustand';

type StoreState = {
    pointVersion: number;
    triggerPointRerender: () => void;
};

export const useRenderStore = create<StoreState>((set) => ({
    pointVersion: 0,
    triggerPointRerender: () => set((state) => ({ pointVersion: state.pointVersion + 1 })),
}));