import clsx from "clsx";

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  center_text?: boolean;
}

export default function Input({
  type,
  className,
  value,
  center_text,
  min,
  max,
  ...rest
}: IInputProps) {
  const textAlignment = center_text ? "text-center" : "text-left";

  return (
    <input
      type={type}
      value={value}
      className={clsx(
        className,
        textAlignment,
        "rounded-xl border border-black/10 px-3 py-2.5 text-lg text-black outline-none placeholder:text-black/30 invalid:border-red-500 invalid:text-red-600",
      )}
      min={type === "number" ? min : undefined}
      max={type === "number" ? max : undefined}
      {...rest}
    />
  );
}
