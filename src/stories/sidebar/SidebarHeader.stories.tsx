import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Sidebar, { SidebarHeader } from "@/components/sidebar";

const meta: Meta<typeof SidebarHeader> = {
  title: "Components/Sidebar/SidebarHeader",
  component: SidebarHeader,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A styled header section for the sidebar with bottom border separation. Typically used to display titles.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: false,
      description: "Header content. Typically a title",
    },
    className: {
      control: false,
      description:
        "Additional CSS classes to override or extend the default header styling",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="max-w-xs p-4">
      <Sidebar>
        <SidebarHeader>Hello World!</SidebarHeader>
      </Sidebar>
    </div>
  ),
};
