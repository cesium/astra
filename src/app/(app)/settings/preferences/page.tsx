import SettingsWrapper from "@/components/settings-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pombo | Preferences",
};

export default function Preferences() {
  return (
    <SettingsWrapper title="Preferences and customization">
      <div>Preferences Page</div>
    </SettingsWrapper>
  );
}
