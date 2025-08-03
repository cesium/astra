import clsx from "clsx";
import type { ReactNode } from "react";

interface ILabelProps {
  children: ReactNode;
  disabled?: boolean;
  htmlFor?: string;
  size?: "small" | "medium" | "large";
  className?: string;
}

const Label = ({
  children,
  disabled = false,
  htmlFor,
  size = "medium",
  className,
}: ILabelProps) => {
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "text-xs";
      case "large":
        return "text-base";
      default:
        return "text-sm";
    }
  };

  return (
    <label
      htmlFor={htmlFor}
      className={clsx(
        className,
        getSizeClasses(),
        disabled ? "text-gray-400" : "text-gray-700",
      )}
    >
      {children}
    </label>
  );
};

export default Label;
