import { useQuery } from "@tanstack/react-query";
import { getExchangeDate, getExchanges } from "../exchange";

export function useGetExchanges() {
  return useQuery({
    queryKey: ["exchanges"],
    queryFn: () => getExchanges(),
    refetchInterval: 3000,
  });
}

export function useGetExchangeDate() {
  return useQuery({
    queryKey: ["exchangeDate"],
    queryFn: () => getExchangeDate(),
  });
}
