import { api } from "./api";
import { IFeedback, IFeedbackForm } from "./types";

export async function getFeedbacks(): Promise<IFeedback[]> {
  const res = await api.get<{ data: IFeedback[] }>(`/feedbacks`);
  return res.data.data;
}

export async function createFeedback(data: IFeedbackForm) {
  return await api.post(`/feedbacks`, data);
}

export async function deleteFeedback(id: string) {
  return await api.delete(`/feedbacks/${id}`);
}
