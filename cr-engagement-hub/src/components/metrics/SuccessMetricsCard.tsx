"use client";

import React from "react";
import { SuccessMetric } from "@/types/metrics";
import { Card, Badge, ProgressBar } from "@/components/ui";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";

interface SuccessMetricsCardProps {
  metric: SuccessMetric;
  onClick?: (metricId: string) => void;
}

export function SuccessMetricsCard({
  metric,
  onClick,
}: SuccessMetricsCardProps) {
  const formatValue = (value: number, format: SuccessMetric["format"]) => {
    switch (format) {
      case "percentage":
        return `${value}%`;
      case "currency":
        return `£${value.toLocaleString()}`;
      case "number":
      default:
        return value.toLocaleString();
    }
  };

  const getStatusColor = (status: SuccessMetric["status"]) => {
    switch (status) {
      case "on_track":
        return "text-teal bg-teal/10";
      case "at_risk":
        return "text-amber-500 bg-amber-500/10";
      case "off_track":
        return "text-danger bg-danger/10";
      default:
        return "text-light-gray bg-light-gray/10";
    }
  };

  const getTrendIcon = () => {
    if (metric.trend === "increasing") {
      return (
        <ArrowUpIcon
          className={`h-4 w-4 ${
            metric.trendIsGood ? "text-teal" : "text-danger"
          }`}
        />
      );
    } else if (metric.trend === "decreasing") {
      return (
        <ArrowDownIcon
          className={`h-4 w-4 ${
            metric.trendIsGood ? "text-teal" : "text-danger"
          }`}
        />
      );
    }
    return null;
  };

  const getProgressBarWidth = () => {
    if (metric.target === 0) return "0%";
    const progress = Math.min(
      Math.max((metric.current / metric.target) * 100, 0),
      100
    );
    return `${progress}%`;
  };

  const getProgressColor = () => {
    switch (metric.status) {
      case "on_track":
        return "success";
      case "at_risk":
        return "warning";
      case "off_track":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <Card
      className="hover:border-teal/50 transition-colors cursor-pointer"
      onClick={() => onClick && onClick(metric.id)}
    >
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-white">{metric.name}</h3>
        <Badge className={getStatusColor(metric.status)}>
          {metric.status
            .replace("_", " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())}
        </Badge>
      </div>

      <p className="text-sm text-light-gray mb-4">{metric.description}</p>

      <div className="flex items-baseline justify-between mb-1">
        <div className="text-2xl font-bold text-white flex items-center gap-1">
          {formatValue(metric.current, metric.format)}
          {getTrendIcon()}
        </div>
        <div className="text-sm text-light-gray">
          Target: {formatValue(metric.target, metric.format)}
        </div>
      </div>

      <ProgressBar
        value={metric.current}
        max={metric.target}
        color={getProgressColor()}
        labelPosition="right"
        className="mb-4"
      />

      <div className="flex items-center justify-between text-xs text-light-gray">
        <div>Period: {metric.period}</div>
        <div>Category: {metric.category}</div>
      </div>
    </Card>
  );
}
