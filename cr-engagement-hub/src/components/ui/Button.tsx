import React from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "ghost"
  | "icon";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  // Base styles
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50";

  // Size styles
  const sizeStyles = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  // Icon button sizes (circular)
  const iconSizeStyles = {
    xs: "p-1 w-6 h-6",
    sm: "p-1.5 w-8 h-8",
    md: "p-2 w-10 h-10",
    lg: "p-2.5 w-12 h-12",
  };

  // Variant styles - updated to match design specs
  const variantStyles = {
    primary:
      "bg-teal hover:bg-teal/90 active:bg-teal/80 focus:ring-teal/30 text-dark",
    secondary:
      "border border-teal text-teal bg-transparent hover:bg-teal/10 active:bg-teal/20 focus:ring-teal/30",
    danger:
      "bg-danger hover:bg-danger/90 active:bg-danger/80 focus:ring-danger/30 text-white",
    ghost:
      "bg-transparent hover:bg-dark-gray active:bg-dark-gray/50 focus:ring-dark-gray/30 text-light-gray hover:text-white",
    icon: "rounded-full bg-transparent hover:bg-dark-gray active:bg-dark-gray/50 focus:ring-dark-gray/30 text-light-gray hover:text-white",
  };

  // Disabled styles
  const disabledStyles = "opacity-50 cursor-not-allowed";

  // Full width styles
  const widthStyles = fullWidth ? "w-full" : "";

  // Use different size styles for icon buttons
  const chosenSizeStyles =
    variant === "icon" ? iconSizeStyles[size] : sizeStyles[size];

  const buttonStyles = {
    // Primary button with exact colors from spec
    ...(variant === "primary" && {
      backgroundColor: "#00E9A3",
      color: "#1A1E23",
    }),
    // Secondary button with exact colors from spec
    ...(variant === "secondary" && {
      borderColor: "#00E9A3",
      color: "#00E9A3",
    }),
    // Danger button with exact colors from spec
    ...(variant === "danger" && {
      backgroundColor: "#DC3545",
    }),
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${chosenSizeStyles}
        ${variantStyles[variant]}
        ${disabled || loading ? disabledStyles : ""}
        ${widthStyles}
        ${className}
      `}
      style={buttonStyles}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}

      {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}

      {children}

      {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
}
