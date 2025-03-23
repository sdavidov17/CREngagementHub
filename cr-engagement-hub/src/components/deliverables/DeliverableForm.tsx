"use client";

import React, { useState } from "react";
import { Card, Button } from "@/components/ui";
import { format } from "date-fns";

// Status options for deliverables
const DELIVERABLE_STATUSES = [
  "not_started",
  "in_progress",
  "blocked",
  "completed",
  "cancelled",
];

interface Owner {
  id: string;
  name: string;
}

interface DeliverableFormProps {
  okrId?: string;
  initialData?: {
    id?: string;
    title: string;
    description: string;
    status: string;
    owner: string;
    dueDate: string;
    priority: "low" | "medium" | "high";
  };
  owners: Owner[];
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isEditMode?: boolean;
}

export function DeliverableForm({
  okrId,
  initialData = {
    title: "",
    description: "",
    status: "not_started",
    owner: "",
    dueDate: "",
    priority: "medium" as const,
  },
  owners,
  onSubmit,
  onCancel,
  isEditMode = false,
}: DeliverableFormProps) {
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
      // Include the OKR ID in the form data if provided
      const dataToSubmit = okrId ? { ...formData, okrId } : formData;
      await onSubmit(dataToSubmit);
    } catch (error) {
      console.error("Error submitting deliverable:", error);
      setErrorMessage(
        "There was an error saving the deliverable. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-6">
      <h2 className="text-h2 font-bold text-white mb-6">
        {isEditMode ? "Edit Deliverable" : "Add Deliverable"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-light-gray mb-1"
          >
            Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-dark-gray bg-secondary-bg p-2 text-white focus:outline-none focus:ring-1 focus:ring-teal"
            placeholder="Deliverable title"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-light-gray mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-md border border-dark-gray bg-secondary-bg p-2 text-white focus:outline-none focus:ring-1 focus:ring-teal resize-vertical"
            placeholder="Describe the deliverable..."
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="owner"
              className="block text-sm font-medium text-light-gray mb-1"
            >
              Owner *
            </label>
            <select
              id="owner"
              name="owner"
              value={formData.owner}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-dark-gray bg-secondary-bg p-2 text-white focus:outline-none focus:ring-1 focus:ring-teal"
            >
              <option value="">Select Owner</option>
              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-light-gray mb-1"
            >
              Due Date *
            </label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-dark-gray bg-secondary-bg p-2 text-white focus:outline-none focus:ring-1 focus:ring-teal"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-light-gray mb-1"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-md border border-dark-gray bg-secondary-bg p-2 text-white focus:outline-none focus:ring-1 focus:ring-teal"
            >
              {DELIVERABLE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-light-gray mb-1"
            >
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full rounded-md border border-dark-gray bg-secondary-bg p-2 text-white focus:outline-none focus:ring-1 focus:ring-teal"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
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
              : "Add Deliverable"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
