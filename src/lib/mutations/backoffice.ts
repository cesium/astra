import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  generateSchedule,
  linkTimeslots,
  syncTimeslots,
  toggleAutoSync,
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
