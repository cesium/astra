import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changePreference } from "../preferences";

export function useChangePreference() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changePreference,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["preferences"] });
    },
  });
}
