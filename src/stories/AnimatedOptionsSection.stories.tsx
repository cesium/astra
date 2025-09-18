import AnimatedOptionsSection from "@/components/animated-options-section";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof AnimatedOptionsSection> = {
  title: "Components/AnimatedOptionsSection",
  component: AnimatedOptionsSection,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof AnimatedOptionsSection>;

const AnimatedOptionsSectionExample = () => {
  return (
    <div className="flex h-screen w-full items-center bg-gray-100 p-8">
      <AnimatedOptionsSection title="Settings" titleEdit="Edit Settings">
        <div className="space-y-4 p-4">
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
            <span>Theme</span>
            <span className="text-blue-600">Dark Mode</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
            <span>Language</span>
            <span className="text-blue-600">Português</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
            <span>Notifications</span>
            <span className="text-green-600">Enabled</span>
          </div>
          <button
            data-edit-button
            className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Edit Settings
          </button>
        </div>

        <div className="space-y-6 p-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Theme
            </label>
            <select
              className="w-full rounded-md border border-gray-300 p-2"
              defaultValue="Dark Mode"
            >
              <option>Light Mode</option>
              <option>Dark Mode</option>
              <option>Auto</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Language
            </label>
            <select
              className="w-full rounded-md border border-gray-300 p-2"
              defaultValue="Português"
            >
              <option>English</option>
              <option>Português</option>
              <option>Español</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Notifications
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="notifications"
                defaultChecked
                className="rounded"
              />
              <label htmlFor="notifications" className="text-sm">
                Enable push notifications
              </label>
            </div>
          </div>
          <div className="flex space-x-3 pt-4">
            <button className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
              Save Changes
            </button>
            <button className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </div>
      </AnimatedOptionsSection>
      <div>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
          nemo, distinctio eius voluptate consequuntur veniam earum qui, illum
          repellat accusantium soluta ea odio dolor impedit? Aut itaque
          consequuntur sit dolore?
        </p>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => <AnimatedOptionsSectionExample />,
};
