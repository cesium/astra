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
          "A robust file uploader component with drag-and-drop support, file type validation, size limits, and elegant error handling using Zod validation.",
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
    allowedTypes: {
      control: "object",
      description:
        "Array of allowed MIME types for validation (e.g., ['image/jpeg', 'image/png'])",
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
    showSelectedFile: {
      control: "boolean",
      description:
        "Whether to show the selected file details below the uploader",
      defaultValue: true,
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
};

export const ImagesOnly: Story = {
  render: (args) => (
    <div className="w-full max-w-md">
      <FileUploader {...args} />
    </div>
  ),
  args: {
    allowedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
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
  },
};

export const DocumentsOnly: Story = {
  render: (args) => (
    <div className="w-full max-w-md">
      <FileUploader {...args} />
    </div>
  ),
  args: {
    allowedTypes: ["application/pdf", "application/msword", "text/plain"],
  },
};

export const StrictImageUpload: Story = {
  render: (args) => (
    <div className="w-full max-w-md">
      <FileUploader {...args} />
    </div>
  ),
  args: {
    allowedTypes: ["image/jpeg", "image/png"],
    maxSize: 2 * 1024 * 1024, // 2MB limit
  },
};

export const MixedFileTypes: Story = {
  render: (args) => (
    <div className="w-full max-w-md">
      <FileUploader {...args} />
    </div>
  ),
  args: {
    allowedTypes: [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "text/plain",
      "application/zip",
    ],
    maxSize: 10 * 1024 * 1024, // 10MB limit
  },
};

export const SmallPDFOnly: Story = {
  render: (args) => (
    <div className="w-full max-w-md">
      <FileUploader {...args} />
    </div>
  ),
  args: {
    allowedTypes: ["application/pdf"],
    maxSize: 1 * 1024 * 1024, // 1MB limit
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

export const HiddenFilePreview: Story = {
  render: (args) => (
    <div className="w-full max-w-md">
      <FileUploader {...args} />
    </div>
  ),
  args: {
    showSelectedFile: false,
    allowedTypes: ["image/jpeg", "image/png"],
    maxSize: 5 * 1024 * 1024, // 5MB limit
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
