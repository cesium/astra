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
