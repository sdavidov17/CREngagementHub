"use client";

import React, { useState } from "react";
import { Card, Button } from "@/components/ui";
import { KeyResultStatus } from "@/types/okr";
import { format } from "date-fns";

interface Owner {
  id: string;
  name: string;
}

interface KeyResultFormProps {
  objectiveId: string;
  initialData?: {
    id?: string;
    title: string;
    description: string;
    status: KeyResultStatus;
    progress: number;
    owner: string;
    startDate: string;
    targetDate: string;
  };
  owners: Owner[];
  onSubmit: (objectiveId: string, data: any) => Promise<void>;
  onCancel: () => void;
  isEditMode?: boolean;
}

export function KeyResultForm({
  objectiveId,
  initialData = {
    title: "",
    description: "",
    status: "not_started",
    progress: 0,
    owner: "",
    startDate: format(new Date(), "yyyy-MM-dd"),
    targetDate: "",
  },
  owners,
  onSubmit,
  onCancel,
  isEditMode = false,
}: KeyResultFormProps) {
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
      [name]: name === "progress" ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await onSubmit(objectiveId, formData);
    } catch (error) {
      console.error("Error submitting key result:", error);
      setErrorMessage(
        "There was an error saving your key result. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-6">
      <h2 className="text-h2 font-bold text-white mb-6">
        {isEditMode ? "Edit Key Result" : "Add Key Result"}
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
            placeholder="Key Result title"
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
            placeholder="Describe the key result..."
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-light-gray mb-1"
            >
              Start Date *
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-dark-gray bg-secondary-bg p-2 text-white focus:outline-none focus:ring-1 focus:ring-teal"
            />
          </div>

          <div>
            <label
              htmlFor="targetDate"
              className="block text-sm font-medium text-light-gray mb-1"
            >
              Target Date *
            </label>
            <input
              id="targetDate"
              name="targetDate"
              type="date"
              value={formData.targetDate}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-dark-gray bg-secondary-bg p-2 text-white focus:outline-none focus:ring-1 focus:ring-teal"
            />
          </div>
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
                <option value="not_started">Not Started</option>
                <option value="on_track">On Track</option>
                <option value="at_risk">At Risk</option>
                <option value="behind">Behind</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}
        </div>

        {isEditMode && (
          <div>
            <label
              htmlFor="progress"
              className="block text-sm font-medium text-light-gray mb-1"
            >
              Progress: {formData.progress}%
            </label>
            <input
              id="progress"
              name="progress"
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData.progress}
              onChange={handleChange}
              className="w-full accent-teal"
            />
            <div className="flex justify-between text-xs text-light-gray mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
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
              : "Add Key Result"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
