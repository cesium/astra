import { api } from "./api";
import { IJobProps } from "./types";

export async function listJobs() {
  try {
    const res = await api.get<{ jobs: IJobProps[] }>("/jobs");
    return res.data.jobs;
  } catch {
    throw new Error("Failed to fetch jobs list. Please try again later.");
  }
}

export async function getDegrees() {
  try {
    const res = await api.get("/degrees");
    return res.data.degrees;
  } catch {
    throw new Error("Failed to fetch Degrees list. Please try again later.");
  }
}

export async function generateSchedule(params: {
  degree: string;
  semester: number;
}) {
  try {
    const res = await api.post("/schedule/generate", params);
    return res.data;
  } catch {
    throw new Error(
      "Failed to trigger Schedule generation. Please try again later.",
    );
  }
}

export async function exportShiftGroups(course_id: string) {
  try {
    const res = await api.get(`/export/blackboard/${course_id}/groups`);
    return res.data;
  } catch {
    throw new Error("Failed to export Shift Groups. Please try again later.");
  }
}

export async function exportGroupEnrollments(course_id: string) {
  try {
    const res = await api.get(
      `/export/blackboard/${course_id}/group_enrollments`,
    );
    return res.data;
  } catch {
    throw new Error(
      "Failed to export Group Enrollment. Please try again later.",
    );
  }
}
