import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Disclosure from "@/app/components/disclosure";

const meta: Meta<typeof Disclosure> = {
  title: "Components/Disclosure",
  component: Disclosure,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  argTypes: {
    defaultOpen: {
      control: "boolean",
      description: "Controls whether the disclosure is open by default",
      defaultValue: false,
    },
    as: {
      control: "text",
      description:
        "The HTML element or component to render as the disclosure root",
      defaultValue: "div",
    },
    onToggle: {
      action: "toggled",
      description: "Callback function called when the disclosure is toggled",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const courses = {
  "1º Ano": {
    "1º Semestre": [
      "Álgebra Linear",
      "Laboratórios de Informática I",
      "Programação Funcional",
      "Tópicos de Matemática Discreta",
      "Opção UMinho",
    ],
    "2º Semestre": [
      "Álgebra Linear",
      "Laboratórios de Informática I",
      "Programação Funcional",
      "Tópicos de Matemática Discreta",
      "Opção UMinho",
    ],
  },
  "2º Ano": [],
  "3º Ano": [],
  "4º Ano": [],
  "5º Ano": [],
  Outros: [],
};

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-sm rounded-lg bg-zinc-50 p-4 text-sm text-zinc-800 shadow-md">
      {Object.entries(courses).map(([year, semesters]) => (
        <Disclosure key={year} defaultOpen={year === "1º Ano"} title={year}>
          <div className="mt-1 ml-4">
            {Object.entries(semesters).map(([semester, units]) => (
              <Disclosure
                key={semester}
                defaultOpen={semester === "1º Semestre"}
                title={semester}
              >
                <div className="mt-1 ml-4 space-y-1 rounded-lg bg-white p-2 shadow-sm">
                  {units.length > 0 &&
                    units.map((unitName) => (
                      <div
                        key={unitName}
                        className="flex w-full items-center justify-between rounded-lg px-2 py-3 text-left transition-colors hover:bg-zinc-100"
                      >
                        <div className="flex items-center">
                          <div className="mr-2 ml-1 h-3 w-1.5 rounded-full bg-blue-200" />
                          {unitName}
                        </div>
                        <button
                          className="material-symbols-outlined rounded-full bg-green-400 p-1 text-white hover:bg-green-500"
                          style={{ fontSize: 20 }}
                        >
                          add
                        </button>
                      </div>
                    ))}
                </div>
              </Disclosure>
            ))}
          </div>
        </Disclosure>
      ))}
    </div>
  ),
};
