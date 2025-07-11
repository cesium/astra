import type { ReactNode } from "react";

interface ILabelProps {
  children: ReactNode;
  disabled?: boolean;
  htmlFor?: string;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

const Label = ({ 
  children, 
  disabled = false, 
  htmlFor,
  size = 'medium',
  onClick,
}: ILabelProps) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'text-xs';
      case 'large':
        return 'text-base';
      default:
        return 'text-sm';
    }
  };

  const colorClass = disabled ? 'text-gray-400' : 'text-gray-700';
  const cursorClass = disabled ? 'cursor-not-allowed' : 'cursor-pointer';

  return (
    <label
    htmlFor={htmlFor}
    onClick={disabled ? undefined : onClick}
    className={`${getSizeClasses()} ${colorClass} ${cursorClass}`}
    >
      {children}
    </label>
  );
};

export default Label;
