import { Metadata } from "next";
import SidebarSettings from "@/components/sidebar-settings";

export const metadata: Metadata = {
  title: "Settings | Pombo",
  description: "Tweak your preferences and configure Pombo to suit your needs",
  openGraph: {
    url: "/settings",
    type: "website",
    title: "Settings | Pombo",
    description:
      "Tweak your preferences and configure Pombo to suit your needs",
    images: [
      {
        url: "/images/og.png",
        width: 1200,
        height: 630,
        alt: "pombo.cesium.pt",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Settings | Pombo",
    description:
      "Tweak your preferences and configure Pombo to suit your needs",
    images: [
      {
        url: "/images/og.png",
        width: 1200,
        height: 630,
        alt: "pombo.cesium.pt",
      },
    ],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full min-h-0 w-full gap-5 lg:gap-10">
      <SidebarSettings />
      <div className="min-h-0 w-full min-w-0">{children}</div>
    </div>
  );
}
