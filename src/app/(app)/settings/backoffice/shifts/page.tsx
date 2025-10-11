"use client";

import { AuthCheck } from "@/components/auth-check";
import SettingsWrapper from "@/components/settings-wrapper";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import Card from "@/components/card";
import { useEffect, useMemo, useState } from "react";
import { useGetAllCourses } from "@/lib/queries/courses";
import { ITimeSlot } from "@/lib/types";
import { useDeleteTimeslot, useUpdateShift } from "@/lib/mutations/shifts";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "@/components/input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const getShortShiftType = (shiftType: string) => {
  switch (shiftType) {
    case "theoretical":
      return "T";
    case "theoretical_practical":
      return "TP";
    case "practical_laboratory":
      return "PL";
    case "tutorial_guidance":
      return "OT";
    default:
      return shiftType;
  }
};

interface IShiftsListbox {
  selectedItem: string;
  setSelectedItem: (item: string) => void;
  collection: { id: string; name: string }[];
  label?: string;
  className?: string;
}

export function ShiftsListbox({
  selectedItem,
  setSelectedItem,
  collection,
  label,
  className,
}: IShiftsListbox) {
  return (
    <Listbox
      as="div"
      value={selectedItem}
      onChange={setSelectedItem}
      className={"w-full"}
    >
      <ListboxButton
        className={twMerge(
          clsx(
            "group flex w-full cursor-pointer items-center justify-center rounded-md border border-gray-300 p-2 text-left select-none",
          ),
          className,
        )}
      >
        <div className={clsx("flex-1")}>
          <h3 className="text-xs sm:text-sm">{label}</h3>
          {selectedItem ? (
            <span className={clsx("block text-lg")}>
              {collection.find((item) => item.id === selectedItem)?.name}
            </span>
          ) : (
            <span className={clsx("sm:block")}>Select an item</span>
          )}
        </div>
      </ListboxButton>
      <ListboxOptions
        as={Card}
        anchor={"bottom start"}
        transition
        className={twMerge(
          clsx(
            "flex w-(--button-width) origin-top flex-col gap-4 rounded-2xl border border-gray-300 p-4 transition duration-200 ease-out [--anchor-gap:-8px] data-closed:scale-95 data-closed:opacity-0 sm:translate-x-2",
          ),
        )}
      >
        {collection.length === 0 ? (
          <div className="text-center text-sm text-gray-500">
            No options available
          </div>
        ) : (
          collection.map((item) => (
            <ListboxOption
              key={item.id}
              value={item.id}
              className="flex cursor-pointer items-center gap-3 select-none"
            >
              <div
                className={clsx(
                  "flex h-7 w-7 items-center justify-center rounded-full",
                  { "bg-primary-400": selectedItem === item.id },
                  { "border-2 border-gray-300": selectedItem !== item.id },
                )}
              >
                <div
                  className={clsx("flex h-2 w-2 rounded-full", {
                    "bg-white": selectedItem === item.id,
                  })}
                ></div>
              </div>
              <span className="line-clamp-1 text-lg leading-5">
                {item.name}
              </span>
            </ListboxOption>
          ))
        )}
      </ListboxOptions>
    </Listbox>
  );
}

export default function Shifts() {
  const { data: courses } = useGetAllCourses();
  const updateShift = useUpdateShift();
  const deleteTimeslot = useDeleteTimeslot();

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedShift, setSelectedShift] = useState("");

  const selectedCourseData = courses?.find(
    (course) => course.id === selectedCourse,
  );

  const shifts = useMemo(() => {
    return selectedCourseData?.shifts || [];
  }, [selectedCourseData]);

  const selectedShiftData = shifts.find((shift) => shift.id === selectedShift);
  const [timeslots, setTimeslots] = useState<ITimeSlot[]>([]);
  const [originalTimeslots, setOriginalTimeslots] = useState<ITimeSlot[]>([]);

  const formSchema = z.object({
    type: z.string(),
    number: z.number().min(1),
    professor: z.string(),
  });

  type FormSchema = z.infer<typeof formSchema>;

  const { register, handleSubmit, watch, setValue } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormSchema> = (data: FormSchema) => {
    updateShift.mutate({
      id: selectedShift,
      type: data.type,
      number: data.number,
      professor: data.professor,
      timeslots: timeslots,
    });
  };

  const updateTimeslot = (
    index: number,
    field: keyof ITimeSlot,
    value: string,
  ) => {
    const updatedTimeslots = [...timeslots];
    updatedTimeslots[index][field] = value;
    setTimeslots(updatedTimeslots);
  };

  const addTimeslot = () => {
    setTimeslots([
      ...timeslots,
      {
        id: crypto.randomUUID(),
        weekday: "",
        start: "",
        end: "",
        building: "",
        room: "",
      },
    ]);
  };

  const removeTimeslot = (id: string) => () => {
    const isOriginalTimeslot = originalTimeslots.some((slot) => slot.id === id);

    if (isOriginalTimeslot) {
      deleteTimeslot.mutate({ shiftId: selectedShift, timeslotId: id });
    }

    setTimeslots(timeslots.filter((slot) => slot.id !== id));
  };

  useEffect(() => {
    if (updateShift.isSuccess) {
      const timer = setTimeout(() => {
        updateShift.reset();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [updateShift.isSuccess, updateShift]);

  const weekdays = [
    { id: "monday", name: "Monday" },
    { id: "tuesday", name: "Tuesday" },
    { id: "wednesday", name: "Wednesday" },
    { id: "thursday", name: "Thursday" },
    { id: "friday", name: "Friday" },
    { id: "saturday", name: "Saturday" },
    { id: "sunday", name: "Sunday" },
  ];

  const orderedShifts = useMemo(() => {
    const transformedShifts = shifts.map((shift) => ({
      id: shift.id,
      name: `${getShortShiftType(shift.type)}${shift.number}`,
    }));

    return transformedShifts.sort((a, b) => {
      const numberA = parseInt(a.name.match(/\d+/g)?.[0] || "0", 10);
      const numberB = parseInt(b.name.match(/\d+/g)?.[0] || "0", 10);

      return numberA - numberB;
    });
  }, [shifts]);

  useEffect(() => {
    if (selectedShiftData?.timeslots) {
      setTimeslots(selectedShiftData.timeslots);
      setOriginalTimeslots(selectedShiftData.timeslots);
    } else {
      setTimeslots([]);
      setOriginalTimeslots([]);
    }
    if (selectedShiftData?.type) {
      setValue("type", selectedShiftData.type);
    }
    if (selectedShiftData?.number) {
      setValue("number", selectedShiftData.number);
    }
    if (selectedShiftData?.professor) {
      setValue("professor", selectedShiftData.professor);
    }
  }, [selectedShiftData, setValue]);

  useEffect(() => {
    setSelectedShift("");
  }, [selectedCourse]);

  useEffect(() => {
    if (selectedCourse && !selectedShift && orderedShifts.length > 0) {
      setSelectedShift(orderedShifts[0]?.id);
    }
  }, [selectedCourse, selectedShift, orderedShifts]);

  return (
    <>
      <title>Configurations | Pombo</title>
      <AuthCheck userTypes={["admin", "professor"]}>
        <SettingsWrapper title="Shifts Editing">
          <div className="flex h-full flex-col gap-8">
            <section className="space-y-2">
              <h2 className="text-2xl font-semibold">Shifts Editing</h2>
              <p>Here you can edit the shifts.</p>
            </section>
            <section className="flex-col gap-4">
              <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-medium">Select Course</h3>
                <div className="flex flex-1 flex-col items-center justify-center gap-2 text-gray-400 lg:flex-row">
                  <ShiftsListbox
                    selectedItem={selectedCourse}
                    setSelectedItem={setSelectedCourse}
                    collection={courses || []}
                    label="Course"
                  />
                  <ShiftsListbox
                    selectedItem={selectedShift}
                    setSelectedItem={setSelectedShift}
                    collection={orderedShifts.map((shift) => ({
                      id: shift.id,
                      name: shift.name,
                    }))}
                    label="Shift"
                  />
                </div>
              </div>
            </section>
            <section className="flex flex-1 flex-col gap-4">
              <div className="flex flex-1 flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-medium">Shift Details</h3>
                {selectedShift ? (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                      <div className="flex min-w-[200px] flex-1 flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                          Type
                        </label>
                        <Input
                          {...register("type", { required: true })}
                          type="text"
                          defaultValue={watch("type")}
                        />
                      </div>
                      <div className="flex min-w-[200px] flex-1 flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                          Number
                        </label>
                        <Input
                          {...register("number", {
                            valueAsNumber: true,
                            required: true,
                          })}
                          type="number"
                          defaultValue={watch("number") || ""}
                        />
                      </div>
                      <div className="flex min-w-[200px] flex-1 flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                          Professor
                        </label>
                        <Input
                          {...register("professor", { required: true })}
                          type="text"
                          defaultValue={watch("professor")}
                        />
                      </div>

                      <div className="flex w-full flex-col space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-700">
                            Timeslots
                          </label>
                          <button
                            type="button"
                            className="bg-primary-400 hover:bg-primary-500 rounded-md px-3 py-1 text-sm text-white"
                            onClick={addTimeslot}
                          >
                            Add Timeslot
                          </button>
                        </div>

                        {timeslots.length > 0 ? (
                          <div className="space-y-3">
                            {timeslots.map((timeslot, index) => (
                              <div
                                key={timeslot.id}
                                className="flex flex-col flex-wrap gap-3 rounded-md border border-gray-200 p-3 sm:flex-row"
                              >
                                <div className="min-w-[140px] flex-1">
                                  <label className="mb-1 block text-xs text-gray-600">
                                    Weekday
                                  </label>
                                  <ShiftsListbox
                                    selectedItem={timeslot.weekday}
                                    setSelectedItem={(value) =>
                                      updateTimeslot(index, "weekday", value)
                                    }
                                    collection={weekdays}
                                    className="rounded-xl border-gray-200"
                                  />
                                </div>

                                <div className="min-w-[120px] flex-1">
                                  <label className="mb-1 block text-xs text-gray-600">
                                    Start
                                  </label>
                                  <Input
                                    type="time"
                                    placeholder="Start Time"
                                    onChange={(e) =>
                                      updateTimeslot(
                                        index,
                                        "start",
                                        e.target.value,
                                      )
                                    }
                                    value={timeslot.start}
                                  />
                                </div>

                                <div className="min-w-[120px] flex-1">
                                  <label className="mb-1 block text-xs text-gray-600">
                                    End
                                  </label>
                                  <Input
                                    type="time"
                                    placeholder="End"
                                    onChange={(e) =>
                                      updateTimeslot(
                                        index,
                                        "end",
                                        e.target.value,
                                      )
                                    }
                                    value={timeslot.end}
                                  />
                                </div>

                                <div className="min-w-[120px] flex-1">
                                  <label className="mb-1 block text-xs text-gray-600">
                                    Building
                                  </label>
                                  <Input
                                    type="text"
                                    placeholder="Building"
                                    onChange={(e) =>
                                      updateTimeslot(
                                        index,
                                        "building",
                                        e.target.value,
                                      )
                                    }
                                    value={timeslot.building || ""}
                                  />
                                </div>

                                <div className="min-w-[120px] flex-1">
                                  <label className="mb-1 block text-xs text-gray-600">
                                    Room
                                  </label>
                                  <Input
                                    type="text"
                                    placeholder="Room"
                                    onChange={(e) =>
                                      updateTimeslot(
                                        index,
                                        "room",
                                        e.target.value,
                                      )
                                    }
                                    value={timeslot.room || ""}
                                  />
                                </div>

                                <div className="flex min-w-[100px] items-center">
                                  <button
                                    type="button"
                                    className="bg-danger w-full cursor-pointer rounded px-2 py-1 text-sm text-white"
                                    onClick={removeTimeslot(timeslot.id)}
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="py-4 text-center text-sm text-gray-500">
                            There are no timeslots for this shift.
                          </p>
                        )}
                      </div>
                      <div className="mt-6">
                        <button
                          type="submit"
                          className="bg-primary-400 hover:bg-primary-500 rounded-md px-4 py-2 text-white"
                        >
                          Update
                        </button>
                        <div>
                          {timeslots.length === 0 && (
                            <p className="mt-2 text-sm text-yellow-600">
                              Warning: No timeslots defined for this shift.
                            </p>
                          )}
                          {updateShift.isError && (
                            <p className="text-danger mt-2 text-sm">
                              Invalid data
                            </p>
                          )}
                          {updateShift.isSuccess && (
                            <p className="mt-2 text-sm text-green-600">
                              Shift updated successfully!
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </form>
                ) : (
                  <p className="text-gray-500">
                    Select a shift to see details.
                  </p>
                )}
              </div>
            </section>
          </div>
        </SettingsWrapper>
      </AuthCheck>
    </>
  );
}
