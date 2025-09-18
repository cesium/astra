import MainSection from "@/components/exchange/main-section";
import SideSection from "@/components/exchange/side-section";
import { AuthCheck } from "@/components/auth-check";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pombo | Exchange",
};

export default function Exchange() {
  return (
    <AuthCheck userTypes={["student"]}>
      <div className="flex w-full flex-col-reverse gap-8 pb-8 lg:flex-row lg:gap-14">
        <SideSection />
        <MainSection />
      </div>
    </AuthCheck>
  );
}
