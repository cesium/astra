import { AuthCheck } from "@/components/auth-check";
import SettingsWrapper from "@/components/settings-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pombo | Configurations",
};

export default function Configurations() {
  return (
    <AuthCheck userTypes={["admin", "professor"]}>
      <SettingsWrapper title="Configuration and management">
        <div>Configurations Page</div>
      </SettingsWrapper>
    </AuthCheck>
  );
}
