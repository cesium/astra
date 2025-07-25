import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Sidebar, {
  SidebarHeader,
  SidebarItem,
  SidebarItemLabel,
  SidebarItemList,
} from "@/components/sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "Components/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A flexible sidebar container that manages selection state and provides context for child components. Serves as the root wrapper that coordinates the active state across all sidebar items.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    defaultSelected: {
      control: "text",
      description:
        "ID of the item that should be selected by default when the component loads",
    },
    children: {
      control: false,
      description:
        "Sidebar child elements that compose the internal content of the sidebar",
    },
    className: {
      control: "text",
      description:
        "Additional CSS classes to customize the styling of the main container",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="max-w-xs p-4">
      <Sidebar defaultSelected="account">
        <SidebarHeader>Account</SidebarHeader>

        <SidebarItemList>
          <SidebarItem id="account" href="/account">
            <SidebarItemLabel icon="account_circle" label="Your Account" />
          </SidebarItem>
          <SidebarItem id="university" href="/uminho">
            <SidebarItemLabel icon="school" label="Minho University" />
          </SidebarItem>
          <SidebarItem id="privacy" href="/privacy">
            <SidebarItemLabel icon="back_hand" label="Privacy" />
          </SidebarItem>
          <SidebarItem id="connections" href="/connections">
            <SidebarItemLabel icon="handshake" label="Connections" />
          </SidebarItem>
        </SidebarItemList>
      </Sidebar>
    </div>
  ),
};

export const WithoutLabels: Story = {
  render: () => (
    <div className="max-w-xs p-4">
      <Sidebar defaultSelected="account">
        <SidebarHeader>Conta</SidebarHeader>

        <SidebarItemList>
          <SidebarItem id="account" href="/account">
            <p className="transition-all duration-200 ease-in-out group-hover:translate-x-1">
              Your Account
            </p>
          </SidebarItem>
          <SidebarItem id="university" href="/uminho">
            <p className="transition-all duration-200 ease-in-out group-hover:translate-x-1">
              Minho University
            </p>
          </SidebarItem>
          <SidebarItem id="privacy" href="/privacy">
            <p className="transition-all duration-200 ease-in-out group-hover:translate-x-1">
              Privacy
            </p>
          </SidebarItem>
          <SidebarItem id="connections" href="/connections">
            <p className="transition-all duration-200 ease-in-out group-hover:translate-x-1">
              Connections
            </p>
          </SidebarItem>
        </SidebarItemList>
      </Sidebar>
    </div>
  ),
};
