"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface QuickAddEngagementProps {
  onAddEngagement: (engagement: {
    name: string;
    clientId: string;
    startDate: string;
    status: string;
  }) => void;
  clients: { id: string; name: string }[];
}

export const QuickAddEngagement: React.FC<QuickAddEngagementProps> = ({
  onAddEngagement,
  clients,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [clientId, setClientId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [status, setStatus] = useState("Active");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEngagement({
      name,
      clientId,
      startDate,
      status,
    });
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setClientId("");
    setStartDate("");
    setStatus("Active");
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button
        variant="primary"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="ml-2"
      >
        Quick Add
      </Button>
    );
  }

  return (
    <Card className="p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Quick Add Engagement</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="engagement-name"
              className="block text-sm text-light-gray mb-1"
            >
              Engagement Name
            </label>
            <input
              id="engagement-name"
              type="text"
              className="w-full rounded-md border border-dark-gray bg-secondary-bg p-2 text-white"
              placeholder="Enter engagement name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="client-select"
              className="block text-sm text-light-gray mb-1"
            >
              Client
            </label>
            <select
              id="client-select"
              className="w-full rounded-md border border-dark-gray bg-secondary-bg p-2 text-white"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="start-date"
              className="block text-sm text-light-gray mb-1"
            >
              Start Date
            </label>
            <input
              id="start-date"
              type="date"
              className="w-full rounded-md border border-dark-gray bg-secondary-bg p-2 text-white"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="status-select"
              className="block text-sm text-light-gray mb-1"
            >
              Status
            </label>
            <select
              id="status-select"
              className="w-full rounded-md border border-dark-gray bg-secondary-bg p-2 text-white"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="Active">Active</option>
              <option value="Planned">Planned</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={resetForm}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Add Engagement
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default QuickAddEngagement;
