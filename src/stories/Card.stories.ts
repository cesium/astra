import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Card from "../components/Card";

const meta = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    children: "Card",
    className: "underline",
  },
};
