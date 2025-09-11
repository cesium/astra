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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full flex-col gap-2">
        <h2 className="font-semibold">Exchange request information</h2>
        <div className="flex w-full gap-20">
          <div className="flex flex-col justify-between gap-1">
            <span className="text-gray-500">Curricular Unit</span>
            <span className="text-gray-500">Shift type</span>
            <span className="text-gray-500">Exchange</span>
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
        <h2 className="font-semibold">State</h2>
        <div className="flex gap-4">
          <div className="flex w-1/2 flex-col items-center gap-1">
            <div
              className={`h-2 w-full rounded-full ${isEqual({ n, x: 1 }) ? loadingStyle : 1 < n ? "bg-celeste" : "bg-gray-300"}`}
            ></div>
            <span className="text-sm">Pending</span>
          </div>
          <div className="flex w-1/2 flex-col items-center gap-1">
            <div
              className={`h-2 w-full rounded-full ${isEqual({ n, x: 2 }) ? "bg-celeste" : "bg-gray-300"}`}
            ></div>
            <span className="text-sm">Completed</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-col items-center gap-2 p-4 text-center">
        <span className="text-xl font-semibold">
          {isPending
            ? "Your request is being processed."
            : "This request has been completed."}
        </span>
        <span className="text-gray-500">
          {isPending
            ? "If a suitable exchange is found, you will be notified."
            : "You can view the details of your completed request here."}
        </span>
      </div>
    </div>
  );
}
