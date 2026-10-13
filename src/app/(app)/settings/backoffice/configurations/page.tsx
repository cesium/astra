import { AuthCheck } from "@/components/auth-check";
import ClassesPeriodForm from "@/components/classes-period-form";
import ExchangePeriodForm from "@/components/exchange-period-form";
import SettingsWrapper from "@/components/settings-wrapper";

export default function Configurations() {
  return (
    <AuthCheck userTypes={["admin", "professor"]}>
      <SettingsWrapper title="Configuration and management">
        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-semibold">Exchange Period</h2>
            <ExchangePeriodForm />
          </section>

          <hr className="border-black/10" />

          <section>
            <h2 className="text-xl font-semibold">Classes Period</h2>
            <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div>
                <h3 className="mb-2 text-lg font-semibold">1st Semester</h3>
                <ClassesPeriodForm semester={1} />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold">2nd Semester</h3>
                <ClassesPeriodForm semester={2} />
              </div>
            </div>
          </section>
        </div>
      </SettingsWrapper>
    </AuthCheck>
  );
}
