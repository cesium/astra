import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFeedback, deleteFeedback } from "../feedback";

export function useCreateFeedback() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
    },
  });
}

export function useDeleteFeedback() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delete_feedback"] });
    },
  });
}
