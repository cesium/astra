import SettingsWrapper from "@/components/settings-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pombo | Connections",
};

export default function Connections() {
  return (
    <SettingsWrapper title="Connections and services">
      <div>Connections Page</div>
    </SettingsWrapper>
  );
}
