import { AuthCheck } from "@/components/auth-check";
import ExchangePeriodForm from "@/components/exchange-period-form";
import SettingsWrapper from "@/components/settings-wrapper";

export default function Configurations() {
  return (
    <AuthCheck userTypes={["admin", "professor"]}>
      <SettingsWrapper title="Configuration and management">
        <div className="flex h-full flex-col gap-8 pb-8">
          <section className="space-y-2">
            <ExchangePeriodForm />
          </section>
        </div>
      </SettingsWrapper>
    </AuthCheck>
  );
}
