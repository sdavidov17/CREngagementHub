"use client";

import React, { useState } from "react";
import { Card, Button } from "@/components/ui";
import { ObjectiveStatus, ObjectiveStatusLabels } from "@/types/okr";

interface Owner {
  id: string;
  name: string;
}

interface ObjectiveFormProps {
  initialData?: {
    id?: string;
    title: string;
    description: string;
    quarter: string;
    status: ObjectiveStatus;
    owner: string;
    engagementId: string;
  };
  owners: Owner[];
  quarters: string[];
  engagementId?: string;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isEditMode?: boolean;
}

export function ObjectiveForm({
  initialData = {
    title: "",
    description: "",
    quarter: "",
    status: "on_track",
    owner: "",
    engagementId: "",
  },
  owners,
  quarters,
  engagementId,
  onSubmit,
  onCancel,
  isEditMode = false,
}: ObjectiveFormProps) {
  const [formData, setFormData] = useState({
    ...initialData,
    engagementId: engagementId || initialData.engagementId,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting objective:", error);
      setErrorMessage(
        "There was an error saving your objective. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-6">
      <h2 className="text-h2 font-bold text-white mb-6">
        {isEditMode ? "Edit Objective" : "Create New Objective"}
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
            placeholder="Objective title"
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
            placeholder="Describe the objective..."
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="quarter"
              className="block text-sm font-medium text-light-gray mb-1"
            >
              Quarter *
            </label>
            <select
              id="quarter"
              name="quarter"
              value={formData.quarter}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-dark-gray bg-secondary-bg p-2 text-white focus:outline-none focus:ring-1 focus:ring-teal"
            >
              <option value="">Select Quarter</option>
              {quarters.map((quarter) => (
                <option key={quarter} value={quarter}>
                  {quarter}
                </option>
              ))}
            </select>
          </div>

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
        </div>

        {isEditMode && (
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
              {Object.entries(ObjectiveStatusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        )}

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
              : "Create Objective"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
