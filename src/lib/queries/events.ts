import { useQuery } from "@tanstack/react-query";
import {
  getCategories,
  getCategoryById,
  getEventById,
  getEvents,
  getSelectedCateries,
} from "../events";

export function useGetEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
    initialData: [],
  });
}

export function useGetEventById(id: string) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => getEventById(id),
  });
}

export function useGetCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    initialData: [],
  });
}

export function useGetCategoryById(id: string) {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(id),
  });
}

export function useGetSelectedCategories() {
  return useQuery({
    queryKey: ["selected-categories"],
    queryFn: getSelectedCateries,
    initialData: [],
  });
}
