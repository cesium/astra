import AnimatedOptionsSection from '@/app/components/animated-options-section'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'

const meta: Meta<typeof AnimatedOptionsSection> = {
  title: 'Components/AnimatedOptionsSection',
  component: AnimatedOptionsSection,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof AnimatedOptionsSection>

const AnimatedOptionsSectionExample = () => {
  return (
    <div className="w-full flex h-screen items-center bg-gray-100 p-8">
        <AnimatedOptionsSection
          title="Settings"
          titleEdit="Edit Settings"
          >
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span>Theme</span>
              <span className="text-blue-600">Dark Mode</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span>Language</span>
              <span className="text-blue-600">Português</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span>Notifications</span>
              <span className="text-green-600">Enabled</span>
            </div>
            <button
              data-edit-button
              className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
              Edit Settings
            </button>
          </div>

          <div className="p-4 space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Theme</label>
              <select className="w-full p-2 border border-gray-300 rounded-md" defaultValue="Dark Mode">
                <option>Light Mode</option>
                <option>Dark Mode</option>
                <option>Auto</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Language</label>
              <select className="w-full p-2 border border-gray-300 rounded-md" defaultValue="Português">
                <option>English</option>
                <option>Português</option>
                <option>Español</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Notifications</label>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="notifications" defaultChecked className="rounded" />
                <label htmlFor="notifications" className="text-sm">Enable push notifications</label>
              </div>
            </div>
            <div className="flex space-x-3 pt-4">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Save Changes
              </button>
              <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </AnimatedOptionsSection>
        <div>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam nemo, distinctio eius voluptate consequuntur veniam earum qui, illum repellat accusantium soluta ea odio dolor impedit? Aut itaque consequuntur sit dolore?</p>
        </div>
    </div>
  )
}

export const Default: Story = {
    render: () => <AnimatedOptionsSectionExample />,
}