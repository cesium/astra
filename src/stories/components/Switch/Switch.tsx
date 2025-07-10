import './switch_component.css';
import { useState, useEffect } from 'react';

export interface IToggleSwitchProps {
  /** Initial state of the switch */
  initialState?: boolean;
  /** How large should the switch be? */
  size?: 'small' | 'medium' | 'large';
  /** Optional toggle handler */
  onToggle?: (state: boolean) => void;
}

/** Primary UI component for user interaction */
export const Switch = ({
  initialState = false,
  size = 'medium',
  onToggle,
  ...props
}: IToggleSwitchProps) => {
  const [isOn, setIsOn] = useState(initialState);

  // Atualiza o estado quando initialState muda (importante para o Storybook)
  useEffect(() => {
    setIsOn(initialState);
  }, [initialState]);

  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      onClick={handleToggle}
      className={`storybook-switch storybook-switch--${size} ${isOn ? 'storybook-switch--on' : 'storybook-switch--off'}`}
      {...props}
    >
      <span className="storybook-switch__sr-only">Toggle switch</span>
      <span className="storybook-switch__handle" />
    </button>
  );
};