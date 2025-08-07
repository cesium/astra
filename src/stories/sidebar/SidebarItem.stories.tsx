import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Sidebar, { SidebarItem } from "@/components/sidebar";

const meta: Meta<typeof SidebarItem> = {
  title: "Components/Sidebar/SidebarItem",
  component: SidebarItem,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "An interactive menu item that can function as either a navigation link or button. Handles selection state, hover effects, and supports both Next.js routing and custom click handlers with visual feedback.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: false,
      description: "Internal content of the item",
    },
    id: {
      control: "text",
      description:
        "Required unique identifier used to control which item is active/selected",
    },
    href: {
      control: "text",
      description:
        "Destination URL, when provided transforms the item into a Next.js Link",
    },
    onClick: {
      control: false,
      description:
        "Callback executed on click, when provided transforms the item into a button",
    },
    className: {
      control: false,
      description:
        "Additional CSS classes to customize individual item appearance",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="max-w-xs p-4">
      <Sidebar>
        <SidebarItem id="example">Selectable Item</SidebarItem>
      </Sidebar>
    </div>
  ),
};
