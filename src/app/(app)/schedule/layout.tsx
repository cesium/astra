import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schedule | Pombo",
  description: "Keep track of your timetable and don't miss a single class",
  openGraph: {
    url: "/schedule",
    type: "website",
    title: "Schedule | Pombo",
    description: "Keep track of your timetable and don't miss a single class",
    // images: [
    //   {
    //     url: "/images/og.jpg",
    //     width: 1200,
    //     height: 630,
    //     alt: "pombo.di.uminho.pt",
    //   },
    // ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Schedule | Pombo",
    description: "Keep track of your timetable and don't miss a single class",
    // images: [
    //   {
    //     url: "/images/og.jpg",
    //     width: 1200,
    //     height: 630,
    //     alt: "pombo.di.uminho.pt",
    //   },
    // ],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ScheduleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
