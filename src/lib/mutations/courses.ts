import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateStudentSchedule,
  importStudentsByCourses,
  importShiftsByCourses,
} from "../courses";

export function useUpdateStudentSchedule() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateStudentSchedule,
    onSuccess: (data) => {
      qc.setQueryData(["student-schedule"], data);
    },
  });
}

export function useImportStudentsByCourses() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: importStudentsByCourses,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["student-schedule"] });
      qc.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

export function useImportShiftsByCourses() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: importShiftsByCourses,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["student-schedule"] });
      qc.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}
