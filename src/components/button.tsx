"use client";
import React, { ReactNode } from "react";
import Link from "next/link";

interface ButtonProps {
  title: string;
  size?: "sm" | "md" | "lg";
  variant?: "filled" | "outline" | "text";
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  borderRadius?: string;
  borderWidth?: string;
  padding?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  as?: "button" | "link";
  href?: string;
  onClick?: () => void;
  className?: string;
}

const Button = ({
  title,
  size = "md",
  variant = "filled",
  bgColor = "white",
  textColor = "black",
  borderColor = "transparent",
  borderRadius = "rounded",
  borderWidth = "border",
  padding = "px-4 py-2",
  icon,
  iconPosition = "left",
  as = "button",
  href,
  onClick,
  className = "",
}: ButtonProps) => {
  const sizeMap: Record<"sm" | "md" | "lg", string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };
  const variantMap: Record<"filled" | "outline" | "text", string> = {
    filled: `${bgColor} ${textColor} ${borderColor}`,
    outline: `bg-transparent ${textColor} ${borderColor}`,
    text: `bg-transparent ${textColor} border-transparent`,
  };

  const baseStyle = [
    "inline-flex items-center justify-center font-medium transition ease-in-out duration-200 hover:scale-105 active:scale-95",
    sizeMap[size],
    variantMap[variant],
    padding,
    borderRadius,
    borderWidth,
    className,
  ].join(" ");

  const content = (
    <>
      {icon && iconPosition === "left" && (
        <span className="mr-2 flex">{icon}</span>
      )}
      <span>{title}</span>
      {icon && iconPosition === "right" && (
        <span className="ml-2 flex">{icon}</span>
      )}
    </>
  );

  if (as === "link" && href) {
    const isExternalLink =
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:");
    return (
      <Link
        href={href}
        className={baseStyle}
        {...(isExternalLink
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {content}
      </Link>
    );
  }

  if (as === "button") {
    return (
      <button onClick={onClick} className={baseStyle}>
        {content}
      </button>
    );
  }

  return null;
};

export default Button;
