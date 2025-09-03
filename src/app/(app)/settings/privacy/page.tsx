import SettingsWrapper from "@/components/settings-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pombo | Privacy",
};

export default function Privacy() {
  return (
    <SettingsWrapper title="Privacy and data">
      <div>Privacy Page</div>
    </SettingsWrapper>
  );
}
