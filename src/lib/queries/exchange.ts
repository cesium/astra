import { useQuery } from "@tanstack/react-query";
import { getExchanges } from "../exchange";

export function useGetExchanges() {
  return useQuery({
    queryKey: ["exchanges"],
    queryFn: () => getExchanges(),
    refetchInterval: 3000,
  });
}
