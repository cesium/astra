import { api } from "./api";
import { ICourse } from "./types";

export async function getAllCourses() {
  try {
    const res = await api.get<{ courses: ICourse[] }>("/courses");
    return res.data.courses;
  } catch {
    throw new Error("Failed to fetch courses. Please try again later.");
  }
}

export async function getStudentSchedule(original_only = false) {
  try {
    const res = await api.get<{ courses: ICourse[] }>("/student/schedule", {
      params: { original_only },
    });
    return res.data.courses;
  } catch {
    throw new Error(
      `Failed to fetch student schedule. Please try again later.`,
    );
  }
}

export async function updateStudentSchedule({ shifts }: { shifts: string[] }) {
  try {
    const res = await api.post("/student/schedule", { shifts });
    return res.data.courses;
  } catch {
    throw new Error(
      "Failed to update student schedule. Please try again later.",
    );
  }
}
