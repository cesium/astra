import { useQuery } from "@tanstack/react-query";
import { getFeedbacks } from "../feedback";

export function useGetFeedbacks() {
  return useQuery({
    queryKey: ["feedbacks"],
    queryFn: getFeedbacks,
    refetchInterval: 3000,
  });
}
