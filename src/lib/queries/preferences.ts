import { useQuery } from "@tanstack/react-query";
import { getUserPreference } from "../preferences";

export function useGetUserPreference(preference: string) {
  return useQuery({
    queryKey: ["preferences", preference],
    queryFn: () => getUserPreference(preference),
  });
}
