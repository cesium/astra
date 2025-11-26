"use client";

import { AuthCheck } from "@/components/auth-check";
import CustomCombobox from "@/components/combobox";
import Input from "@/components/input";
import Label from "@/components/label";
import Modal from "@/components/modal";
import SettingsWrapper from "@/components/settings-wrapper";
import Table, {
  HeaderElement,
  TableCell,
  TableContent,
  TableHeader,
  TableItemWrapper,
} from "@/components/table";
import {
  useCreateCategory,
  useCreateEvent,
  useDeleteCategory,
  useDeleteEvent,
  useEditCategory,
  useEditEvent,
} from "@/lib/mutations/events";
import { useGetAllCourses } from "@/lib/queries/courses";
import { useGetCategories, useGetEvents } from "@/lib/queries/events";
import { ICourse, IEventCategory, IEventResponse } from "@/lib/types";
import { Switch } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import moment from "moment";
import Link from "next/link";
import { createContext, useContext, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import z from "zod";

interface IModalStateProps {
  isOpen: boolean;
  type:
    | "editCategory"
    | "editEvent"
    | "newCategory"
    | "newEvent"
    | "delete"
    | null;
  data: IEventCategory | IEventResponse | null;
}

interface IEManagementProvider {
  onClose: () => void;
  onOpen: (
    type:
      | "editCategory"
      | "editEvent"
      | "newCategory"
      | "newEvent"
      | "delete"
      | null,
    data: IEventCategory | IEventResponse | null,
  ) => void;
  modalState: IModalStateProps;
  categories: IEventCategory[];
}

interface IInputLineProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  placeholder?: string;
  isColor?: boolean;
  colorValue?: string;
  disabled?: boolean;
  className?: string;
  errorMessage?: string;
}

function formatItems(items: ICourse[] | IEventCategory[] | undefined) {
  if (!items) return [];

  return items.map((item) => {
    return { id: item.id, name: item.name };
  });
}

function InputLine({
  label,
  placeholder,
  isColor,
  colorValue,
  disabled = false,
  className,
  errorMessage,
  onChange,
  ...rest
}: IInputLineProps) {
  return (
    <div
      className={twMerge(
        clsx("justify flex w-full flex-col gap-0.5", className),
      )}
    >
      <Label size="large" className="text-dark font-semibold">
        {label}
      </Label>

      <div className="inline-flex gap-1">
        {isColor && (
          <div
            className="h-full w-8.5 rounded-xl border border-black/10 px-2 py-1.5"
            style={{ backgroundColor: colorValue || "#fff" }}
          />
        )}

        <Input
          disabled={disabled}
          placeholder={placeholder}
          onChange={onChange}
          className={clsx(
            "bg-muted !py-1",
            rest.type === "date" || rest.type === "datetime-local"
              ? "[&>input]:!text-black [&>input:invalid]:!text-black"
              : "",
          )}
          {...rest}
        />
      </div>

      <span className="text-danger px-1">{errorMessage}</span>
    </div>
  );
}

function DeleteModalLayout() {
  const deleteCategory = useDeleteCategory();
  const deleteEvent = useDeleteEvent();
  const { onClose, modalState } = useContext(EventsManagementContext);

  if (!modalState.data) return null;

  const isEvent = "category" in modalState.data;

  const handleDelete = () => {
    if (!isEvent && modalState.data?.id) {
      deleteCategory.mutate(modalState.data.id);
    } else if (modalState.data?.id) {
      deleteEvent.mutate(modalState.data?.id);
    }
    onClose();
  };

  const name = isEvent
    ? (modalState.data as IEventResponse).title
    : (modalState.data as IEventCategory).name;

  return (
    <div className="w-full space-y-8">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">
          Are you sure you want to delete this {isEvent ? "event" : "category"}?
        </h3>
        <p className="text-sm">
          <span className="font-semibold">
            {isEvent ? "Event" : "Category"}:
          </span>{" "}
          {name}
        </p>
      </div>
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => onClose()}
          className="hover:bg-smoke border-dark/5 inline-flex h-fit cursor-pointer items-center justify-center space-x-0.5 rounded-lg border px-3 py-2 transition-all duration-200 hover:scale-95"
        >
          Cancel
        </button>
        <button
          onClick={() => handleDelete()}
          className="bg-primary-400 hover:bg-primary-400/95 inline-flex h-fit cursor-pointer items-center justify-center space-x-0.5 rounded-lg px-3 py-2 text-white transition-all duration-200 hover:scale-95"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function CategoryModalLayout() {
  const { data: courses } = useGetAllCourses();
  const editCategory = useEditCategory();
  const createCategory = useCreateCategory();

  const { onClose, modalState } = useContext(EventsManagementContext);

  const isNew = modalState.type === "newCategory";
  const category = modalState.data as IEventCategory;

  const formSchema = z.object({
    name: z.string().max(72, {
      message: "The name should be smaller than 72 characters",
    }),
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/, {
      message: "Invalid color format!(e.g., #RRGGBB)",
    }),
  });

  type FormSchema = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: isNew ? "" : category?.name || "",
      color: isNew ? "#EE7749" : category?.color || "#EE7749",
    },
  });

  const colorValue = watch("color");

  const handleSave: SubmitHandler<FormSchema> = (data) => {
    if (!isNew && modalState.data?.id) {
      editCategory.mutate({
        id: modalState.data?.id,
        category: {
          name: data.name,
          color: data.color,
          course_id: selectedCourse?.id || "",
          type: enabled ? "mandatory" : "optional",
        },
      });
    } else {
      createCategory.mutate({
        name: data.name,
        color: data.color,
        course_id: selectedCourse?.id || "",
        type: enabled ? "mandatory" : "optional",
      });
    }
    onClose();
  };

  const [selectedCourse, setSelectedCourse] = useState<{
    id: string;
    name: string;
  } | null>(
    modalState.data && category?.course
      ? { id: category.course.id, name: category.course.name }
      : { id: "", name: "None" },
  );

  const [enabled, setEnabled] = useState(
    modalState.data && category?.type === "mandatory" ? true : false,
  );

  return (
    <form onSubmit={handleSubmit(handleSave)} className="w-full space-y-8">
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold">
          {isNew
            ? "Creating a new event category"
            : "Currently editing a category"}
        </h3>
        {modalState.data && !isNew && (
          <p className="text-ld">
            <span className="font-semibold">Category:</span> {category?.name}
          </p>
        )}
      </div>

      <div className="flex w-full flex-col gap-4">
        <div className="flex gap-10">
          <InputLine
            id="name"
            label="Name"
            required
            placeholder="category name"
            errorMessage={errors.name?.message}
            {...register("name", { required: true })}
          />
          <InputLine
            id="color"
            label="Color"
            required
            isColor
            colorValue={colorValue}
            placeholder="category color"
            errorMessage={errors.color?.message}
            {...register("color", { required: true })}
          />
        </div>

        <div className="inline-flex gap-10 pr-4">
          <div className="flex-1 space-y-1">
            <Label size="large" className="text-dark flex-1 font-semibold">
              Course
            </Label>
            <div className="relative">
              <CustomCombobox
                required
                disableFlip
                items={[{ id: "", name: "None" }, ...formatItems(courses)]}
                selectedItem={selectedCourse}
                setSelectedItem={setSelectedCourse}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <Label size="large" className="text-dark w-full font-semibold">
              Mandatory
            </Label>

            <div className="flex h-full items-center">
              <Switch
                checked={enabled}
                onChange={setEnabled}
                className="group bg-dark/15 data-checked:bg-primary-400 inline-flex h-6 w-11 items-center rounded-full transition"
              >
                <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
              </Switch>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => onClose()}
          className="hover:bg-smoke border-dark/5 inline-flex h-fit cursor-pointer items-center justify-center space-x-0.5 rounded-lg border px-3 py-2 transition-all duration-200 hover:scale-95"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-primary-400 hover:bg-primary-400/95 inline-flex h-fit cursor-pointer items-center justify-center space-x-0.5 rounded-lg px-3 py-2 text-white transition-all duration-200 hover:scale-95"
        >
          Save
        </button>
      </div>
    </form>
  );
}

function EventModalLayout() {
  const editEvent = useEditEvent();
  const createEvent = useCreateEvent();
  const formRef = useRef<HTMLFormElement>(null);

  const { onClose, modalState, categories } = useContext(
    EventsManagementContext,
  );

  const isNew = modalState.type === "newEvent";

  const event = modalState.data as IEventResponse;
  const start = !isNew ? moment.utc(event?.start) : null;
  const end = !isNew ? moment.utc(event?.end) : null;

  const formSchema = z
    .object({
      name: z.string().max(72, {
        message: "The name should be smaller than 72 characters",
      }),
      start: z.date(),
      end: z.date(),
      place: z.string().optional(),
      link: z
        .string()
        .max(72, {
          message: "The link should be smaller than 72 characters",
        })
        .optional(),
    })
    .refine((data) => data.end >= data.start, {
      message: "End date must be equal or after start date",
      path: ["end"],
    });

  type FormSchema = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: isNew ? "" : event?.title || "",
      place: isNew ? "" : event?.place || "",
      link: isNew ? "" : event?.link || "",
    },
  });

  const handleSave: SubmitHandler<FormSchema> = (data) => {
    if (!isNew && modalState.data?.id) {
      editEvent.mutate({
        id: modalState.data?.id,
        event: {
          title: data.name,
          start: moment.utc(data.start).format("YYYY-MM-DDTHH:mm:ss[Z]"),
          end: moment.utc(data.end).format("YYYY-MM-DDTHH:mm:ss[Z]"),
          place: data.place || "",
          link: data.link || "",
          category_id: selectedCategory!.id,
        },
      });
    } else {
      createEvent.mutate({
        title: data.name,
        start: moment.utc(data.start).format("YYYY-MM-DDTHH:mm:ss[Z]"),
        end: moment.utc(data.end).format("YYYY-MM-DDTHH:mm:ss[Z]"),
        place: data.place || "",
        link: data.link || "",
        category_id: selectedCategory!.id,
      });
    }
    onClose();
  };

  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    name: string;
  } | null>(
    modalState.data && event?.category
      ? { id: event.category.id, name: event.category.name }
      : null,
  );

  const startsAtMidnight =
    start &&
    start.hours() === 0 &&
    start.minutes() === 0 &&
    start.seconds() === 0;
  const endsAtMidnight =
    end && end.hours() === 0 && end.minutes() === 0 && end.seconds() === 0;
  const allday =
    start &&
    end &&
    ((startsAtMidnight && endsAtMidnight) ||
      end.diff(start, "days", true) >= 1);

  const [enabled, setEnabled] = useState(allday || false);

  return (
    <div className="w-full space-y-8">
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold">
          {isNew ? "Creating a new Event" : "Currently editing an event"}
        </h3>
        {modalState.data && !isNew && (
          <p className="text-ld">
            <span className="font-semibold">Event:</span> {event?.title}
          </p>
        )}
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit(handleSave)}
        className="space-y-8"
      >
        <div className="flex w-full flex-col gap-4">
          <div className="flex gap-10">
            <InputLine
              id="name"
              label="Name"
              required
              placeholder="event name"
              errorMessage={errors.name?.message}
              {...register("name", { required: true })}
            />
            <InputLine
              id="place"
              label="Place (optional)"
              placeholder="event place"
              errorMessage={errors.place?.message}
              {...register("place")}
            />
          </div>

          <InputLine
            id="link"
            label="Link (optional)"
            placeholder="event link"
            errorMessage={errors.link?.message}
            {...register("link")}
          />

          <div className="flex-1 space-y-1">
            <Label size="large" className="text-dark flex-1 font-semibold">
              Category
            </Label>
            <div className="relative">
              <CustomCombobox
                disableFlip
                required
                items={formatItems(categories)}
                selectedItem={selectedCategory}
                setSelectedItem={setSelectedCategory}
              />
            </div>
          </div>

          <div className="flex gap-10">
            <InputLine
              key={`start-${enabled}`}
              label={enabled ? "Start Date" : "Start Date Time"}
              type={enabled ? "date" : "datetime-local"}
              id="start"
              required
              defaultValue={
                isNew
                  ? ""
                  : start?.format(
                      enabled ? "YYYY-MM-DD" : "YYYY-MM-DDTHH:mm",
                    ) || ""
              }
              errorMessage={errors.start?.message}
              {...register("start", { valueAsDate: true, required: true })}
            />
            <InputLine
              key={`end-${enabled}`}
              label={enabled ? "End Date" : "End Date Time"}
              type={enabled ? "date" : "datetime-local"}
              id="end"
              required
              defaultValue={
                isNew
                  ? ""
                  : end?.format(enabled ? "YYYY-MM-DD" : "YYYY-MM-DDTHH:mm") ||
                    ""
              }
              errorMessage={errors.end?.message}
              {...register("end", { valueAsDate: true, required: true })}
            />
          </div>

          <div className="flex w-fit flex-col">
            <Label
              size="large"
              className="text-dark w-full font-semibold whitespace-nowrap"
            >
              All Day
            </Label>

            <div className="flex h-full items-center">
              <Switch
                checked={enabled}
                onChange={setEnabled}
                className="group bg-dark/15 data-checked:bg-primary-400 inline-flex h-6 w-11 items-center rounded-full transition"
              >
                <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
              </Switch>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onClose()}
            className="hover:bg-smoke border-dark/5 inline-flex h-fit cursor-pointer items-center justify-center space-x-0.5 rounded-lg border px-3 py-2 transition-all duration-200 hover:scale-95"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-primary-400 hover:bg-primary-400/95 inline-flex h-fit cursor-pointer items-center justify-center space-x-0.5 rounded-lg px-3 py-2 text-white transition-all duration-200 hover:scale-95"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

function ActionsBox({
  type,
  data,
}: {
  type: "category" | "event";
  data: IModalStateProps["data"];
}) {
  const { onOpen } = useContext(EventsManagementContext);

  return (
    <div className="inline-flex gap-3">
      <button
        onClick={() =>
          onOpen(type == "category" ? "editCategory" : "editEvent", data)
        }
        className="group cursor-pointer"
      >
        <span className="material-symbols-outlined text-2xl transition-transform ease-in group-hover:scale-90">
          edit
        </span>
      </button>
      <button
        onClick={() => onOpen("delete", data)}
        className="group cursor-pointer"
      >
        <span className="material-symbols-outlined text-danger text-2xl transition-transform ease-in group-hover:scale-90">
          delete
        </span>
      </button>
    </div>
  );
}

function ColorTagCard({ color }: { color: string }) {
  return (
    <div
      className="w-fit rounded px-2 py-1 text-xs"
      style={{ background: `${color}` }}
    >
      {color}
    </div>
  );
}

function DateCard({ start, end }: { start: string; end: string }) {
  const startFormatted = moment.utc(start);
  const endFormatted = moment.utc(end);

  return (
    <div className="flex w-fit flex-col">
      <p>{startFormatted.format("DD/MM/YYYY")}</p>
      <p>{endFormatted.format("DD/MM/YYYY")}</p>
    </div>
  );
}

function TimeCard({ start, end }: { start: string; end: string }) {
  const startFormatted = moment.utc(start);
  const endFormatted = moment.utc(end);

  return (
    <div className="w-fit">
      <p>{`${startFormatted.format("HH:mm")} - ${endFormatted.format("HH:mm")}`}</p>
    </div>
  );
}

function CategoryItem({ category }: { category: IEventCategory }) {
  return (
    <TableItemWrapper className="text-dark/80">
      <TableCell className="font-semibold">{category.name}</TableCell>
      <TableCell>
        <ColorTagCard color={category.color} />
      </TableCell>
      <TableCell>{category.course?.name}</TableCell>
      <TableCell className="text-dark/70 flex justify-center">
        {category.type === "mandatory" ? "Yes" : "No"}
      </TableCell>
      <TableCell>
        <ActionsBox type="category" data={category} />
      </TableCell>
    </TableItemWrapper>
  );
}

function EventItem({ event }: { event: IEventResponse }) {
  return (
    <TableItemWrapper className="text-dark/80">
      <TableCell>
        <div className="flex flex-col">
          <span className="font-semibold">{event.title}</span>
          {event.link && (
            <Link
              rel="noopener noreferrer"
              target="_blank"
              href={event.link}
              className="text-primary-400 text-sm transition-opacity duration-300 hover:opacity-60"
            >
              {event.link}
            </Link>
          )}
        </div>
      </TableCell>
      <TableCell>{event.category?.name}</TableCell>
      <TableCell>
        <DateCard start={event.start} end={event.end} />
      </TableCell>
      <TableCell>
        <TimeCard start={event.start} end={event.end} />
      </TableCell>
      <TableCell>{`${event.place ? event.place : "none"}`}</TableCell>
      <TableCell>
        <ActionsBox type="event" data={event} />
      </TableCell>
    </TableItemWrapper>
  );
}

const EventsManagementContext = createContext<IEManagementProvider>({
  onClose: () => {},
  onOpen: () => {},
  modalState: { isOpen: false, type: null, data: null },
  categories: [],
});

export default function EventsManagement() {
  const { data: categories = [] } = useGetCategories();
  const { data: events = [] } = useGetEvents();

  const [modalState, setModalState] = useState<IModalStateProps>({
    isOpen: false,
    type: null,
    data: null,
  });

  const onClose = () => {
    setModalState({
      isOpen: false,
      type: modalState.type,
      data: modalState.data,
    });
  };

  const onOpen = (
    type: IModalStateProps["type"],
    data: IModalStateProps["data"],
  ) => {
    setModalState({ isOpen: true, type: type, data: data });
  };

  return (
    <>
      <title>Events & Categories | Pombo</title>
      <AuthCheck userTypes={["admin", "professor"]}>
        <SettingsWrapper title="Events & Categories">
          <EventsManagementContext.Provider
            value={{ onClose, onOpen, modalState, categories }}
          >
            <div className="flex h-full flex-col gap-4">
              <section className="flex h-1/2 min-h-0 flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-semibold">Event Categories</h2>
                    <p>Manage categories for your calendar events</p>
                  </div>

                  <button
                    onClick={() => onOpen("newCategory", null)}
                    className="bg-primary-400 hover:bg-primary-400/95 inline-flex h-fit cursor-pointer items-center justify-center space-x-1.5 rounded-lg px-3 py-2 text-white transition-all duration-200 hover:scale-95"
                  >
                    <span className="material-symbols-outlined text-xl">
                      add
                    </span>
                    <p className="text-sm font-semibold">New Category</p>
                  </button>
                </div>

                <Table>
                  <TableHeader>
                    <HeaderElement className="w-2/8" title="Category" />
                    <HeaderElement className="w-1/8" title="Color" />
                    <HeaderElement className="w-4/8" title="Course" />
                    <HeaderElement className="w-fit" title="Mandatory" />
                    <HeaderElement className="w-fit" title="Actions" />
                  </TableHeader>

                  <TableContent>
                    {categories && categories.length > 0 ? (
                      categories.map((category) => (
                        <CategoryItem key={category.id} category={category} />
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-4">
                          <p className="text-dark/50 text-center">
                            No categories
                          </p>
                        </td>
                      </tr>
                    )}
                  </TableContent>
                </Table>
              </section>

              <section className="flex h-1/2 min-h-0 flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-semibold">Calendar Events</h2>
                    <p>Create and manage events for your calendar</p>
                  </div>

                  <button
                    onClick={() => onOpen("newEvent", null)}
                    className="bg-primary-400 hover:bg-primary-400/95 inline-flex h-fit cursor-pointer items-center justify-center space-x-1.5 rounded-lg px-3 py-2 text-white transition-all duration-200 hover:scale-95"
                  >
                    <span className="material-symbols-outlined text-xl">
                      add
                    </span>
                    <p className="text-sm font-semibold">New Event</p>
                  </button>
                </div>

                <Table>
                  <TableHeader>
                    <HeaderElement className="w-2/12" title="Event" />
                    <HeaderElement className="w-3/12" title="Category" />
                    <HeaderElement className="w-1/12" title="Date" />
                    <HeaderElement className="w-2/12" title="Time" />
                    <HeaderElement className="w-3/12" title="Place" />
                    <HeaderElement className="w-1/12" title="Actions" />
                  </TableHeader>

                  <TableContent>
                    {events && events.length > 0 ? (
                      events.map((event) => (
                        <EventItem key={event.id} event={event} />
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-4">
                          <p className="text-dark/50 text-center">No events</p>
                        </td>
                      </tr>
                    )}
                  </TableContent>
                </Table>
              </section>
            </div>

            <Modal
              modalState={modalState.isOpen}
              onClose={() =>
                setModalState({
                  isOpen: false,
                  type: modalState.type,
                  data: modalState.data,
                })
              }
              className={
                modalState.type &&
                [
                  "newCategory",
                  "editCategory",
                  "newEvent",
                  "editEvent",
                ].includes(modalState.type)
                  ? "max-w-2xl"
                  : ""
              }
            >
              {modalState.type == "delete" && <DeleteModalLayout />}
              {(modalState.type == "editCategory" ||
                modalState.type == "newCategory") && <CategoryModalLayout />}
              {(modalState.type == "editEvent" ||
                modalState.type == "newEvent") && <EventModalLayout />}
            </Modal>
          </EventsManagementContext.Provider>
        </SettingsWrapper>
      </AuthCheck>
    </>
  );
}
