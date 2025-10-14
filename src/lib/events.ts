import { api } from "./api";

export async function getEvents() {
  try {
    const res = await api.get("/events");
    return res.data.events;
  } catch {
    throw new Error(`Failed to fetch events. Please try again later.`);
  }
}

export async function getEventById(id: string) {
  try {
    const res = await api.get(`/events/${id}`);
    return res.data.events;
  } catch {
    throw new Error(
      `Failed to fetch event with id-${id}. Please try again later.`,
    );
  }
}

export async function getCategories() {
  try {
    const res = await api.get("/event_categories");
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
