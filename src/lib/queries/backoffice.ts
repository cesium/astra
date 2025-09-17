import { useQuery } from "@tanstack/react-query";
import {
  exportGroupEnrollments,
  exportShiftGroups,
  getDegrees,
  getStatistics,
  listJobs,
} from "../backoffice";

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

export function useGetStatistics(courseId?: string) {
  return useQuery({
    queryKey: ["statistics", courseId],
    queryFn: () => getStatistics(courseId as string),
    enabled: !!courseId,
  });
}
