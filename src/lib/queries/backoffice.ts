import { useQuery } from "@tanstack/react-query";
import {
  exportGroupEnrollments,
  exportShiftGroups,
  getDegrees,
  getStudentById,
  getStudentScheduleById,
  listJobs,
  listStudents,
} from "../backoffice";
import { FlopMetaParams } from "../types";

export function useListJobs() {
  return useQuery({
    queryKey: ["jobs-list"],
    queryFn: listJobs,
    refetchInterval: 1000,
  });
}

export function useGetDegrees() {
  return useQuery({
    queryKey: ["available-degrees"],
    queryFn: getDegrees,
  });
}

export function useExportShiftGroups(courseId: string) {
  return useQuery({
    queryKey: ["shift-groups-export"],
    queryFn: () => exportShiftGroups(courseId),
    enabled: false,
  });
}

export function useExportGroupEnrollments(courseId: string) {
  return useQuery({
    queryKey: ["group-enrollments-export"],
    queryFn: () => exportGroupEnrollments(courseId),
    enabled: false,
  });
}

export function useListStudents(params: FlopMetaParams) {
  return useQuery({
    queryKey: ["students-list", params],
    queryFn: () => listStudents(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useGetStudentScheduleById(studentId: string) {
  return useQuery({
    queryKey: [`student-${studentId}-schedule`, studentId],
    queryFn: () => getStudentScheduleById(studentId),
  });
}

export function useGetStudentById(id: string) {
  return useQuery({
    queryKey: ["student", id],
    queryFn: () => getStudentById(id),
  })
}
