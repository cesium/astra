import Link from "next/link";

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
