import React from "react";

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
  color?: "default" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  labelPosition?: "right" | "inside";
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = true,
  color = "default",
  size = "md",
  labelPosition = "right",
  className = "",
  ...props
}: ProgressBarProps) {
  // Calculate percentage
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  // Size classes for height
  const sizeClasses = {
    sm: "h-1.5", // 6px
    md: "h-3", // 12px (per specs)
    lg: "h-4", // 16px
  };

  // Color classes for the progress bar
  const getColorClasses = () => {
    switch (color) {
      case "success":
        return "bg-green-500";
      case "warning":
        return "bg-amber-500";
      case "danger":
        return "bg-danger";
      default:
        return "bg-teal";
    }
  };

  // Generate style for gradient and exact specs
  const progressBarStyles = {
    height: "12px", // Exact height from specs
    borderRadius: "6px", // Fully rounded corners (6px for 12px height)
    backgroundColor: "#3A3F45", // Dark gray background
    overflow: "hidden",
  };

  // Style for the progress fill
  const fillStyles = {
    width: `${percentage}%`,
    backgroundImage:
      color === "default"
        ? "linear-gradient(to right, #00E9A3, #00C08B)"
        : undefined,
    height: "100%",
    borderRadius: "6px",
  };

  // Style for the label if it's inside the progress bar
  const labelStyles = {
    fontSize: "14px",
    fontWeight: 500,
    color: "white",
  };

  return (
    <div className={`w-full ${className}`} {...props}>
      <div className="flex items-center gap-2">
        <div
          className={`w-full rounded-full ${sizeClasses[size]}`}
          style={progressBarStyles}
        >
          <div
            className={`${getColorClasses()} rounded-full transition-all duration-300`}
            style={fillStyles}
          >
            {showLabel && labelPosition === "inside" && percentage > 15 && (
              <div className="h-full flex items-center px-2">
                <span style={labelStyles}>{Math.round(percentage)}%</span>
              </div>
            )}
          </div>
        </div>

        {showLabel && labelPosition === "right" && (
          <span className="text-white text-sm font-medium" style={labelStyles}>
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    </div>
  );
}
