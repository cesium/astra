import type { ReactNode } from "react";

interface ILabelProps {
  children: ReactNode;
  disabled?: boolean;
  htmlFor?: string;
  /** How large should the label be? */
  size?: 'small' | 'medium' | 'large';
  /** Optional click handler */
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

  const getColorClasses = () => {
    if (disabled) return 'text-gray-400';
    return 'text-gray-700';
  };

  return (
    <label
      htmlFor={htmlFor}
      onClick={onClick}
      className={`cursor-pointer ${getSizeClasses()} ${getColorClasses()}`}
    >
      {children}
    </label>
  );
};

export default Label;
