import { useQuery } from "@tanstack/react-query";
import { getClassesPeriod } from "../classes-period";

export function useGetClassesPeriod(semester: 1 | 2) {
  return useQuery({
    queryKey: ["classesPeriod", semester],
    queryFn: () => getClassesPeriod(semester),
  });
}
