import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { getUserInfo } from "../session";

export function useGetSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: () => {
      const signedIn = useAuthStore.getState().signedIn;
      const accessToken = useAuthStore.getState().token;
      const sessionId = localStorage.getItem("session_id");
      return {
        signedIn,
        accessToken,
        sessionId,
      };
    },
  });
}

export function useGetUserInfo() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUserInfo,
  });
}
