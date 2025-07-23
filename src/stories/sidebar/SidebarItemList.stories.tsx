import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Sidebar, { SidebarItem, SidebarItemList } from "@/components/sidebar";

const meta: Meta<typeof SidebarItemList> = {
  title: "Components/Sidebar/SidebarItemList",
  component: SidebarItemList,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A vertical container that organizes sidebar items with consistent spacing.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: false,
      description:
        "List of SidebarItem components that form the navigable menu items",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="max-w-xs p-4">
      <Sidebar>
        <SidebarItemList>
          <SidebarItem id="example">Hello World!</SidebarItem>
        </SidebarItemList>
      </Sidebar>
    </div>
  ),
};
