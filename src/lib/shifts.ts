import { api } from "./api";
import { ITimeSlot } from "./types";

export async function getShifts() {
  return await api.get(`/shifts`);
}

interface IPutShift {
  id: string;
  type?: string;
  number?: number;
  professor?: string;
  timeslots?: ITimeSlot[];
  enrollment_status?: string | null;
}

export async function updateShift(data: IPutShift) {
  return await api.put(`/shifts/${data.id}`, data);
}

export async function deleteTimeslot(data: {
  shiftId: string;
  timeslotId: string;
}) {
  return await api.delete(`/timeslots/${data.timeslotId}`);
}
