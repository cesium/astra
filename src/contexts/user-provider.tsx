"use client";
import { api } from "@/lib/api";
import { User } from "@/lib/types";
import { useAuthStore } from "@/stores/authStore";
import { createContext, useEffect, useState } from "react";

interface IUserContextProps {
  user?: User;
  setUser: (user: User | undefined) => void;
}

export const UserContext = createContext<IUserContextProps>({
  user: undefined,
  setUser: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>();
  const { token } = useAuthStore();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch {
        setUser(undefined);
      }
    }

    if (token && !user) {
      fetchUser();
    }
  }, [user, setUser, token]);

  return <UserContext value={{ user, setUser }}>{children}</UserContext>;
}
