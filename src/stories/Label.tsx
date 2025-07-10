import './label.css';

export interface LabelProps {
  /** How large should the label be? */
  size?: 'small' | 'medium' | 'large';
  /** Label contents */
  label: string;
  /** Disabled state */
  disabled?: boolean;
  /** HTML for attribute */
  htmlFor?: string;
  /** Optional click handler */
  onClick?: () => void;
}

/** Primary UI component for labels */
export const Label = ({
  size = 'medium',
  disabled = false,
  label,
  htmlFor,
  ...props
}: LabelProps) => {
  const mode = disabled ? 'storybook-label--disabled' : 'storybook-label--secondary';
  return (
    <label
      htmlFor={htmlFor}
      className={['storybook-label', `storybook-label--${size}`, mode].join(' ')}
      {...props}
    >
      {label}
    </label>
  );
};