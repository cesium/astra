import AnimatedOptionsSection from "./components/animated-options-section";
import EventsOptionsSection from "./components/events-options-section"

export default function Home() {
  return (
    <div className="p-64">
      <AnimatedOptionsSection classNameOpenedSection="py-5 px-3">
        <div>
          CHILDREN 1
          <span data-edit-button>JONAS</span>
        </div>
        <div>
          CHILDREN 2
        </div>
      </AnimatedOptionsSection>  
    </div>
  )
}
