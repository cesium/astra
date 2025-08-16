import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthStoreState = {
  token?: string;
  signedIn: boolean;
};

type AuthStoreActions = {
  setToken: (nextToken: AuthStoreState["token"]) => void;
  clearToken: () => void;
};

export type AuthStore = AuthStoreState & AuthStoreActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: undefined,
      signedIn: false,
      setToken: (nextToken) => set({ token: nextToken, signedIn: true }),
      clearToken: () => set({ token: undefined, signedIn: false }),
    }),
    {
      name: "auth",
    },
  ),
);
