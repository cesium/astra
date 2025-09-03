import SettingsWrapper from "@/components/settings-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pombo | Imports",
};

export default function Imports() {
  return (
    <SettingsWrapper title="Import data">
      <div>Imports Page</div>
    </SettingsWrapper>
  );
}
