import ExchangeDrafts from "./exchange-drafts";
import ExchangePending from "./exchange-pending";
import ExchangeCompleted from "./exchange-completed";

export default function MainSection() {
  return (
    <div className="flex w-full flex-col gap-8">
      <ExchangeDrafts />
      <ExchangePending />
      <ExchangeCompleted />
    </div>
  );
}
