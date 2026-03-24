import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  isAuth: boolean;
  userName: string | null;
  setIsAuth: (value: boolean) => void;
  setUser: (name: string | null) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuth: true,
      userName: null,
      setIsAuth: (value) => set({ isAuth: value }),
      setUser: (name) => set({ userName: name }),
    }),
    { name: "auth" }
  )
);
