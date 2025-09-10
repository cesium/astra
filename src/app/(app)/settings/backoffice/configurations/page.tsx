import ExchangePeriodForm from "@/components/exchange-period-form";
import SettingsWrapper from "@/components/settings-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pombo | Configurations",
};

export default function Configurations() {
  return (
    <SettingsWrapper title="Configuration and management">
      <h2 className="text-xl font-semibold">Exchange Period</h2>
      <ExchangePeriodForm />
    </SettingsWrapper>
  );
}
