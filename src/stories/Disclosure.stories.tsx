import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Disclosure, {
  DisclosureButton as Button,
  DisclosurePanel as Panel,
} from "@/app/components/disclosure";

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

function ChevronToggle({ open, label }: { open: boolean; label: string }) {
  return (
    <Button className="mb-1 flex w-full items-center rounded-lg px-2 py-3 transition-colors hover:bg-zinc-100">
      <span
        className="material-symbols-outlined mr-2 text-zinc-500"
        style={{ fontSize: 20 }}
      >
        {open ? "expand_less" : "expand_more"}
      </span>
      <div className="w-full text-left font-medium">{label}</div>
    </Button>
  );
}

export const Default: Story = {
  args: {
    defaultOpen: false,
    as: "div",
  },
  render: (args) => (
    <div className="w-full max-w-sm rounded-lg bg-zinc-50 p-4 text-sm text-zinc-800 shadow-md">
      <h1 className="mb-4 text-lg text-zinc-500">Disponíveis para adicionar</h1>
      {Object.entries(courses).map(([year, semesters]) => (
        <Disclosure key={year} defaultOpen={year === "1º Ano"} {...args}>
          {({ open }) => (
            <>
              <ChevronToggle open={open} label={year} />
              <Panel className="mt-1 ml-4">
                {Object.entries(semesters).map(([semester, units]) => (
                  <Disclosure
                    key={semester}
                    defaultOpen={semester === "1º Semestre"}
                  >
                    {({ open: semOpen }) => (
                      <>
                        <ChevronToggle open={semOpen} label={semester} />
                        <Panel className="mt-1 ml-4 space-y-1 rounded-lg bg-white shadow-sm">
                          {Array.isArray(units) && units.length > 0 ? (
                            units.map((unitName) => (
                              <div
                                key={unitName}
                                className="flex w-full items-center justify-between rounded-lg px-2 py-3 text-left transition-colors hover:bg-zinc-100"
                              >
                                <div className="flex items-center">
                                  <div className="mr-2 ml-1 h-3 w-1.5 rounded-full bg-blue-200" />
                                  {unitName}
                                </div>
                                <span
                                  className="material-symbols-outlined rounded-full bg-green-400 p-1 text-white hover:bg-green-500"
                                  style={{ fontSize: 20 }}
                                  aria-label="Adicionar"
                                >
                                  add
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="px-2 py-2 text-zinc-400 italic">
                              Sem unidades curriculares disponíveis
                            </div>
                          )}
                        </Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </Panel>
            </>
          )}
        </Disclosure>
      ))}
    </div>
  ),
};
