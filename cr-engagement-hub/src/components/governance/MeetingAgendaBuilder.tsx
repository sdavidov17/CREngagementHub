"use client";

import React, { useState } from "react";
import { AgendaItem, MeetingType } from "@/types/governance";
import { Button, Card } from "@/components/ui";
import {
  TrashIcon,
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";

interface MeetingAgendaBuilderProps {
  meetingType: MeetingType;
  initialAgendaItems?: AgendaItem[];
  onSave: (agendaItems: AgendaItem[]) => void;
}

export function MeetingAgendaBuilder({
  meetingType,
  initialAgendaItems = [],
  onSave,
}: MeetingAgendaBuilderProps) {
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>(
    initialAgendaItems.length > 0
      ? initialAgendaItems
      : meetingType.defaultAgendaItems || []
  );
  const [editMode, setEditMode] = useState(initialAgendaItems.length === 0);

  const addNewItem = () => {
    const newItem: AgendaItem = {
      id: `agenda-${Date.now()}`,
      title: "",
      description: "",
      durationMinutes: 15,
      owner: "",
      notes: "",
      sequence: agendaItems.length,
    };

    setAgendaItems([...agendaItems, newItem]);
  };

  const updateItem = (
    id: string,
    field: keyof AgendaItem,
    value: string | number
  ) => {
    setAgendaItems(
      agendaItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setAgendaItems(agendaItems.filter((item) => item.id !== id));
  };

  const moveItem = (id: string, direction: "up" | "down") => {
    const currentIndex = agendaItems.findIndex((item) => item.id === id);
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === agendaItems.length - 1)
    ) {
      return; // Already at the edge
    }

    const newItems = [...agendaItems];
    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;

    // Swap items
    [newItems[currentIndex], newItems[targetIndex]] = [
      newItems[targetIndex],
      newItems[currentIndex],
    ];

    // Update sequence values
    newItems.forEach((item, index) => {
      item.sequence = index;
    });

    setAgendaItems(newItems);
  };

  const calculateTotalDuration = () => {
    return agendaItems.reduce(
      (total, item) => total + (item.durationMinutes || 0),
      0
    );
  };

  const handleSave = () => {
    onSave(agendaItems);
    setEditMode(false);
  };

  const totalDuration = calculateTotalDuration();
  const hourFormat = Math.floor(totalDuration / 60);
  const minuteFormat = totalDuration % 60;
  const formattedDuration = `${hourFormat > 0 ? `${hourFormat}h ` : ""}${
    minuteFormat > 0 ? `${minuteFormat}m` : ""
  }`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-h2 font-bold text-white">
            {meetingType.name} Agenda
          </h2>
          <p className="text-light-gray">Total Duration: {formattedDuration}</p>
        </div>

        <div>
          {editMode ? (
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setEditMode(false)}
                disabled={initialAgendaItems.length === 0}
              >
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSave}>
                Save Agenda
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setEditMode(true)}
            >
              Edit Agenda
            </Button>
          )}
        </div>
      </div>

      {editMode ? (
        <div className="space-y-4">
          {agendaItems.map((item, index) => (
            <Card key={item.id} className="relative">
              <div className="absolute right-4 top-4 flex space-x-1">
                <button
                  onClick={() => moveItem(item.id, "up")}
                  disabled={index === 0}
                  className={`p-1 rounded ${
                    index === 0
                      ? "text-dark-gray"
                      : "text-light-gray hover:bg-dark-gray"
                  }`}
                >
                  <ArrowUpIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => moveItem(item.id, "down")}
                  disabled={index === agendaItems.length - 1}
                  className={`p-1 rounded ${
                    index === agendaItems.length - 1
                      ? "text-dark-gray"
                      : "text-light-gray hover:bg-dark-gray"
                  }`}
                >
                  <ArrowDownIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1 rounded text-danger hover:bg-dark-gray"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-16">
                <div>
                  <label className="block text-sm font-medium text-light-gray mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-dark-gray border border-dark-gray rounded-md text-white focus:outline-none focus:ring-1 focus:ring-teal"
                    value={item.title}
                    onChange={(e) =>
                      updateItem(item.id, "title", e.target.value)
                    }
                    placeholder="Agenda item title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-gray mb-1">
                    Owner
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-dark-gray border border-dark-gray rounded-md text-white focus:outline-none focus:ring-1 focus:ring-teal"
                    value={item.owner}
                    onChange={(e) =>
                      updateItem(item.id, "owner", e.target.value)
                    }
                    placeholder="Item owner"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-gray mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    className="w-full px-3 py-2 bg-dark-gray border border-dark-gray rounded-md text-white focus:outline-none focus:ring-1 focus:ring-teal"
                    value={item.durationMinutes}
                    onChange={(e) =>
                      updateItem(
                        item.id,
                        "durationMinutes",
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-light-gray mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 bg-dark-gray border border-dark-gray rounded-md text-white focus:outline-none focus:ring-1 focus:ring-teal resize-none"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(item.id, "description", e.target.value)
                    }
                    placeholder="Briefly describe this agenda item"
                    rows={2}
                  />
                </div>
              </div>
            </Card>
          ))}

          <div className="flex justify-center">
            <Button
              variant="secondary"
              size="sm"
              onClick={addNewItem}
              className="flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Agenda Item
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {agendaItems.length > 0 ? (
            agendaItems.map((item, index) => (
              <div
                key={item.id}
                className="flex py-3 border-b border-dark-gray last:border-b-0"
              >
                <div className="flex-shrink-0 w-8 text-light-gray text-center">
                  {index + 1}.
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-white">{item.title}</h3>
                    <span className="text-light-gray text-sm">
                      {item.durationMinutes} min
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-light-gray text-sm mt-1">
                      {item.description}
                    </p>
                  )}
                  {item.owner && (
                    <p className="text-teal text-sm mt-1">
                      Owner: {item.owner}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-light-gray">
              No agenda items defined yet. Click "Edit Agenda" to create the
              meeting agenda.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
