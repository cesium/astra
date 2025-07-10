import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import '../app/globals.css';
import Card from '../components/Card';

const meta = {
  title: 'Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    children: 'Card',
  },
};