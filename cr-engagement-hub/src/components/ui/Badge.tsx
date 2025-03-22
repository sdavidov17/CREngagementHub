import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "outline" | "on-track" | "at-risk" | "critical";
}

export function Badge({
  children,
  variant = "default",
  className = "",
  ...props
}: BadgeProps) {
  // Base styles for all badges
  const baseClasses =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";

  // Preset variant styles
  const getVariantClasses = () => {
    switch (variant) {
      case "on-track":
        return "bg-green-500 text-white";
      case "at-risk":
        return "bg-amber-500 text-black";
      case "critical":
        return "bg-danger text-white";
      case "outline":
        return "border border-light-gray text-light-gray";
      default:
        return "bg-dark-gray text-light-gray";
    }
  };

  // Exact colors from design spec
  const variantStyles = {
    "on-track": {
      backgroundColor: "#198754",
    },
    "at-risk": {
      backgroundColor: "#FFC107",
      color: "#000000",
    },
    critical: {
      backgroundColor: "#DC3545",
    },
  };

  const badgeStyles =
    variant === "on-track" || variant === "at-risk" || variant === "critical"
      ? variantStyles[variant]
      : {};

  return (
    <div
      className={`${baseClasses} ${getVariantClasses()} ${className}`}
      style={badgeStyles}
      {...props}
    >
      {children}
    </div>
  );
}
