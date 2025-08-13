"use client";

import CalendarView from "@/components/calendar/calendar";
import { useMemo, useState } from "react";
import FeedView from "@/components/calendar/feed-view";

//EVENTOS PARA DEBUG
const events = [
  // Monday (August 4, 2025)
  {
    id: 0,
    title: "PI - T2",
    place: "Campus",
    link: "",
    start: new Date(2025, 7, 4, 8, 0),
    end: new Date(2025, 7, 4, 9, 0),
    groupId: 1,
    filterId: 1,
  },
  {
    id: 1,
    title: "SC - T1",
    place: "Campus",
    link: "",
    start: new Date(2025, 7, 4, 9, 0),
    end: new Date(2025, 7, 4, 10, 0),
    groupId: 1,
    filterId: 1,
  },
  {
    id: 2,
    title: "PI - TP4",
    place: "Campus",
    link: "",
    start: new Date(2025, 7, 4, 10, 0),
    end: new Date(2025, 7, 4, 12, 0),
    groupId: 1,
    filterId: 1,
  },
  // Tuesday (August 5, 2025)
  {
    id: 3,
    title: "EPTN - T2",
    place: "Campus",
    link: "",
    start: new Date(2025, 7, 5, 8, 0),
    end: new Date(2025, 7, 5, 10, 0),
    groupId: 1,
    filterId: 1,
  },
  {
    id: 4,
    title: "L - T2",
    place: "Campus",
    link: "",
    start: new Date(2025, 7, 5, 10, 0),
    end: new Date(2025, 7, 5, 12, 0),
    groupId: 1,
    filterId: 1,
  },
  // Wednesday (August 6, 2025)
  {
    id: 5,
    title: "PI - T2",
    place: "Campus",
    link: "",
    start: new Date(2025, 7, 6, 8, 0),
    end: new Date(2025, 7, 6, 9, 0),
    groupId: 1,
    filterId: 1,
  },
  {
    id: 6,
    title: "SC - PL7",
    place: "Campus",
    link: "",
    start: new Date(2025, 7, 6, 9, 0),
    end: new Date(2025, 7, 6, 11, 0),
    groupId: 1,
    filterId: 1,
  },
  {
    id: 7,
    title: "SC - T1",
    place: "Campus",
    link: "",
    start: new Date(2025, 7, 6, 11, 0),
    end: new Date(2025, 7, 6, 12, 0),
    groupId: 1,
    filterId: 1,
  },
  // Friday (August 8, 2025)
  {
    id: 10,
    title: "A - TP3",
    place: "Campus",
    link: "",
    start: new Date(2025, 7, 8, 8, 0),
    end: new Date(2025, 7, 8, 10, 0),
    groupId: 1,
    filterId: 1,
  },
  {
    id: 11,
    title: "A - T1",
    place: "Campus",
    link: "",
    start: new Date(2025, 7, 8, 10, 0),
    end: new Date(2025, 7, 8, 12, 0),
    groupId: 1,
    filterId: 1,
  },
  // Saturday (August 9, 2025)
  {
    id: 12,
    title: "EPTN - TP6",
    place: "Campus",
    link: "",
    start: new Date(2025, 8, 9, 14, 0),
    end: new Date(2025, 8, 9, 16, 0),
    groupId: 1,
    filterId: 1,
  },
];

export default function Feed() {
  const [editing, setEditing] = useState(false);
  console.log("Editing mode:", editing);

  const views = useMemo(
    () => ({
      month: true,
      week: true,
      day: true,
      feed: FeedView,
    }),
    [],
  );

  return (
    <div className="flex h-screen w-full gap-8 p-8">
      <div className="h-full w-94.5 bg-gray-400">
        <button className="cursor-pointer" onClick={() => setEditing(!editing)}>
          Edit
        </button>
      </div>
      <CalendarView
        type="calendar"
        events={events}
        views={views}
        defaultView="feed"
        editing={editing}
      />
    </div>
  );
}
