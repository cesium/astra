import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createExchange,
  deleteExchange,
  updateExchangeDate,
} from "../exchange";

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
      queryClient.invalidateQueries({ queryKey: ["delete_exchange"] });
    },
  });
}

export function useUpdateExchangeDate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateExchangeDate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exchange_date"] });
    },
  });
}
