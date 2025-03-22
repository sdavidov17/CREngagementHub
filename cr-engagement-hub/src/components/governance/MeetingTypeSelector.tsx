"use client";

import React from "react";
import { MeetingType, meetingTypes } from "@/types/governance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

interface MeetingTypeSelectorProps {
  onSelect: (meetingType: MeetingType) => void;
}

export function MeetingTypeSelector({ onSelect }: MeetingTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-h2 font-bold text-white">Select Meeting Type</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {meetingTypes.map((type) => (
          <Card
            key={type.id}
            className="cursor-pointer transition-all hover:border-teal"
            onClick={() => onSelect(type)}
          >
            <CardHeader>
              <CardTitle>{type.name}</CardTitle>
              <p className="text-small text-light-gray mt-1">
                Cadence:{" "}
                {type.cadence.charAt(0).toUpperCase() + type.cadence.slice(1)}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-small text-white mb-4">{type.description}</p>
              <div>
                <h4 className="text-small font-medium text-light-gray mb-2">
                  Required Attendees:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {type.requiredAttendees.map((role) => (
                    <span
                      key={role}
                      className="px-2 py-1 rounded-md bg-dark-gray text-light-gray text-xs"
                    >
                      {role
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
