import { useQuery } from "@tanstack/react-query";
import { getDegrees, listJobs } from "../backoffice";

export function useListJobs() {
  return useQuery({
    queryKey: ["jobs-list"],
    queryFn: listJobs,
    refetchInterval: 1000,
  });
}

export function useGetDegrees() {
  return useQuery({
    queryKey: ["available-degrees"],
    queryFn: getDegrees,
  });
}
