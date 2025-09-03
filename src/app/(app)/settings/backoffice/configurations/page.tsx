import SettingsWrapper from "@/components/settings-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pombo | Configurations",
};

export default function Configurations() {
  return (
    <SettingsWrapper title="Configuration and management">
      <div>Configurations Page</div>
    </SettingsWrapper>
  );
}
