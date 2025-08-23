import Navbar from "@/components/navbar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col">
      <Navbar />
      <main className="flex-1 overflow-y-auto px-5 pt-3.5 pb-7.5 antialiased md:px-7.5">
        {children}
      </main>
    </div>
  );
}
