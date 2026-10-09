import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Pombo",
  description: "Reset your password to regain access to your account",
  openGraph: {
    url: "/auth/forgot_password",
    type: "website",
    title: "Forgot Password | Pombo",
    description: "Reset your password to regain access to your account",
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
    title: "Forgot Password | Pombo",
    description: "Reset your password to regain access to your account",
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

export default function ForgotPasswordLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
