interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  center_text?: boolean;
}

export default function Input({
  placeholder,
  type,
  disabled,
  className,
  name,
  value,
  center_text,
  min,
  max,
  onChange,
  ...rest
}: IInputProps) {
  const textAlignment = center_text ? "text-center" : "text-left";

  return (
    <input
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      name={name}
      value={value}
      onChange={onChange}
      className={`${className} ${textAlignment} rounded-xl border border-black/10 px-3 py-2.5 text-lg text-black outline-none placeholder:text-black/30 invalid:border-red-500 invalid:text-red-600`}
      min={type === "number" ? min : undefined}
      max={type === "number" ? max : undefined}
      {...rest}
    />
  );
}
