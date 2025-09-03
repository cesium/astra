import Link from "next/link";
import React from "react";

export default function SettingsWrapper({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <div className="inline-flex w-full items-center md:hidden">
        <Link
          href="/settings"
          className="material-symbols-outlined text-dark/50 -ml-2.5 text-4xl"
        >
          chevron_left
        </Link>
        <h2 className="flex flex-1 justify-center pr-6.5 font-semibold">
          {title}
        </h2>
      </div>
      <div className="px-1.5 pt-7 md:px-0 md:pt-0">{children}</div>
    </div>
  );
}
