import AnimatedOptionsSection from "@/components/animated-options-section";
import Card from "@/components/card";

export default function Home() {
  return (
    <>
      <div className="w-full flex h-screen items-center justify-center bg-white p-8">
        <AnimatedOptionsSection
          title="My Options"
          titleEdit="Edit My Options"
          classNameOpenedSection=""
          >
          <div className="p-4">
            <p>This is the jonas of the options section.</p>
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
              data-edit-button
              >
              Edit
            </button>
          </div>
          <div className="p-4">
            <p>This is the editing jonas of the options section.</p>
            <button className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded">
              Jonas
            </button>
          </div>
        </AnimatedOptionsSection>
        <div className="w-full h-[90vh]">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum laborum aperiam, illo consectetur velit voluptatum sint provident quo. Totam modi laudantium esse saepe est, illo maiores repudiandae quibusdam enim animi.</p>
        </div>
      </div>
      <Card>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet corrupti commodi neque voluptatem atque repudiandae optio! Exercitationem recusandae aliquam provident tempore! Eum aliquid eveniet ullam aliquam error iusto cumque. Facilis.
      </Card>
    </>
  );
}