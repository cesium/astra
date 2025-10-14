import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStudentCategories } from "../events";

export function useUpdateStudentCategories() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateStudentCategories,
    onSuccess: (data) => {
      qc.setQueryData(["selected-categories"], data);
    },
  });
}
