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
import { useGetAllCourses } from "@/lib/queries/courses";
import { useGetCategories } from "@/lib/queries/events";
import { ICourse, IEvent, IEventCategory } from "@/lib/types";
import clsx from "clsx";
import { createContext, useContext, useState } from "react";
import { twMerge } from "tailwind-merge";

interface IModalStateProps {
  isOpen: boolean;
  type:
    | "editCategory"
    | "editEvent"
    | "newCategory"
    | "newEvent"
    | "delete"
    | null;
  data: IEventCategory | IEvent | null;
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
    data: IEventCategory | IEvent | null,
  ) => void;
  modalState: IModalStateProps;
}

interface IInputLineProps {
  label: string;
  value?: string;
  placeholder?: string;
  color?: boolean;
  disabled?: boolean;
  className?: string;
}

function formatCourses(courses: ICourse[] | undefined) {
  if (!courses) return [];

  return courses.map((course) => {
    return { id: course.id, name: course.name };
  });
}

function InputLine({
  label,
  value,
  placeholder,
  color,
  disabled = false,
  className,
}: IInputLineProps) {
  const [colorCode, setColorCode] = useState(value ? value : "fff");

  return (
    <div
      className={twMerge(
        clsx("justify flex w-full flex-col gap-0.5", className),
      )}
    >
      <Label size="large" className="text-dark flex-1 font-semibold">
        {label}
      </Label>

      <div className="inline-flex gap-1">
        {color && (
          <div
            className="h-full w-8.5 rounded-xl border border-black/10 px-2 py-1.5"
            style={{ backgroundColor: colorCode }}
          />
        )}

        <Input
          disabled={disabled}
          defaultValue={value}
          placeholder={placeholder}
          onChange={(e) => setColorCode(e.target.value)}
          className="!py-1"
        />
      </div>
    </div>
  );
}

function DeleteModalLayout() {
  const { onClose, modalState } = useContext(EventsManagementContext);

  if (!modalState.data) return null;

  const isEvent = "category" in modalState.data;

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
          {modalState.data.name}
        </p>
      </div>
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => onClose()}
          className="hover:bg-smoke border-dark/5 inline-flex h-fit cursor-pointer items-center justify-center space-x-0.5 rounded-lg border px-3 py-2 transition-all duration-200 hover:scale-95"
        >
          Cancel
        </button>
        <button className="bg-primary-400 hover:bg-primary-400/95 inline-flex h-fit cursor-pointer items-center justify-center space-x-0.5 rounded-lg px-3 py-2 text-white transition-all duration-200 hover:scale-95">
          Delete
        </button>
      </div>
    </div>
  );
}

function CategoryModalLayout() {
  const { data: courses } = useGetAllCourses();

  const { onClose, modalState } = useContext(EventsManagementContext);

  const category = modalState.data as IEventCategory;

  const [selectedCourse, setSelectedCourse] = useState<{
    id: string;
    name: string;
  } | null>(
    category.course
      ? { id: category.course.id, name: category.course.name }
      : { id: "", name: "None" },
  );

  return (
    <div className="w-full space-y-8">
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold">Currently editing a category</h3>
        {modalState.data && (
          <p className="text-ld">
            <span className="font-semibold">Category:</span>{" "}
            {modalState.data.name}
          </p>
        )}
      </div>

      <div className="flex w-full flex-col gap-4">
        <div className="flex gap-10">
          <InputLine
            label="Name"
            value={category.name || ""}
            placeholder={modalState.data ? "category name" : undefined}
          />
          <InputLine
            label="Color"
            color
            value={category.color || ""}
            placeholder={modalState.data ? "category color" : undefined}
          />
        </div>

        <div className="space-y-1">
          <Label size="large" className="text-dark flex-1 font-semibold">
            Course
          </Label>
          <div className="relative">
            <CustomCombobox
              disableFlip
              items={[{ id: "", name: "None" }, ...formatCourses(courses)]}
              selectedItem={selectedCourse}
              setSelectedItem={setSelectedCourse}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => onClose()}
          className="hover:bg-smoke border-dark/5 inline-flex h-fit cursor-pointer items-center justify-center space-x-0.5 rounded-lg border px-3 py-2 transition-all duration-200 hover:scale-95"
        >
          Cancel
        </button>
        <button className="bg-primary-400 hover:bg-primary-400/95 inline-flex h-fit cursor-pointer items-center justify-center space-x-0.5 rounded-lg px-3 py-2 text-white transition-all duration-200 hover:scale-95">
          Save
        </button>
      </div>
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

function CategoryItem({ category }: { category: IEventCategory }) {
  return (
    <TableItemWrapper>
      <TableCell>{category.name}</TableCell>
      <TableCell>
        <ColorTagCard color={category.color} />
      </TableCell>
      <TableCell>{category.course?.name}</TableCell>
      <TableCell>
        <ActionsBox type="category" data={category} />
      </TableCell>
    </TableItemWrapper>
  );
}

const EventsManagementContext = createContext<IEManagementProvider>({
  onClose: () => {},
  onOpen: () => {},
  modalState: { isOpen: false, type: null, data: null },
});

export default function EventsManagement() {
  const { data: categories = [] } = useGetCategories();

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
            value={{ onClose, onOpen, modalState }}
          >
            <div className="flex h-full flex-col gap-4">
              <section className="flex h-1/2 min-h-0 flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-semibold">Event Categories</h2>
                    <p>Manage categories for your calendar events</p>
                  </div>

                  <button className="bg-primary-400 hover:bg-primary-400/95 inline-flex h-fit cursor-pointer items-center justify-center space-x-1.5 rounded-lg px-3 py-2 text-white transition-all duration-200 hover:scale-95">
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
                    <HeaderElement className="w-1/16" title="Actions" />
                  </TableHeader>

                  <TableContent>
                    {categories && categories.length > 0 ? (
                      categories.map((category) => (
                        <CategoryItem key={category.id} category={category} />
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-4">
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

                  <button className="bg-primary-400 hover:bg-primary-400/95 inline-flex h-fit cursor-pointer items-center justify-center space-x-0.5 rounded-lg px-3 py-2 text-white transition-all duration-200 hover:scale-95">
                    <span
                      className="material-symbols-outlined-filled"
                      style={{ fontSize: "20px" }}
                    >
                      add
                    </span>
                    <p className="text-sm font-semibold">New Event</p>
                  </button>
                </div>

                <Table>
                  <TableHeader className="grid-cols-[1fr_1fr_100px] lg:grid-cols-[1fr_1fr_1fr_100px]">
                    <HeaderElement className="text-start" title="Event" />
                    <HeaderElement
                      className="text-center lg:text-start"
                      title="Category"
                    />
                    <HeaderElement className="hidden lg:block" title="Course" />
                    <HeaderElement className="text-center" title="Actions" />
                  </TableHeader>

                  <TableContent
                    className={
                      categories.length < 1 ? "items-center justify-center" : ""
                    }
                  >
                    {categories.length < 1 && (
                      <tr>
                        <td colSpan={4} className="p-4">
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
              className={modalState.type == "editCategory" ? "max-w-2xl" : ""}
            >
              {modalState.type == "delete" && <DeleteModalLayout />}
              {modalState.type == "editCategory" && <CategoryModalLayout />}
            </Modal>
          </EventsManagementContext.Provider>
        </SettingsWrapper>
      </AuthCheck>
    </>
  );
}
