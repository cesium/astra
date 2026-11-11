import { api } from "./api";
import { IFeedback, IFeedbackForm, IPaginated } from "./types";

export async function getFeedbacks(
  page: number,
): Promise<IPaginated<IFeedback>> {
  const res = await api.get<IPaginated<IFeedback>>(`/feedbacks`, {
    params: { page },
  });
  return res.data;
}

export async function createFeedback(data: IFeedbackForm) {
  return await api.post(`/feedbacks`, data);
}

export async function deleteFeedback(id: string) {
  return await api.delete(`/feedbacks/${id}`);
}
