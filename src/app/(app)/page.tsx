import { Metadata } from "next";
import EventsCalendar from "@/components/events-calendar";
import AnimatedOptionsSection from "@/components/animated-options-section";

export const metadata: Metadata = {
  title: "Pombo | Calendar",
};

export default function Home() {
  return (
    <div className="flex flex-col-reverse gap-5 md:flex-row">
      <AnimatedOptionsSection>
        <div className="">
          <span data-edit-button>Edit</span>
        </div>
        <div>Some content here</div>
      </AnimatedOptionsSection>
      <EventsCalendar />
    </div>
  );
}
