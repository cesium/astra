import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useState } from "react";

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  center_text?: boolean;
  hideable?: boolean;
}

export default function Input({
  type,
  className,
  value,
  center_text,
  min,
  max,
  hideable,
  ...rest
}: IInputProps) {
  const textAlignment = center_text ? "text-center" : "text-left";

  const [mutType, setMutType] = useState(type);

  return (
    <div
      className={twMerge(
        clsx(
          className,
          textAlignment,
          "flex w-full items-center rounded-xl border border-black/10 px-2 py-1.5 text-black outline-none md:px-3 md:py-2.5",
        ),
      )}
    >
      <input
        type={mutType}
        value={value}
        className={twMerge(
          clsx(
            textAlignment,
            "w-full flex-1 bg-transparent text-black outline-none placeholder:text-black/30 invalid:border-red-500 invalid:text-red-600",
          ),
        )}
        min={type === "number" ? min : undefined}
        max={type === "number" ? max : undefined}
        {...rest}
      />
      {hideable && (
        <span
          className="material-symbols-outlined ml-2 cursor-pointer text-xl text-black/50 hover:text-black"
          onClick={() =>
            mutType === "password" ? setMutType("text") : setMutType("password")
          }
        >
          {mutType === "password" ? "visibility" : "visibility_off"}
        </span>
      )}
    </div>
  );
}
