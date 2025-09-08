import { useQuery } from "@tanstack/react-query";
import { getAllCourses, getStudentSchedule } from "../courses";

export function useGetAllCourses() {
  return useQuery({
    queryKey: ["all-courses"],
    queryFn: getAllCourses,
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
