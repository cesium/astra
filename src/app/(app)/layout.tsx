import { Metadata } from "next";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "Calendar | Pombo",
  description: "Keep track of your calendar and don't miss a single deadline",
  openGraph: {
    url: "/",
    type: "website",
    title: "Calendar | Pombo",
    description: "Keep track of your calendar and don't miss a single deadline",
    images: [
      {
        url: "/images/og.png",
        width: 1200,
        height: 630,
        alt: "pombo.di.uminho.pt",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calendar | Pombo",
    description: "Keep track of your calendar and don't miss a single deadline",
    images: [
      {
        url: "/images/og.png",
        width: 1200,
        height: 630,
        alt: "pombo.di.uminho.pt",
      },
    ],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-dvh flex-col">
      <Navbar />
      <main className="min-h-0 flex-1 px-5 pt-3.5 pb-7.5 antialiased md:px-7.5">
        {children}
      </main>
    </div>
  );
}
