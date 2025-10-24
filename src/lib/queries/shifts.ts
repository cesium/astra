import { useQuery } from "@tanstack/react-query";
import { getShifts } from "../shifts";

export function useGetShifts() {
  return useQuery({
    queryKey: ["shifts"],
    queryFn: () => getShifts(),
  });
}
