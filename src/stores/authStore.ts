import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthStoreState = {
  token?: string;
};

type AuthStoreActions = {
  setToken: (nextToken: AuthStoreState["token"]) => void;
};

export type AuthStore = AuthStoreState & AuthStoreActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: undefined,
      setToken: (nextToken) => set({ token: nextToken }),
    }),
    {
      name: "auth",
    },
  ),
);
