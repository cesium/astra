import { AuthCheck } from "@/components/auth-check";
import ExchangePeriodForm from "@/components/exchange-period-form";
import SettingsWrapper from "@/components/settings-wrapper";

export default function Configurations() {
  return (
    <>
      <title>Configurations | Backoffice | Pombo</title>
      <AuthCheck userTypes={["admin", "professor"]}>
        <SettingsWrapper title="Configuration and management">
          <h2 className="text-xl font-semibold">Exchange Period</h2>
          <ExchangePeriodForm />
        </SettingsWrapper>
      </AuthCheck>
    </>
  );
}
