"use client";

import React, { useState } from "react";
import { StakeholderMapping } from "@/types/governance";
import { Button } from "@/components/ui";
import { formatDistanceToNow } from "date-fns";

interface StakeholderMappingTableProps {
  mappings: StakeholderMapping[];
  onEdit: (mapping: StakeholderMapping) => void;
  onDelete: (mappingId: string) => void;
  onAdd: () => void;
}

export function StakeholderMappingTable({
  mappings,
  onEdit,
  onDelete,
  onAdd,
}: StakeholderMappingTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMappings = mappings.filter(
    (mapping) =>
      mapping.clientStakeholderId
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      mapping.clearRouteTeamMemberId
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (mapping.notes &&
        mapping.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-h2 font-bold text-white">Stakeholder Mapping</h2>
        <Button onClick={onAdd} variant="primary" size="sm">
          Add Relationship
        </Button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search stakeholders..."
          className="w-full px-3 py-2 bg-dark-gray border border-dark-gray rounded-md text-white focus:outline-none focus:ring-1 focus:ring-teal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-dark-gray">
            <tr>
              <th className="px-4 py-3 text-left text-small font-medium text-light-gray">
                Client Stakeholder
              </th>
              <th className="px-4 py-3 text-left text-small font-medium text-light-gray">
                ClearRoute Contact
              </th>
              <th className="px-4 py-3 text-left text-small font-medium text-light-gray">
                Relationship
              </th>
              <th className="px-4 py-3 text-left text-small font-medium text-light-gray">
                Last Contact
              </th>
              <th className="px-4 py-3 text-left text-small font-medium text-light-gray">
                Notes
              </th>
              <th className="px-4 py-3 text-right text-small font-medium text-light-gray">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-gray">
            {filteredMappings.length > 0 ? (
              filteredMappings.map((mapping) => (
                <tr key={mapping.id} className="hover:bg-dark-gray/50">
                  <td className="px-4 py-3 text-white">
                    {mapping.clientStakeholderId}
                  </td>
                  <td className="px-4 py-3 text-white">
                    {mapping.clearRouteTeamMemberId}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        mapping.relationship === "primary"
                          ? "bg-teal/20 text-teal"
                          : "bg-light-gray/20 text-light-gray"
                      }`}
                    >
                      {mapping.relationship.charAt(0).toUpperCase() +
                        mapping.relationship.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-light-gray">
                    {mapping.lastContactDate
                      ? formatDistanceToNow(mapping.lastContactDate, {
                          addSuffix: true,
                        })
                      : "Never"}
                  </td>
                  <td className="px-4 py-3 text-light-gray truncate max-w-xs">
                    {mapping.notes || "—"}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => onEdit(mapping)}
                      className="px-2 py-1 text-xs text-teal hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(mapping.id)}
                      className="px-2 py-1 text-xs text-danger hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-light-gray"
                >
                  {searchTerm
                    ? "No stakeholder mappings found matching your search."
                    : 'No stakeholder mappings defined yet. Click "Add Relationship" to create one.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
