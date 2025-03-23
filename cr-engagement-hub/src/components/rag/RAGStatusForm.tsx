"use client";

import React, { useState } from "react";
import { Card, Button } from "@/components/ui";
import { RAGStatus } from "@/types/status";

interface RAGStatusFormProps {
  engagementId: string;
  initialData?: {
    id?: string;
    people: RAGStatus;
    delivery: RAGStatus;
    commercial: RAGStatus;
    comment: string;
    reportedDate: string;
  };
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isEditMode?: boolean;
}

export function RAGStatusForm({
  engagementId,
  initialData = {
    people: "on_track" as RAGStatus,
    delivery: "on_track" as RAGStatus,
    commercial: "on_track" as RAGStatus,
    comment: "",
    reportedDate: new Date().toISOString().substring(0, 10),
  },
  onSubmit,
  onCancel,
  isEditMode = false,
}: RAGStatusFormProps) {
  const [formData, setFormData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // Include the engagement ID in the form data
      await onSubmit({ ...formData, engagementId });
    } catch (error) {
      console.error("Error submitting RAG status:", error);
      setErrorMessage(
        "There was an error saving the status. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStatusSelector = (
    name: "people" | "delivery" | "commercial",
    label: string
  ) => (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-light-gray mb-1"
      >
        {label}
      </label>
      <div className="flex space-x-4 mt-2">
        <StatusOption
          name={name}
          value="critical"
          currentValue={formData[name]}
          onChange={handleChange}
          label="Critical"
        />
        <StatusOption
          name={name}
          value="at_risk"
          currentValue={formData[name]}
          onChange={handleChange}
          label="At Risk"
        />
        <StatusOption
          name={name}
          value="on_track"
          currentValue={formData[name]}
          onChange={handleChange}
          label="On Track"
        />
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto p-6">
      <h2 className="text-h2 font-bold text-white mb-6">
        {isEditMode ? "Edit Status Report" : "New Status Report"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="reportedDate"
            className="block text-sm font-medium text-light-gray mb-1"
          >
            Report Date *
          </label>
          <input
            id="reportedDate"
            name="reportedDate"
            type="date"
            value={formData.reportedDate}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-dark-gray bg-secondary-bg p-2 text-white focus:outline-none focus:ring-1 focus:ring-teal"
          />
        </div>

        <div className="space-y-6">
          {renderStatusSelector("people", "People Status")}
          {renderStatusSelector("delivery", "Delivery Status")}
          {renderStatusSelector("commercial", "Commercial Status")}
        </div>

        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-light-gray mb-1"
          >
            Comment *
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            required
            rows={4}
            className="w-full rounded-md border border-dark-gray bg-secondary-bg p-2 text-white focus:outline-none focus:ring-1 focus:ring-teal resize-vertical"
            placeholder="Explain the current status..."
          />
        </div>

        {errorMessage && (
          <div className="p-3 bg-danger/20 border border-danger/30 rounded-md text-sm text-danger">
            {errorMessage}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : isEditMode
              ? "Save Changes"
              : "Submit Report"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

// Helper component for RAG status selection
interface StatusOptionProps {
  name: string;
  value: RAGStatus;
  currentValue: RAGStatus;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

function StatusOption({
  name,
  value,
  currentValue,
  onChange,
  label,
}: StatusOptionProps) {
  const getStatusColor = (status: RAGStatus) => {
    switch (status) {
      case "critical":
        return "bg-red-600";
      case "at_risk":
        return "bg-amber-500";
      case "on_track":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <label className="flex items-center cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={currentValue === value}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={`w-5 h-5 rounded-full mr-2 border-2 ${getStatusColor(
          value
        )} ${
          currentValue === value ? "ring-2 ring-white" : "ring-1 ring-gray-600"
        }`}
      ></span>
      <span className="text-sm text-light-gray">{label}</span>
    </label>
  );
}
