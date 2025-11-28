import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  createEvent,
  deleteCategory,
  deleteEvent,
  editCategory,
  editEvent,
  updateStudentCategories,
} from "../events";
import {
  IEventCategory,
  IEventCategoryRequest,
  IEventRequest,
  IEventResponse,
} from "../types";

export function useUpdateStudentCategories() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateStudentCategories,
    onSuccess: (data) => {
      qc.setQueryData(["selected-categories"], data);
      qc.invalidateQueries({ queryKey: ["selected-events"] });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      qc.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useEditCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      category,
    }: {
      id: string;
      category: IEventCategoryRequest;
    }) => editCategory(id, category),
    onSuccess: (data) => {
      qc.setQueryData<IEventCategory[]>(["categories"], (old) => {
        if (!old) return [data];
        return old.map((cat) => (cat.id === data.id ? data : cat));
      });
    },
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteEvent() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useEditEvent() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, event }: { id: string; event: IEventRequest }) =>
      editEvent(id, event),
    onSuccess: (data) => {
      qc.setQueryData<IEventResponse[]>(["events"], (old) => {
        if (!old) return [data];
        return old.map((event) => (event.id === data.id ? data : event));
      });
    },
  });
}

export function useCreateEvent() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
