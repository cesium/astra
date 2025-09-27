import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in | Pombo",
  description: "Sign in to manage your calendar and schedule",
  openGraph: {
    url: "/auth/sign_in",
    type: "website",
    title: "Sign in | Pombo",
    description: "Sign in to manage your calendar and schedule",
    images: [
      {
        url: "/images/og.png",
        width: 1200,
        height: 630,
        alt: process.env.PROD_DOMAIN,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign in | Pombo",
    description: "Sign in to manage your calendar and schedule",
    images: [
      {
        url: "/images/og.png",
        width: 1200,
        height: 630,
        alt: process.env.PROD_DOMAIN,
      },
    ],
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
