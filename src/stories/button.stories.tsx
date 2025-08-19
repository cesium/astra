import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MdKey, MdDownload } from "react-icons/md";
import Button from "@/components/button";

type T = typeof Button;

const meta: Meta<T> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    iconPosition: { control: "radio", options: ["left", "right"] },
    onClick: { action: "clicked" },
    href: { control: "text" },
    disabled: { control: "boolean" },
    ariaLabel: { control: "text" },
    icon: { control: false },
  },
};

export default meta;

export const TextAndIcon: StoryObj<T> = {
  args: {
    children: "Entrar",
    onClick: () => alert("Entrar"),
    icon: <MdDownload />,
    iconPosition: "left",
    className:
      "border-black border-0 bg-gray-100 px-4 py-3 text-black rounded-full transition duration-200 ease-in-out hover:scale-105 active:scale-95",
  },
};

export const IconOnly: StoryObj<T> = {
  args: {
    icon: <MdDownload />,
    iconPosition: "right",
    ariaLabel: "Transferir",
    onClick: () => console.log("Transferir"),
    className: "text-orange-500 border-0",
  },
};

export const TextOnly: StoryObj<T> = {
  args: {
    children: "Editar",
    className: "text-orange-400",
  },
};

export const Link: StoryObj<T> = {
  args: {
    href: "https://github.com/cesium/astra/issues/2",
    children: "Issue",
    icon: <MdKey />,
    iconPosition: "left",
    className: "border-orange-500 text-orange-500",
  },
};
