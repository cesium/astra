import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteClassesPeriod, updateClassesPeriod } from "../classes-period";
import { IClassesPeriodRequest } from "../types";

export function useUpdateClassesPeriod(semester: 1 | 2) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: IClassesPeriodRequest) =>
      updateClassesPeriod(semester, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["classesPeriod", semester] });
    },
  });
}

export function useDeleteClassesPeriod(semester: 1 | 2) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => deleteClassesPeriod(semester),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["classesPeriod", semester] });
    },
  });
}
