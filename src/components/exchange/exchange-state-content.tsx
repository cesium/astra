import { useDictionary } from "@/providers/dictionary-provider";

function isEqual({ n, x }: { n: number; x: number }) {
  return n === x;
}

export default function ExchangeStateContent({
  uc,
  from,
  to,
  shift,
  status,
}: {
  uc: string;
  from: string;
  to: string;
  shift: string;
  status: "pending" | "completed";
}) {
  const isPending = status === "pending";
  const loadingStyle =
    "animated-background bg-gradient-to-r from-celeste via-celeste/30 to-celeste";

  const n = (() => {
    switch (status) {
      case "pending":
        return 1;
      case "completed":
        return 2;
      default:
        return 1;
    }
  })();
  const dict = useDictionary();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full flex-col gap-2">
        <h2 className="font-semibold">
          {dict.pages.exchange.forms.state_view.description}
        </h2>
        <div className="flex w-full gap-20">
          <div className="flex flex-col justify-between gap-1">
            <span className="text-gray-500">
              {dict.pages.exchange.forms.state_view.fields.curricular_unit}
            </span>
            <span className="text-gray-500">
              {dict.pages.exchange.forms.state_view.fields.shift_type}
            </span>
            <span className="text-gray-500">
              {dict.pages.exchange.forms.state_view.fields.exchange}
            </span>
          </div>
          <div className="flex flex-col justify-between gap-1">
            <span>{uc}</span>
            <span>{shift}</span>
            <div className="flex items-center gap-1">
              <span>{from}</span>
              <span className="material-symbols-outlined">arrow_forward</span>
              <span>{to}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="font-semibold">
          {dict.pages.exchange.forms.state_view.fields.exchange}
        </h2>
        <div className="flex gap-4">
          <div className="flex w-1/2 flex-col items-center gap-1">
            <div
              className={`h-2 w-full rounded-full ${isEqual({ n, x: 1 }) ? loadingStyle : 1 < n ? "bg-celeste" : "bg-gray-300"}`}
            ></div>
            <span className="text-sm">{dict.ui.common.states.pending}</span>
          </div>
          <div className="flex w-1/2 flex-col items-center gap-1">
            <div
              className={`h-2 w-full rounded-full ${isEqual({ n, x: 2 }) ? "bg-celeste" : "bg-gray-300"}`}
            ></div>
            <span className="text-sm">{dict.ui.common.states.completed}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-col items-center gap-2 p-4 text-center">
        <span className="text-xl font-semibold">
          {isPending
            ? `${dict.pages.exchange.forms.state_view.info.pending}`
            : `${dict.pages.exchange.forms.state_view.info.completed}`}
        </span>
        <span className="text-gray-500">
          {isPending
            ? `${dict.pages.exchange.forms.state_view.disclaimer.pending}`
            : `${dict.pages.exchange.forms.state_view.disclaimer.completed}`}
        </span>
      </div>
    </div>
  );
}
