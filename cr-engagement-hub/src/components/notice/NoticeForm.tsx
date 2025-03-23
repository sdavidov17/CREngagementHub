"use client";

import React, { useState } from "react";
import { Card, Button } from "@/components/ui";
import { NoticeCategory } from "@/types/notice";
import { format } from "date-fns";

interface NoticeFormProps {
  engagementId?: string;
  initialData?: {
    id?: string;
    title: string;
    content: string;
    category: NoticeCategory;
    priority: "low" | "medium" | "high";
    publishedDate: string;
    expiryDate?: string;
  };
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isEditMode?: boolean;
}

export function NoticeForm({
  engagementId,
  initialData = {
    title: "",
    content: "",
    category: "general" as NoticeCategory,
    priority: "medium" as const,
    publishedDate: format(new Date(), "yyyy-MM-dd"),
    expiryDate: "",
  },
  onSubmit,
  onCancel,
  isEditMode = false,
}: NoticeFormProps) {
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
      // Include the engagement ID in the form data if provided
      const dataToSubmit = engagementId
        ? { ...formData, engagementId }
        : formData;
      await onSubmit(dataToSubmit);
    } catch (error) {
      console.error("Error submitting notice:", error);
      setErrorMessage(
        "There was an error saving the notice. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-6">
      <h2 className="text-h2 font-bold text-white mb-6">
        {isEditMode ? "Edit Notice" : "Add Notice"}
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
            placeholder="Notice title"
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-light-gray mb-1"
          >
            Content *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={6}
            className="w-full rounded-md border border-dark-gray bg-secondary-bg p-2 text-white focus:outline-none focus:ring-1 focus:ring-teal resize-vertical"
            placeholder="Notice content..."
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-light-gray mb-1"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-md border border-dark-gray bg-secondary-bg p-2 text-white focus:outline-none focus:ring-1 focus:ring-teal"
            >
              <option value="general">General</option>
              <option value="announcement">Announcement</option>
              <option value="alert">Alert</option>
              <option value="update">Update</option>
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="publishedDate"
              className="block text-sm font-medium text-light-gray mb-1"
            >
              Published Date *
            </label>
            <input
              id="publishedDate"
              name="publishedDate"
              type="date"
              value={formData.publishedDate}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-dark-gray bg-secondary-bg p-2 text-white focus:outline-none focus:ring-1 focus:ring-teal"
            />
          </div>

          <div>
            <label
              htmlFor="expiryDate"
              className="block text-sm font-medium text-light-gray mb-1"
            >
              Expiry Date
            </label>
            <input
              id="expiryDate"
              name="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={handleChange}
              className="w-full rounded-md border border-dark-gray bg-secondary-bg p-2 text-white focus:outline-none focus:ring-1 focus:ring-teal"
            />
            <p className="text-xs text-light-gray mt-1">
              Leave blank if the notice doesn't expire
            </p>
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
              : "Add Notice"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
