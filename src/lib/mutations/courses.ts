import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStudentSchedule } from "../courses";

export function useUpdateStudentSchedule() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateStudentSchedule,
    onSuccess: (data) => {
      qc.setQueryData(["student-schedule"], data);
    },
  });
}
