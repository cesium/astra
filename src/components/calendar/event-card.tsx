import { EventProps } from "react-big-calendar";

export default function EventCard({ event }: EventProps) {
  const building = event.resource?.building || "";
  const room = event.resource?.room || "";

  const location = `${building} - ${room}`;

  return (
    <div className="space-y-0.5">
      <h3>{event.title}</h3>
      <p className="text-sm opacity-70">{location || "No location"}</p>
    </div>
  );
}
