import { api } from "./api"

export async function getUserPreference(preference: string) {
    return await api.get(`/preferences/${preference}`)
}