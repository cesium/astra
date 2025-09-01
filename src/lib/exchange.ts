import { api } from "./api";

export async function getExchanges() {
    return await api.get("/auth/preferences/language");
    // THIS WILL BE REMOVED AND THE ACTUAL ENDPOINT FOR THE EXCHANGES WILL TAKE PLACE
}