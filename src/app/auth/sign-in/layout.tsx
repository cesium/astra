import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in | Pombo",
  description: "Sign in to manage your calendar and schedule",
  openGraph: {
    url: "/auth/sign-in",
    type: "website",
    title: "Sign in | Pombo",
    description: "Sign in to manage your calendar and schedule",
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
    title: "Sign in | Pombo",
    description: "Sign in to manage your calendar and schedule",
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

export default function SignInLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
