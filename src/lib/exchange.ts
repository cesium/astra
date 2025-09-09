import { api } from "./api";

export async function getExchanges() {
  return await api.get(`/shift_exchanges`);
}

export async function createExchange(data: {
  request: { shift_from: string; shift_to: string };
}) {
  return await api.post(`/shift_exchanges`, data);
}

export async function deleteExchange(id: string) {
  return await api.delete(`/shift_exchanges/${id}`);
}

export async function updateExchangeDate(data: {
  request: { start: string; end: string };
}) {
  return await api.post(`/shift_exchanges/exchange_period`, data.request);
}