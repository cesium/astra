"use client";
import { ReactNode } from "react";
import Link from "next/link";

interface IButtonProps {
  title?: string;
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
  ariaLabel?: string;
  type?: "button" | "submit" | "reset";
}

const Button = ({
  title,
  size = "md",
  variant = "filled",
  bgColor = "bg-white",
  textColor = "text-black",
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
  ariaLabel,
  type = "button",
}: IButtonProps) => {
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
    "inline-flex items-center justify-center font-medium",
    sizeMap[size],
    variantMap[variant],
    padding,
    borderRadius,
    borderWidth,
    className,
  ].join(" ");

  const isIconOnly = icon && (!title || title.trim() === "");

  const content = isIconOnly ? (
    <span className="flex items-center justify-center">{icon}</span>
  ) : (
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
        aria-label={ariaLabel}
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
      <button
        type={type}
        onClick={onClick}
        className={baseStyle}
        aria-label={ariaLabel}
      >
        {content}
      </button>
    );
  }

  return null;
};

export default Button;
