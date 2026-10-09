import { api } from "./api";
import { IClassesPeriod, IClassesPeriodRequest } from "./types";

export async function getClassesPeriod(
  semester: 1 | 2,
): Promise<IClassesPeriod | null> {
  try {
    const res = await api.get<IClassesPeriod>(`/classes_period/${semester}`);
    return res.data;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function updateClassesPeriod(
  semester: 1 | 2,
  data: IClassesPeriodRequest,
) {
  const res = await api.post(`/classes_period/${semester}`, data);
  return res.data;
}

export async function deleteClassesPeriod(semester: 1 | 2) {
  const res = await api.delete(`/classes_period/${semester}`);
  return res.data;
}
