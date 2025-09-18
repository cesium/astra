import { EventProps } from "react-big-calendar";
import { editColor } from "@/lib/utils";

export default function EventCard({ event }: EventProps) {
  const building = event.resource?.building;
  const room = event.resource?.room;
  const textColor = event.resource?.textColor;

  const location = `${building} - ${room}`;

  return (
    <div
      className="h-full w-full px-1.5 py-0.5"
      style={{
        backgroundImage:
          event.resource?.status == "override"
            ? `repeating-linear-gradient(
                45deg,
                ${editColor(textColor, 0.1, 1)},
                ${editColor(textColor, 0.1, 1)} 4px,
                transparent 4px,
                transparent 8px
              )`
            : "",
      }}
    >
      <div className="space-y-0.5">
        <h3>{event.title}</h3>
        {building && room && (
          <p className="text-xs opacity-70 sm:text-sm">{location}</p>
        )}
      </div>
    </div>
  );
}
