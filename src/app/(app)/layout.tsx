import Navbar from "@/components/navbar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="px-5 py-3.5 antialiased md:px-7.5">{children}</main>
    </>
    
  );
}
