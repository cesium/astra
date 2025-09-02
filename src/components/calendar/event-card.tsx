import { EventProps } from "react-big-calendar";

export default function EventCard({ event }: EventProps) {
  const building = event.resource?.building || "";
  const room = event.resource?.room || "";

  const location = `${building} - ${room}`;

  return (
    <div className="space-y-0.5">
      <h3>{event.title}</h3>
      <p className="text-xs opacity-70 sm:text-sm">
        {location || "No location"}
      </p>
    </div>
  );
}
