import SettingsWrapper from "@/components/settings-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pombo | Account",
};

export default function Account() {
  return (
    <SettingsWrapper title="Account and profile">
      <div>Account Page</div>
    </SettingsWrapper>
  );
}
