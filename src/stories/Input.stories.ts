import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { fn } from 'storybook/test';

import Input from '../components/input';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    placeholder: 'Jonas Doe',
    type: 'text',
    disabled: false,
    className: 'px-4 py-2 rounded text-gray-800',
    name: 'Name',
    value: 'Jonas Doe',
    center_text: true,
    min: undefined,
    max: undefined,
    onChange: fn(),
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};