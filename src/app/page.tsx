import AnimatedOptionsSection from "./components/animated-options-section";
import EventsOptionsSection from "./components/events-options-section"

export default function Home() {
  return (
    <div className="p-64">
      <div className="h-[774px] w-full bg-orange-700 p-8">
        <AnimatedOptionsSection classNameOpenedSection="" title="Opções" titleEdit="Editar Calendários">
          <div>
            CHILDREN 1
            <span data-edit-button>JONAS</span>
          </div>
          <div>
            CHILDREN 2
          </div>
        </AnimatedOptionsSection>
      </div>
    </div>
  )
}
