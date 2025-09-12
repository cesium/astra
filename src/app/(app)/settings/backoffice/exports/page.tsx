import { AuthCheck } from "@/components/auth-check";
import SettingsWrapper from "@/components/settings-wrapper";

export default function Exports() {
  return (
    <>
      <title>Exports | Backoffice | Pombo</title>
      <AuthCheck userTypes={["admin", "professor"]}>
        <SettingsWrapper title="Export data">
          <div>Exports Page</div>
        </SettingsWrapper>
      </AuthCheck>
    </>
  );
}
