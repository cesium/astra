import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";

export function useGetSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: () => {
      const accessToken = useAuthStore.getState().token;
      const sessionId = localStorage.getItem("session_id");
      return {
        accessToken,
        sessionId,
      };
    },
  });
}
