import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Sidebar, {
  SidebarItem,
  SidebarItemLabel,
  SidebarItemList,
} from "@/components/sidebar";

const meta: Meta<typeof SidebarItemLabel> = {
  title: "Components/Sidebar/SidebarItemLabel",
  component: SidebarItemLabel,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A label component that displays an icon and text for sidebar items, featuring hover animations. Created to support sidebar usage on main pages development.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    icon: {
      control: false,
      description:
        "Material Symbols icon name that will be displayed next to the text",
    },
    label: {
      control: false,
      description: "Descriptive text of the item that appears after the icon",
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
          <SidebarItem id="example">
            <SidebarItemLabel icon="hand_gesture" label="Hello World" />
          </SidebarItem>
        </SidebarItemList>
      </Sidebar>
    </div>
  ),
};
