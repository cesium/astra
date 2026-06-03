import { DateLocalizer, momentLocalizer } from "react-big-calendar";
import moment from "moment";

function isEqual({ n, x }: { n: number; x: number }) {
  return n === x;
}

const localizer = momentLocalizer(moment);

export function formatWeekday(weekdayString: string): string {
  const date = moment(weekdayString, "dddd").toDate();
  return localizer.format(date, "ddd");
}

function firstAndLastName(fullName: string) {
  const words = fullName.trim().split(/\s+/);
  if (words.length === 1) return words[0];

  return `${words[0]} ${words[words.length - 1]}`;
}

interface ShiftProps {
  shift: string;
  professor?: string;
  timeslots: {
    weekday: string;
    start: string;
    end: string;
    room: string;
    building: string;
  }[];
}

export default function ExchangeStateContent({
  uc,
  from,
  to,
  shift,
  status,
}: {
  uc: string;
  from: ShiftProps;
  to: ShiftProps;
  shift: string;
  status: "pending" | "completed";
}) {
  const isPending = status === "pending";
  const loadingStyle =
    "animated-background bg-gradient-to-r from-celeste via-celeste/30 to-celeste";

  const n = (() => {
    switch (status) {
      case "pending":
        return 1;
      case "completed":
        return 2;
      default:
        return 1;
    }
  })();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full flex-col gap-2">
        <h2 className="font-semibold">Exchange request information</h2>
        <div className="grid w-fit grid-cols-[120px_1fr] gap-x-4 gap-y-3 text-sm">
          <span className="text-gray-500">Curricular Unit</span>
          <span className="font-medium text-black">{uc}</span>

          <span className="text-gray-500">Shift type</span>
          <span>{shift}</span>

          <span className="text-gray-500">Exchange</span>
          <div className="flex items-center gap-1">
            <span>{from.shift}</span>
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
            <span>{to.shift}</span>
          </div>

          {from.professor && to.professor && (
            <>
              <span className="text-gray-500">Professor</span>
              <div className="flex items-center gap-1">
                <span>{firstAndLastName(from.professor)}</span>
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
                <span>{firstAndLastName(to.professor)}</span>
              </div>
            </>
          )}

          <span className="text-gray-500">Time</span>
          <div className="flex w-fit flex-row gap-2">
            <div className="flex flex-col">
              {from.timeslots.map((slot, index) => (
                <span key={index} className="capitalize">
                  {`${formatWeekday(slot.weekday)}: ${slot.start} - ${slot.end}`}
                </span>
              ))}
            </div>

            <span className="material-symbols-outlined self-center text-sm">
              arrow_forward
            </span>

            <div className="flex flex-col">
              {to.timeslots.map((slot, index) => (
                <span key={index} className="capitalize">
                  {`${formatWeekday(slot.weekday)}: ${slot.start} - ${slot.end}`}
                </span>
              ))}
            </div>
          </div>
          <span className="text-gray-500">Room</span>
          <div className="flex w-fit flex-row gap-2">
            <div className="flex flex-col">
              {from.timeslots.map((slot, index) => (
                <span key={index} className="capitalize">
                  {`CP${slot.building}-${slot.room}`}
                </span>
              ))}
            </div>

            <span className="material-symbols-outlined self-center text-sm">
              arrow_forward
            </span>

            <div className="flex flex-col">
              {to.timeslots.map((slot, index) => (
                <span key={index} className="capitalize">
                  {`CP${slot.building}-${slot.room}`}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="font-semibold">State</h2>
        <div className="flex gap-4">
          <div className="flex w-1/2 flex-col items-center gap-1">
            <div
              className={`h-2 w-full rounded-full ${isEqual({ n, x: 1 }) ? loadingStyle : 1 < n ? "bg-celeste" : "bg-gray-300"}`}
            ></div>
            <span className="text-sm">Pending</span>
          </div>
          <div className="flex w-1/2 flex-col items-center gap-1">
            <div
              className={`h-2 w-full rounded-full ${isEqual({ n, x: 2 }) ? "bg-celeste" : "bg-gray-300"}`}
            ></div>
            <span className="text-sm">Completed</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-col items-center gap-2 p-4 text-center">
        <span className="text-xl font-semibold">
          {isPending
            ? "Your request is being processed."
            : "This request has been completed."}
        </span>
        <span className="text-gray-500">
          {isPending
            ? "If a suitable exchange is found, you will be notified."
            : "You can view the details of your completed request here."}
        </span>
      </div>
    </div>
  );
}
