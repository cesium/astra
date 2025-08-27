import MainSection from "@/components/exchange/main-section";
import SideSection from "@/components/exchange/side-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pombo | Exchange",
};

export default function Exchange() {
  return (
    <div className="flex w-full flex-col-reverse gap-8 lg:gap-14 lg:flex-row">
      <SideSection />
      <MainSection />
    </div>
  );
}
