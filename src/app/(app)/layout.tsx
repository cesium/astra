import { AuthCheck } from "@/components/auth-check";
import Navbar from "@/components/navbar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthCheck shouldBeLoggedIn>
      <div className="flex min-h-dvh flex-col">
        <Navbar />
        <main className="min-h-0 flex-1 px-5 pt-3.5 pb-7.5 antialiased md:px-7.5">
          {children}
        </main>
      </div>
    </AuthCheck>
  );
}
