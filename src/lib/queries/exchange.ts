import { useQuery } from "@tanstack/react-query";
import { useGetUserInfo } from "./session";
import { getExchanges } from "../exchange";

export function useGetExchanges() {
  const user = useGetUserInfo();
  
  const userId = user?.data?.id;
  
  return useQuery({
    queryKey: ["exchanges", userId],
    queryFn: () => getExchanges(),
  });
}
