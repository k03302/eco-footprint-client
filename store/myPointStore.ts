import { create } from 'zustand';

// Define the state shape and actions types
interface Store {
    point: number;
    addPoint: (amount: number) => void;
    usePoint: (amount: number) => void;
}

// Create the store with the defined types
const useStore = create<Store>((set) => ({
    point: 0,
    addPoint: (amount) => set((state) => ({ point: state.point + amount })),
    usePoint: (amount) => set((state) => ({ point: state.point - amount }))
}));

export default useStore;