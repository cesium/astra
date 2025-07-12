import type { Meta, StoryObj } from "@storybook/react";
import Sidebar, {
  SidebarHeader,
  SidebarItem,
  SidebarItemLabel,
  SidebarItemList,
} from "@/components/sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "Components/Sidebar",
  component: Sidebar,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  argTypes: {
    defaultSelected: {
      control: "text",
      description: "Default selected item ID",
    },
    children: {
      control: false,
      description: "Sidebar content (Header, ItemList, Item)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="max-w-xs p-4">
      <Sidebar defaultSelected="account">
        <SidebarHeader>Conta</SidebarHeader>

        <SidebarItemList>
          <SidebarItem id="account" href="/account">
            <SidebarItemLabel icon="account_circle" label="A tua conta" />
          </SidebarItem>
          <SidebarItem id="university" href="/uminho">
            <SidebarItemLabel icon="school" label="Universidade do Minho" />
          </SidebarItem>
          <SidebarItem id="privacy" href="/privacy">
            <SidebarItemLabel
              icon="back_hand"
              label="Privacidade e segurança"
            />
          </SidebarItem>
          <SidebarItem id="connections" href="/connections">
            <SidebarItemLabel icon="handshake" label="Ligações" />
          </SidebarItem>
        </SidebarItemList>
      </Sidebar>
    </div>
  ),
};

export const WithoutLabels: Story = {
  render: (args) => (
    <div className="max-w-xs p-4">
      <Sidebar defaultSelected="account">
        <SidebarHeader>Conta</SidebarHeader>

        <SidebarItemList>
          <SidebarItem id="account" href="/account">
            <p className="transition-all duration-200 ease-in-out group-hover:translate-x-1">
              A tua conta
            </p>
          </SidebarItem>
          <SidebarItem id="university" href="/uminho">
            <p className="transition-all duration-200 ease-in-out group-hover:translate-x-1">
              Universidade do Minho
            </p>
          </SidebarItem>
          <SidebarItem id="privacy" href="/privacy">
            <p className="transition-all duration-200 ease-in-out group-hover:translate-x-1">
              Privacidade e segurança
            </p>
          </SidebarItem>
          <SidebarItem id="connections" href="/connections">
            <p className="transition-all duration-200 ease-in-out group-hover:translate-x-1">
              Ligações
            </p>
          </SidebarItem>
        </SidebarItemList>
      </Sidebar>
    </div>
  ),
};
