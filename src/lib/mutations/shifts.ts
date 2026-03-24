import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTimeslot, updateShift } from "../shifts";

export function useUpdateShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateShift,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shift"] });
    },
  });
}

export function useDeleteTimeslot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTimeslot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
  });
}
