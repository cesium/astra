import { useQuery } from "@tanstack/react-query";

export function useGetSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: () => {
      const accessToken = localStorage.getItem("access_token");
      const sessionId = localStorage.getItem("session_id");
      return {
        accessToken,
        sessionId,
      };
    },
  });
}
