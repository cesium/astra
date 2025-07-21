import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { fn } from 'storybook/test';

import ToggleSwitch from '../../components/switch';

const meta = {
  title: 'Components/ToggleSwitch',
  component: ToggleSwitch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    initialState: { control: 'boolean' },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
  args: { onToggle: fn() },
} satisfies Meta<typeof ToggleSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Enabled: Story = {
  args: {
    initialState: false,
    size: 'medium',
  },
};

export const Disabled: Story = {
  args: {
    initialState: true,
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    initialState: false,
    size: 'large',
  },
};

export const Small: Story = {
  args: {
    initialState: true,
    size: 'small',
  },
};