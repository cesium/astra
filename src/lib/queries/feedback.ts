import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getFeedbacks } from "../feedback";

export function useGetFeedbacks(page: number) {
  return useQuery({
    queryKey: ["feedbacks", page],
    queryFn: () => getFeedbacks(page),
    placeholderData: keepPreviousData,
  });
}
