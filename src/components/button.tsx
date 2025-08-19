"use client";

import React, { ReactNode } from "react";
import Link from "next/link";

interface IButtonProps {
  children?: ReactNode;
  className?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
  disabled?: boolean;
}

const Button = ({
  children,
  className = "",
  icon,
  iconPosition = "left",
  href,
  onClick,
  type = "button",
  ariaLabel,
  disabled = false,
}: IButtonProps) => {
  const baseStyle = "inline-flex items-center justify-center font-medium";
  const isIconOnly = icon && !children;
  const disabledStyle = disabled ? "pointer-events-none opacity-50" : "";

  const finalClassName = [baseStyle, className, disabledStyle]
    .filter(Boolean)
    .join(" ");

  const content = isIconOnly ? (
    <span className="flex items-center justify-center">{icon}</span>
  ) : (
    <>
      {icon && iconPosition === "left" && (
        <span className="mr-2 flex">{icon}</span>
      )}

      {children && <span>{children}</span>}

      {icon && iconPosition === "right" && (
        <span className="ml-2 flex">{icon}</span>
      )}
    </>
  );

  if (href) {
    const external =
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:");

    if (disabled) {
      return (
        <span
          className={finalClassName}
          aria-label={ariaLabel}
          aria-disabled="true"
        >
          {content}
        </span>
      );
    }

    return (
      <Link
        href={href}
        className={finalClassName}
        aria-label={ariaLabel}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      className={finalClassName}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {content}
    </button>
  );
};

export default Button;
