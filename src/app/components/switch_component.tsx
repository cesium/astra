"use client";

import { useState } from "react";

interface IToggleSwitchProps {
  initialState?: boolean;
  onToggle?: (state: boolean) => void;
}

const ToggleSwitch: React.FC<IToggleSwitchProps> = ({
  initialState = false,
  onToggle,
}) => {
  const [isOn, setIsOn] = useState(initialState);

  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 ease-in-out focus:ring-1 focus:ring-orange-300 focus:ring-offset-1 focus:outline-none ${isOn ? "bg-orange-500" : "bg-gray-300"} `}
      role="switch"
      aria-checked={isOn}
    >
      <span className="sr-only">Toggle switch</span>
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out ${isOn ? "translate-x-6" : "translate-x-1"} `}
      />
    </button>
  );
};

export default ToggleSwitch;
