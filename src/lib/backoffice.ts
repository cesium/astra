import { api } from "./api";
import { IJobProps, IScrapeConfig } from "./types";

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

export async function getStatistics(course_id: string) {
  try {
    const res = await api.get(
      `/statistics/course_shifts_capacity/${course_id}`,
    );
    return res.data;
  } catch {
    throw new Error("Failed to fetch statistics. Please try again later.");
  }
}

export async function linkTimeslots(config: IScrapeConfig) {
  try {
    const res = await api.post(`scraper/link`, { config });
    return res.data;
  } catch {
    throw new Error("Failed to trigger Link Job. Please try again later");
  }
}

export async function syncTimeslots(config: IScrapeConfig) {
  try {
    const res = await api.post(`scraper/sync`, { config });
    return res.data;
  } catch {
    throw new Error("Failed to trigger Sync Job. Please try again later");
  }
}

export async function getAutoSyncState() {
  try {
    const res = await api.get(`scraper/sync/auto_sync`);
    return res.data.state;
  } catch {
    throw new Error("Failed to fetch Auto Sync State. Please try again later");
  }
}

export async function toggleAutoSync() {
  try {
    const res = await api.post(`/scraper/sync/auto_sync`);
    return res.data;
  } catch {
    throw new Error(
      "Failed to update Auto Sync State. Please try again later.",
    );
  }
}
