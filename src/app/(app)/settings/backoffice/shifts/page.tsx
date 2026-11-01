"use client";

import { AuthCheck } from "@/components/auth-check";
import SettingsWrapper from "@/components/settings-wrapper";
import CustomCombobox from "@/components/combobox";
import Input from "@/components/input";
import { useEffect, useMemo, useState } from "react";
import { useGetAllCourses } from "@/lib/queries/courses";
import { useGetShiftsForCourse } from "@/lib/queries/backoffice";
import { useDeleteTimeslot, useUpdateShift } from "@/lib/mutations/backoffice";
import { IItemProps, ITimeSlot } from "@/lib/types";
import { getShortShiftType } from "@/lib/utils";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const weekdays = [
  { id: "monday", name: "Monday" },
  { id: "tuesday", name: "Tuesday" },
  { id: "wednesday", name: "Wednesday" },
  { id: "thursday", name: "Thursday" },
  { id: "friday", name: "Friday" },
  { id: "saturday", name: "Saturday" },
  { id: "sunday", name: "Sunday" },
];

const shiftTypes = [
  { id: "theoretical", name: "Theoretical (T)" },
  { id: "theoretical_practical", name: "Theoretical-Practical (TP)" },
  { id: "practical_laboratory", name: "Practical-Laboratory (PL)" },
  { id: "tutorial_guidance", name: "Tutorial Guidance (OT)" },
];

const formSchema = z.object({
  type: z.string().min(1, "Type is required"),
  number: z.number().min(1),
  professor: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function Shifts() {
  const { data: courses = [] } = useGetAllCourses(false);
  const updateShift = useUpdateShift();
  const deleteTimeslot = useDeleteTimeslot();

  const [selectedCourse, setSelectedCourse] = useState<IItemProps | null>(null);
  const [selectedShift, setSelectedShift] = useState<IItemProps | null>(null);

  const formattedCourses: IItemProps[] = useMemo(() => {
    return courses.map((course) => ({ id: course.id, name: course.name }));
  }, [courses]);

  const { data: shifts = [] } = useGetShiftsForCourse(selectedCourse?.id);

  const formattedShifts: IItemProps[] = useMemo(() => {
    return shifts.map((shift) => ({
      id: shift.id,
      name: `${getShortShiftType(shift.type)}${shift.number}`,
    }));
  }, [shifts]);

  const selectedShiftData = useMemo(() => {
    return shifts.find((shift) => shift.id === selectedShift?.id);
  }, [shifts, selectedShift]);

  const [timeslots, setTimeslots] = useState<ITimeSlot[]>([]);
  const [originalTimeslots, setOriginalTimeslots] = useState<ITimeSlot[]>([]);

  const { register, handleSubmit, reset } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormSchema> = (data: FormSchema) => {
    if (!selectedShift || !selectedCourse) return;

    updateShift.mutate({
      id: selectedShift.id,
      course_id: selectedCourse.id,
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
    setTimeslots((prev) =>
      prev.map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot,
      ),
    );
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

    if (isOriginalTimeslot && selectedShift && selectedCourse) {
      deleteTimeslot.mutate({
        shiftId: selectedShift.id,
        timeslotId: id,
        course_id: selectedCourse.id,
      });
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

  useEffect(() => {
    if (selectedShiftData) {
      setTimeslots(selectedShiftData.timeslots ?? []);
      setOriginalTimeslots(selectedShiftData.timeslots ?? []);
      reset({
        type: selectedShiftData.type ?? "",
        number: selectedShiftData.number ?? 1,
        professor: selectedShiftData.professor ?? "",
      });
    } else {
      setTimeslots([]);
      setOriginalTimeslots([]);
      reset({
        type: "",
        number: 1,
        professor: "",
      });
    }
  }, [selectedShiftData, reset]);

  useEffect(() => {
    if (selectedCourse && formattedShifts.length > 0) {
      if (
        !selectedShift ||
        !formattedShifts.some((s) => s.id === selectedShift.id)
      ) {
        setSelectedShift(formattedShifts[0]);
      }
    } else {
      setSelectedShift(null);
    }
  }, [selectedCourse, formattedShifts, selectedShift]);

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
              <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="mb-4 text-lg font-medium">
                  Select Course & Shift
                </h3>
                <div className="flex flex-1 flex-col gap-4 sm:flex-row">
                  <div className="flex-1 space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Course
                    </label>
                    <CustomCombobox
                      items={formattedCourses}
                      selectedItem={selectedCourse}
                      setSelectedItem={(course) => {
                        setSelectedCourse(course);
                        setSelectedShift(null);
                      }}
                      placeholder="Select a course"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Shift
                    </label>
                    <CustomCombobox
                      items={formattedShifts}
                      selectedItem={selectedShift}
                      setSelectedItem={setSelectedShift}
                      placeholder={
                        selectedCourse
                          ? "Select a shift"
                          : "Select a course first"
                      }
                    />
                  </div>
                </div>
              </div>
            </section>
            <section className="flex flex-1 flex-col gap-4">
              <div className="flex flex-1 flex-col rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="mb-4 text-lg font-medium">Shift Details</h3>
                {selectedShift ? (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                      <div className="flex min-w-[200px] flex-1 flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                          Type
                        </label>
                        <select
                          {...register("type", { required: true })}
                          className="focus:ring-primary-400 w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-700 focus:ring-2 focus:outline-none"
                        >
                          <option value="">Select type</option>
                          {shiftTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </select>
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
                        />
                      </div>
                      <div className="flex min-w-[200px] flex-1 flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                          Professor
                        </label>
                        <Input
                          {...register("professor", { required: true })}
                          type="text"
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
                                  <select
                                    value={timeslot.weekday}
                                    onChange={(e) =>
                                      updateTimeslot(
                                        index,
                                        "weekday",
                                        e.target.value,
                                      )
                                    }
                                    className="focus:ring-primary-400 w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-700 focus:ring-2 focus:outline-none"
                                  >
                                    <option value="">Select weekday</option>
                                    {weekdays.map((day) => (
                                      <option key={day.id} value={day.id}>
                                        {day.name}
                                      </option>
                                    ))}
                                  </select>
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
                          disabled={updateShift.isPending}
                          className="bg-primary-400 hover:bg-primary-500 rounded-md px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {updateShift.isPending ? "Updating..." : "Update"}
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
