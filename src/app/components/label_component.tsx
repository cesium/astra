import { ReactNode } from "react";

interface ILabelProps {
  children: ReactNode;
  disabled?: boolean;
  htmlFor?: string;
}

const Label = ({ children, disabled = false, htmlFor }: ILabelProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`cursor-pointer text-sm ${disabled ? "text-gray-400" : "text-gray-700"}`}
    >
      {children}
    </label>
  );
};

export default Label;
