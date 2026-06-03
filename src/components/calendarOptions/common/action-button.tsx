import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export default function ActionButton({
  state,
  id,
  onAction,
}: {
  state: "add" | "remove";
  id?: string;
  onAction?: (id: string) => void;
}) {
  return (
    <button
      onClick={() => onAction && onAction(id!)}
      className={twMerge(
        clsx(
          "text-light material-symbols-outlined cursor-pointer rounded-full p-0.5 font-semibold transition-all duration-250 hover:opacity-70",
          state === "add" ? "bg-success" : "bg-danger",
        ),
      )}
    >
      {state === "add" ? "add" : "remove"}
    </button>
  );
}
