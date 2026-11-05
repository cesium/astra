import { useQuery } from "@tanstack/react-query";
import { getAllCourses, getStudentSchedule } from "../courses";

export function useGetAllCourses(include_shifts: boolean = true) {
  return useQuery({
    queryKey: ["all-courses", include_shifts],
    queryFn: () => getAllCourses(include_shifts),
  });
}

export function useGetStudentSchedule() {
  return useQuery({
    queryKey: ["student-schedule"],
    queryFn: () => getStudentSchedule(false),
  });
}

export function useGetStudentOriginalSchedule() {
  return useQuery({
    queryKey: ["student-original-schedule"],
    queryFn: () => getStudentSchedule(true),
  });
}
