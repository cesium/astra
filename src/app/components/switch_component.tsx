"use client";

import React, { useState } from 'react';

const ToggleSwitch = ({ initialState = false, onToggle }: { initialState?: boolean, onToggle?: (state: boolean) => void }) => {
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
      className={`
        relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        ${isOn ? 'bg-orange-500' : 'bg-gray-300'}
      `}
      role="switch"
      aria-checked={isOn}
    >
      <span className="sr-only">Toggle switch</span>
      <span
        className={`
          inline-block w-6 h-6 transform bg-white rounded-full shadow-lg transition-transform duration-200 ease-in-out
          ${isOn ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  );
};
export default ToggleSwitch;
