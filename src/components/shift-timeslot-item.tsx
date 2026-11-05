"use client";

import Input from "@/components/input";
import { TableCell, TableItemWrapper } from "@/components/table";
import { ITimeSlot } from "@/lib/types";

const weekdays = [
  { id: "monday", name: "Monday" },
  { id: "tuesday", name: "Tuesday" },
  { id: "wednesday", name: "Wednesday" },
  { id: "thursday", name: "Thursday" },
  { id: "friday", name: "Friday" },
  { id: "saturday", name: "Saturday" },
  { id: "sunday", name: "Sunday" },
];

interface ShiftTimeslotItemProps {
  timeslot: ITimeSlot;
  index: number;
  onUpdate: (index: number, field: keyof ITimeSlot, value: string) => void;
  onRemove: (index: number) => void;
}

export default function ShiftTimeslotItem({
  timeslot,
  index,
  onUpdate,
  onRemove,
}: ShiftTimeslotItemProps) {
  const isWeekdayInvalid = !timeslot.weekday;
  const isTimeReversed = Boolean(
    timeslot.start && timeslot.end && timeslot.start >= timeslot.end,
  );
  const isStartInvalid = !timeslot.start || isTimeReversed;
  const isEndInvalid = !timeslot.end || isTimeReversed;

  return (
    <TableItemWrapper className="transition hover:bg-gray-50/50">
      <TableCell className="p-3">
        <select
          value={timeslot.weekday}
          onChange={(e) => onUpdate(index, "weekday", e.target.value)}
          className={`focus:ring-primary-400 w-full rounded-xl border bg-white px-2 py-1.5 text-black outline-none focus:ring-2 md:px-3 md:py-2.5 ${
            isWeekdayInvalid ? "border-red-400" : "border-black/10"
          }`}
        >
          <option value="">Select weekday</option>
          {weekdays.map((day) => (
            <option key={day.id} value={day.id}>
              {day.name}
            </option>
          ))}
        </select>
      </TableCell>

      <TableCell className="p-3">
        <Input
          type="time"
          placeholder="Start Time"
          onChange={(e) => onUpdate(index, "start", e.target.value)}
          value={timeslot.start}
          className={isStartInvalid ? "border-red-400" : ""}
        />
      </TableCell>

      <TableCell className="p-3">
        <Input
          type="time"
          placeholder="End Time"
          onChange={(e) => onUpdate(index, "end", e.target.value)}
          value={timeslot.end}
          className={isEndInvalid ? "border-red-400" : ""}
        />
      </TableCell>

      <TableCell className="p-3">
        <Input
          type="text"
          placeholder="Building"
          onChange={(e) => onUpdate(index, "building", e.target.value)}
          value={timeslot.building || ""}
        />
      </TableCell>

      <TableCell className="p-3">
        <Input
          type="text"
          placeholder="Room"
          onChange={(e) => onUpdate(index, "room", e.target.value)}
          value={timeslot.room || ""}
        />
      </TableCell>

      <TableCell className="p-3 text-center">
        <button
          type="button"
          aria-label="Delete timeslot"
          title="Delete timeslot"
          className="text-danger hover:bg-danger/10 inline-flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-xl border border-transparent transition md:h-[42px] md:w-[42px]"
          onClick={() => onRemove(index)}
        >
          <span className="material-symbols-outlined text-2xl">delete</span>
        </button>
      </TableCell>
    </TableItemWrapper>
  );
}
