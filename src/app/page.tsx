import AnimatedOptionsSection from "./components/animated-options-section";
import EventsOptionsSection from "./components/events-options-section"

export default function Home() {
  return (
    <div className="p-64">
      <AnimatedOptionsSection classNameOpenedSection="py-5 px-3">
        <EventsOptionsSection>
          
        </EventsOptionsSection>
      </AnimatedOptionsSection>  
    </div>
  )
}
