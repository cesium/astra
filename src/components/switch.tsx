"use client";

import { useState } from "react";

interface IToggleSwitchProps {
  initialState?: boolean;
  size?: "small" | "medium" | "large";
  onToggle?: (state: boolean) => void;
}

const ToggleSwitch: React.FC<IToggleSwitchProps> = ({
  initialState = false,
  size = "medium",
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

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "h-5 w-9";
      case "large":
        return "h-8 w-14";
      default:
        return "h-6 w-11";
    }
  };

  const getHandleClasses = () => {
    switch (size) {
      case "small":
        return `h-3 w-3 ${isOn ? "translate-x-5" : "translate-x-1"}`;
      case "large":
        return `h-6 w-6 ${isOn ? "translate-x-6" : "translate-x-1"}`;
      default:
        return `h-4 w-4 ${isOn ? "translate-x-6" : "translate-x-1"}`;
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out focus:ring-1 focus:ring-orange-300 focus:ring-offset-1 focus:outline-none ${getSizeClasses()} ${isOn ? "bg-orange-500" : "bg-gray-300"
        }`}
      role="switch"
      aria-checked={isOn}
    >
      <span className="sr-only">Toggle switch</span>
      <span
        className={`inline-block transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out ${getHandleClasses()}`}
      />
    </button>
  );
};

export default ToggleSwitch;
