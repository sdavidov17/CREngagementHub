import React from "react";
import { Badge } from "./Badge";

// Status Badge component specifically for status indicators
export type StatusType =
  | "On Track"
  | "At Risk"
  | "Behind"
  | "Critical"
  | "Completed"
  | "In Progress"
  | "Not Started"
  | "Active"
  | "Planned"
  | "On Hold";

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  status: StatusType;
}

export function StatusBadge({
  children,
  status,
  className = "",
  ...props
}: StatusBadgeProps) {
  // Map status to variant
  const getVariant = (): "on-track" | "at-risk" | "critical" | "default" => {
    switch (status) {
      case "On Track":
      case "Active":
      case "Completed":
        return "on-track";
      case "At Risk":
      case "On Hold":
      case "Planned":
        return "at-risk";
      case "Behind":
      case "Critical":
        return "critical";
      case "In Progress":
      case "Not Started":
      default:
        return "default";
    }
  };

  return (
    <Badge variant={getVariant()} className={className} {...props}>
      {children || status}
    </Badge>
  );
}
