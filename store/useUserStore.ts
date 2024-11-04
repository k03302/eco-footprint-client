import { create } from 'zustand';

interface AuthState {
    isLoggedIn: boolean;
    setIsLoggedIn: (loggedIn: boolean) => void;

    userName: string | null;
    setUserName: (name: string) => void;

    profileUrl: string | null;
    setProfileUrl: (url: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isLoggedIn: false,
    setIsLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),

    userName: null,
    setUserName: (name) => set({ userName: name }),

    profileUrl: null,
    setProfileUrl: (url) => set({ profileUrl: url })
}));
