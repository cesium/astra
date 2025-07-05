import React, { ReactNode } from 'react';

const Label = ({ children, disabled = false }: { children: ReactNode; disabled?: boolean }) => {
  return (
    <span className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
      {children}
    </span>
  );
};
export default Label;