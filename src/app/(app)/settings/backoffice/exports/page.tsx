import { AuthCheck } from "@/components/auth-check";
import SettingsWrapper from "@/components/settings-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pombo | Exports",
};

export default function Exports() {
  return (
    <AuthCheck userTypes={["admin", "professor"]}>
      <SettingsWrapper title="Export data">
        <div>Exports Page</div>
      </SettingsWrapper>
    </AuthCheck>
  );
}
