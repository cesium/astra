import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import FileUploader from "@/components/file-uploader";

const meta: Meta<typeof FileUploader> = {
  title: "Components/FileUploader",
  component: FileUploader,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A simple, responsive single file uploader component that supports drag-and-drop and click-to-upload functionality. Matches the exact UI design with proper visual states.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    onFileChange: {
      action: "file changed",
      description:
        "Callback function called when a file is selected or removed",
    },
    accept: {
      control: "text",
      description: "File types to accept (MIME types or file extensions)",
      defaultValue: "*/*",
    },
    maxSize: {
      control: "number",
      description: "Maximum file size in bytes",
    },
    disabled: {
      control: "boolean",
      description: "Whether the file uploader is disabled",
      defaultValue: false,
    },
    className: {
      control: "text",
      description: "Additional CSS classes for the container",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-full max-w-md">
      <FileUploader {...args} />
    </div>
  ),
  args: {
    accept: "*/*",
  },
};

export const ImagesOnly: Story = {
  render: (args) => (
    <div className="w-full max-w-md">
      <FileUploader {...args} />
    </div>
  ),
  args: {
    accept: "image/*",
  },
};

export const WithSizeLimit: Story = {
  render: (args) => (
    <div className="w-full max-w-md">
      <FileUploader {...args} />
    </div>
  ),
  args: {
    maxSize: 5 * 1024 * 1024, // 5MB limit
    accept: "*/*",
  },
};

export const DocumentsOnly: Story = {
  render: (args) => (
    <div className="w-full max-w-md">
      <FileUploader {...args} />
    </div>
  ),
  args: {
    accept:
      ".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain",
  },
};

export const Disabled: Story = {
  render: (args) => (
    <div className="w-full max-w-md">
      <FileUploader {...args} />
    </div>
  ),
  args: {
    disabled: true,
  },
};

export const Mobile: Story = {
  render: (args) => (
    <div className="w-full max-w-xs">
      <FileUploader {...args} />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const Tablet: Story = {
  render: (args) => (
    <div className="w-full max-w-lg">
      <FileUploader {...args} />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
};

export const Desktop: Story = {
  render: (args) => (
    <div className="w-full max-w-xl">
      <FileUploader {...args} />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
};
