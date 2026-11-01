import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  generateSchedule,
  linkTimeslots,
  syncTimeslots,
  toggleAutoSync,
  updateShift,
  deleteTimeslot,
} from "../backoffice";

export function useGenerateSchedule() {
  return useMutation({
    mutationFn: generateSchedule,
  });
}

export function useLinkTimeslots() {
  return useMutation({
    mutationFn: linkTimeslots,
  });
}

export function useSyncTimeslots() {
  return useMutation({
    mutationFn: syncTimeslots,
  });
}

export function useToggleAutoSync() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleAutoSync,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auto_sync_state"] });
    },
  });
}

export function useUpdateShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateShift,
    onSuccess: (_data, variables) => {
      if (variables.course_id) {
        queryClient.invalidateQueries({
          queryKey: ["shifts", variables.course_id],
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["shifts"] });
      }

      queryClient.invalidateQueries({ queryKey: ["all-courses", true] });
    },
  });
}

export function useDeleteTimeslot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTimeslot,
    onSuccess: (_data, variables) => {
      if (variables.course_id) {
        queryClient.invalidateQueries({
          queryKey: ["shifts", variables.course_id],
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["shifts"] });
      }

      queryClient.invalidateQueries({ queryKey: ["all-courses", true] });
    },
  });
}
