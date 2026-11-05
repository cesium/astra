"use client";

import Input from "@/components/input";
import ShiftTimeslotItem from "@/components/shift-timeslot-item";
import Table, {
  HeaderElement,
  TableContent,
  TableHeader,
} from "@/components/table";
import { useUpdateShift } from "@/lib/mutations/backoffice";
import { IItemProps, ITimeSlot, IShiftResponse } from "@/lib/types";
import { getShortShiftType } from "@/lib/utils";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import ConfirmModal from "./confirm-modal";

const shiftTypeIds = [
  "theoretical",
  "theoretical_practical",
  "practical_laboratory",
  "tutorial_guidance",
] as const;

const shiftTypes: { id: (typeof shiftTypeIds)[number]; name: string }[] = [
  { id: "theoretical", name: "Theoretical (T)" },
  { id: "theoretical_practical", name: "Theoretical-Practical (TP)" },
  { id: "practical_laboratory", name: "Practical-Laboratory (PL)" },
  { id: "tutorial_guidance", name: "Tutorial Guidance (OT)" },
];

const formSchema = z.object({
  type: z.enum(shiftTypeIds, {
    message: "Please select a valid shift type",
  }),
  number: z
    .number({ message: "Shift number is required" })
    .int("Shift number must be an integer")
    .min(1, "Shift number must be at least 1"),
  professor: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

interface ShiftFormProps {
  selectedCourse: IItemProps;
  selectedShift: IItemProps;
  selectedShiftData: IShiftResponse | undefined;
  onShiftNameChange: (newName: string) => void;
  onDirtyChange: (isDirty: boolean) => void;
}

export default function ShiftForm({
  selectedCourse,
  selectedShift,
  selectedShiftData,
  onShiftNameChange,
  onDirtyChange,
}: ShiftFormProps) {
  const updateShift = useUpdateShift();
  const isSaving = updateShift.isPending;

  const [timeslots, setTimeslots] = useState<ITimeSlot[]>([]);
  const [originalTimeslots, setOriginalTimeslots] = useState<ITimeSlot[]>([]);

  const [isConfirmUpdateOpen, setIsConfirmUpdateOpen] =
    useState<boolean>(false);
  const [isConfirmDiscardOpen, setIsConfirmDiscardOpen] =
    useState<boolean>(false);
  const [pendingFormData, setPendingFormData] = useState<FormSchema | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty, errors, isValid },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      type: (selectedShiftData?.type as FormSchema["type"]) || "theoretical",
      number: selectedShiftData?.number ?? 1,
      professor: selectedShiftData?.professor ?? "",
    },
  });

  const watchedType = watch("type");
  const watchedNumber = watch("number");

  const currentDraftName = useMemo(() => {
    if (
      !watchedType ||
      !watchedNumber ||
      isNaN(watchedNumber) ||
      watchedNumber < 1
    ) {
      return "";
    }
    return `${getShortShiftType(watchedType)}${watchedNumber}`;
  }, [watchedType, watchedNumber]);

  const isNameChanged = Boolean(
    selectedShift &&
    currentDraftName &&
    currentDraftName !== selectedShift.name,
  );

  const isTimeslotsDirty = useMemo(() => {
    return JSON.stringify(originalTimeslots) !== JSON.stringify(timeslots);
  }, [originalTimeslots, timeslots]);

  const hasInvalidTimeslots = useMemo(() => {
    return timeslots.some(
      (slot) =>
        !slot.weekday || !slot.start || !slot.end || slot.start >= slot.end,
    );
  }, [timeslots]);

  const hasInvalidShiftDetails = Boolean(
    !isValid || errors.type || errors.number,
  );

  const hasUnsavedChanges = Boolean(isDirty || isTimeslotsDirty);

  useEffect(() => {
    onDirtyChange(hasUnsavedChanges);
  }, [hasUnsavedChanges, onDirtyChange]);

  useEffect(() => {
    return () => {
      onDirtyChange(false);
    };
  }, [onDirtyChange]);

  useEffect(() => {
    if (selectedShiftData && !hasUnsavedChanges) {
      setTimeslots(selectedShiftData.timeslots ?? []);
      setOriginalTimeslots(selectedShiftData.timeslots ?? []);
      reset({
        type: (selectedShiftData.type as FormSchema["type"]) || "theoretical",
        number: selectedShiftData.number ?? 1,
        professor: selectedShiftData.professor ?? "",
      });
    }
  }, [selectedShiftData, reset, hasUnsavedChanges]);

  useEffect(() => {
    if (updateShift.isSuccess) {
      const timer = setTimeout(() => {
        updateShift.reset();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [updateShift.isSuccess, updateShift]);

  const onSubmit: SubmitHandler<FormSchema> = (data: FormSchema) => {
    setPendingFormData(data);
    setIsConfirmUpdateOpen(true);
  };

  const handleConfirmChanges = () => {
    if (!pendingFormData) return;
    updateShift.mutate(
      {
        id: selectedShift.id,
        course_id: selectedCourse.id,
        type: pendingFormData.type,
        number: pendingFormData.number,
        professor: pendingFormData.professor,
        timeslots: timeslots,
      },
      {
        onSuccess: () => {
          const newName = `${getShortShiftType(pendingFormData.type)}${pendingFormData.number}`;
          onShiftNameChange(newName);
          setOriginalTimeslots(timeslots);
          reset(pendingFormData);
          setIsConfirmUpdateOpen(false);
        },
      },
    );
  };

  const handleDiscard = () => {
    if (!selectedShiftData) return;

    reset({
      type: (selectedShiftData.type as FormSchema["type"]) || "theoretical",
      number: selectedShiftData.number ?? 1,
      professor: selectedShiftData.professor ?? "",
    });
    setTimeslots(originalTimeslots);
    updateShift.reset();
    setIsConfirmDiscardOpen(false);
  };

  const updateTimeslot = (
    index: number,
    field: keyof ITimeSlot,
    value: string,
  ) => {
    setTimeslots((prev) =>
      prev.map((slot, i) =>
        i === index ? { ...slot, [field]: value === "" ? null : value } : slot,
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

  const removeTimeslot = (index: number) => {
    setTimeslots((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-1 flex-col bg-white">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h3 className="text-lg font-medium">Shift Details</h3>
        {isNameChanged ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800">
            <span className="line-through opacity-60">
              {selectedShift.name}
            </span>
            <span>→</span>
            <span className="font-semibold">{currentDraftName}</span>
            <span className="text-[10px] font-bold tracking-wide text-amber-600 uppercase">
              (Unsaved)
            </span>
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
            {selectedShift.name}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <div className="relative flex min-w-[200px] flex-1 flex-col gap-1 pb-5">
            <label className="text-sm font-medium text-gray-700">
              Shift Type
            </label>
            <select
              {...register("type")}
              className={`focus:ring-primary-400 w-full rounded-xl border bg-white px-2 py-1.5 text-black outline-none focus:ring-2 md:px-3 md:py-2.5 ${
                errors.type
                  ? "border-red-400 focus:ring-red-400"
                  : "focus:ring-primary-400 border-black/10"
              }`}
            >
              <option value="">Select type</option>
              {shiftTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            {errors.type && (
              <span className="text-danger absolute bottom-0 left-0 text-xs font-medium">
                {errors.type.message}
              </span>
            )}
          </div>

          <div className="relative flex min-w-[200px] flex-1 flex-col gap-1 pb-5">
            <label className="text-sm font-medium text-gray-700">
              Shift Number
            </label>
            <Input
              {...register("number", {
                valueAsNumber: true,
              })}
              type="number"
              min={1}
              placeholder="e.g. 1"
              className={errors.number ? "border-red-400" : ""}
            />
            {errors.number && (
              <span className="text-danger absolute bottom-0 left-0 text-xs font-medium">
                {errors.number.message}
              </span>
            )}
          </div>

          <div className="relative flex min-w-[200px] flex-1 flex-col gap-1 pb-5">
            <label className="text-sm font-medium text-gray-700">
              Professor
            </label>
            <Input
              {...register("professor")}
              type="text"
              placeholder="Professor's Name"
            />
          </div>

          <div className="w-full">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-md font-medium">Timeslots</h4>
              <button
                type="button"
                onClick={addTimeslot}
                className="bg-primary-400 hover:bg-primary-400/95 inline-flex h-fit cursor-pointer items-center justify-center space-x-1.5 rounded-lg px-3 py-2 text-white transition-all duration-200 hover:scale-95"
              >
                <span className="material-symbols-outlined text-xl">add</span>
                <p className="text-sm font-semibold">New Timeslot</p>
              </button>
            </div>

            {timeslots.length > 0 ? (
              <div>
                <Table className="h-auto max-h-70">
                  <TableHeader>
                    <HeaderElement
                      className="w-3/12 min-w-[140px]"
                      title="Weekday"
                    />
                    <HeaderElement
                      className="w-2/12 min-w-[120px]"
                      title="Start Time"
                    />
                    <HeaderElement
                      className="w-2/12 min-w-[120px]"
                      title="End Time"
                    />
                    <HeaderElement
                      className="w-2/12 min-w-[120px]"
                      title="Building"
                    />
                    <HeaderElement
                      className="w-2/12 min-w-[100px]"
                      title="Room"
                    />
                    <HeaderElement
                      className="w-1/12 min-w-[60px] text-center"
                      title="Action"
                    />
                  </TableHeader>
                  <TableContent>
                    {timeslots.map((timeslot, index) => (
                      <ShiftTimeslotItem
                        key={timeslot.id}
                        timeslot={timeslot}
                        index={index}
                        onUpdate={updateTimeslot}
                        onRemove={removeTimeslot}
                      />
                    ))}
                  </TableContent>
                </Table>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
                <p className="text-sm text-gray-500">
                  There are no timeslots for this shift. Click &quot;+ New
                  Timeslot&quot; above to add one.
                </p>
              </div>
            )}
          </div>

          <div className="mt-2 flex w-full flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {hasInvalidTimeslots && hasUnsavedChanges && (
                <p className="text-danger text-sm font-medium">
                  Please ensure all timeslots have a weekday and start time is
                  before end time.
                </p>
              )}
              {timeslots.length === 0 && (
                <p className="text-sm font-medium text-yellow-600">
                  Warning: No timeslots defined for this shift.
                </p>
              )}
              {updateShift.isError && (
                <p className="text-danger text-sm font-medium">Invalid data</p>
              )}
              {updateShift.isSuccess && (
                <p className="text-sm font-medium text-green-600">
                  Shift updated successfully!
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={!hasUnsavedChanges || isSaving}
                onClick={() => setIsConfirmDiscardOpen(true)}
                className="border-dark/10 hover:bg-smoke inline-flex h-fit cursor-pointer items-center justify-center rounded-lg border px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-200 hover:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={
                  !hasUnsavedChanges ||
                  isSaving ||
                  hasInvalidTimeslots ||
                  hasInvalidShiftDetails
                }
                className="bg-primary-400 hover:bg-primary-400/95 inline-flex h-fit cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                {isSaving ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      </form>
      <ConfirmModal
        isOpen={isConfirmDiscardOpen}
        onClose={() => setIsConfirmDiscardOpen(false)}
        onConfirm={handleDiscard}
        title="Discard changes?"
        description="Are you sure you want to discard your changes? All unsaved modifications to this shift will be lost."
        confirmText="Discard"
        variant="danger"
      />
      <ConfirmModal
        isOpen={isConfirmUpdateOpen}
        onClose={() => setIsConfirmUpdateOpen(false)}
        onConfirm={handleConfirmChanges}
        title="Update shift?"
        description="Are you sure you want to update this shift with the new details and schedule?"
        confirmText="Update"
        variant="primary"
        isLoading={isSaving}
      />
    </div>
  );
}
