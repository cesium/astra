import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exchange | Pombo",
  description:
    "Don't like your schedule? Easily swap classes with other students",
  openGraph: {
    url: "/exchange",
    type: "website",
    title: "Exchange | Pombo",
    description:
      "Don't like your schedule? Easily swap classes with other students",
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
    title: "Exchange | Pombo",
    description:
      "Don't like your schedule? Easily swap classes with other students",
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

export default function ExchangeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
