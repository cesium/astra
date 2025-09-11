import { AuthCheck } from "@/components/auth-check";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pombo | Exchange",
};

export default function Exchange() {
  return (
    <AuthCheck userTypes={["student"]}>
      <div>Exchange Page</div>
    </AuthCheck>
  );
}
