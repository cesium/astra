import { api } from "./api";

export async function getFeedbacks() {
  const feedbacks = await api.get(`/feedbacks`);
  return feedbacks.data;
}

export async function createFeedback(data: {
  subject: string;
  message: string;
}) {
  return await api.post(`/feedbacks`, data);
}

export async function deleteFeedback(id: string) {
  return await api.delete(`/feedbacks/${id}`);
}
