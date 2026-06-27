import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type User } from "../types/user";

type AuthStore = {
    user: User,
    token: string,
    isLoading: boolean,
    login: () => void,
    logout: () => void,
    initialize: () => void
};

export const useAuthStore = create<AuthStore>()(persist((set) => ({
    user: {
        id: '',
        email: '',
        created_at: ''
    },
    token: '',
    isLoading: true,

    login: () => {
        set((state) => ({ token: state.token}));
        set((state) => ({ user: state.user}));
    },

    logout: () => {
        set(() => ({ token: ''}));
        set(() => ({ user: {id: '', email: '', created_at: ''}}))
    },
    initialize: () => {}
}), {
    name: 'auth-storage', // The local storage key
    partialize: (state) => ({
        user: state.user,
        token: state.token
    }) // This limits what is being stored in the local storage
}));