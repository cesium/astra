import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createExchange, deleteExchange } from "../exchange";

export function useCreateExchange() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createExchange,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exchanges"] });
    },
  });
}

export function useDeleteExchange() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteExchange,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exchanges"] });
    },
  });
}
