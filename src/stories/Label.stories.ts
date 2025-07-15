import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { fn } from 'storybook/test';

import Label from '../components/label_component';

const meta = {
  title: 'Components/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Enabled: Story = {
  args: {
    children: 'Label',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Label',
    disabled: true,
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    children: 'Label',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    children: 'Label',
  },
};