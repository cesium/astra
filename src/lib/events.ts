import { api } from "./api";
import {
  IEventCategory,
  IEventCategoryRequest,
  IEventRequest,
  IEventResponse,
} from "./types";

export async function getEvents() {
  try {
    const res = await api.get<{ events: IEventResponse[] }>("/events");
    return res.data.events;
  } catch {
    throw new Error(`Failed to fetch events. Please try again later.`);
  }
}

export async function deleteEvent(id: string) {
  try {
    await api.delete(`/events/${id}`);
  } catch {
    throw new Error(`Failed to delete event with id: ${id}.`);
  }
}

export async function editEvent(id: string, event: IEventRequest) {
  try {
    const res = await api.patch(`/events/${id}`, { event });
    return res.data.event;
  } catch {
    throw new Error(`Failed to edit event with id: ${id}`);
  }
}

export async function createEvent(event: IEventRequest) {
  try {
    const res = await api.post("/events", { event });
    return res.data.event;
  } catch {
    throw new Error("Failed to create new event.");
  }
}

export async function getSelectedEvents() {
  try {
    const res = await api.get<{ events: IEventResponse[] }>("/events/selected");
    return res.data.events;
  } catch {
    throw new Error(`Failed to fetch events. Please try again later.`);
  }
}

export async function getEventById(id: string) {
  try {
    const res = await api.get<{ events: IEventResponse }>(`/events/${id}`);
    return res.data.events;
  } catch {
    throw new Error(
      `Failed to fetch event with id-${id}. Please try again later.`,
    );
  }
}

export async function getCategories() {
  try {
    const res = await api.get<{ event_categories: IEventCategory[] }>(
      "/event_categories",
    );
    return res.data.event_categories;
  } catch {
    throw new Error(`Failed to fetch categories. Please try again later.`);
  }
}

export async function getCategoryById(id: string) {
  try {
    const res = await api.get(`/event_categories/${id}`);
    return res.data.event_categories;
  } catch {
    throw new Error(
      `Failed to fetch category with id-${id}. Please try again later.`,
    );
  }
}

export async function getSelectedCateries() {
  try {
    const res = await api.get("/event_categories/selected");
    return res.data.event_categories;
  } catch {
    throw new Error(
      `Failed to fetch selected categories. Please try again later.`,
    );
  }
}

export async function deleteCategory(id: string) {
  try {
    await api.delete(`/event_categories/${id}`);
  } catch {
    throw new Error(`Failed to delete category with id: ${id}.`);
  }
}

export async function editCategory(
  id: string,
  event_category: IEventCategoryRequest,
) {
  try {
    const res = await api.patch(`/event_categories/${id}`, { event_category });
    return res.data.event_category;
  } catch {
    throw new Error(`Failed to edit category with id: ${id}`);
  }
}

export async function createCategory(event_category: IEventCategoryRequest) {
  try {
    const res = await api.post("/event_categories", { event_category });
    return res.data.event_category;
  } catch {
    throw new Error("Failed to create new category.");
  }
}

export async function updateStudentCategories({
  event_categories,
}: {
  event_categories: string[];
}) {
  try {
    const res = await api.post("/event_categories/selected", {
      event_categories,
    });
    return res.data.event_categories;
  } catch {
    throw new Error(
      "Failed to update student categories. Please try again later.",
    );
  }
}
