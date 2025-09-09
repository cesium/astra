import { useMutation } from "@tanstack/react-query";
import { generateSchedule } from "../backoffice";

export function useGenerateSchedule() {
  return useMutation({
    mutationFn: generateSchedule,
  });
}
