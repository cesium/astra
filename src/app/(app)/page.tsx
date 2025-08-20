import { Metadata } from "next";
import EventsCalendar from "@/components/events-calendar";
import AnimatedOptionsSection from "@/components/animated-options-section";

export const metadata: Metadata = {
  title: "Pombo | Calendar",
};

export default function Home() {
  return (
    <div className="flex md:gap-8">
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
