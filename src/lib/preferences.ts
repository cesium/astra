import { api } from "./api";

export async function getUserPreference(preference: string) {
  return await api.get(`/preferences/${preference}`);
}

export async function changePreference(data: { language: "en-US" | "pt-PT" }) {
  return await api.put(`/preferences`, data);
}
