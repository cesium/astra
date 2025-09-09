import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pombo | Settings",
};

export default function Settings() {
  return (
    <div className="hidden h-full w-full items-center justify-center md:flex">
      <Link
        href="/settings/account"
        className="text-dark/50 hover:text-primary-400/80 mb-20 transition-colors duration-300"
      >
        Nothing here
      </Link>
    </div>
  );
}
