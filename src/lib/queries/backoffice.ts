import { useQuery } from "@tanstack/react-query";
import { listJobs } from "../backoffice";

export function useListJobs() {
  return useQuery({
    queryKey: ["jobs-list"],
    queryFn: listJobs,
    refetchInterval: 1000,
  });
}
