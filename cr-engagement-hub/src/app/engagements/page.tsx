"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { format } from "date-fns";

interface Client {
  id: string;
  name: string;
}

interface TeamMember {
  id: string;
  name: string;
}

interface Engagement {
  id: string;
  name: string;
  client: Client;
  startDate: string;
  endDate: string | null;
  status: "Active" | "Planned" | "Completed" | "On Hold";
  description: string;
  teamMembers: TeamMember[];
}

// Mock data for engagements
const mockEngagements: Engagement[] = [
  {
    id: "eng-001",
    name: "E-commerce Platform Redesign",
    client: { id: "client-001", name: "RetailX" },
    startDate: "2023-06-15",
    endDate: "2023-12-15",
    status: "Active",
    description:
      "Complete redesign of the client's e-commerce platform with focus on UX and performance.",
    teamMembers: [
      { id: "tm-001", name: "John Smith" },
      { id: "tm-002", name: "Emily Chen" },
      { id: "tm-003", name: "Michael Johnson" },
    ],
  },
  {
    id: "eng-002",
    name: "Financial System Integration",
    client: { id: "client-002", name: "Global Finance Co." },
    startDate: "2023-08-01",
    endDate: null,
    status: "Active",
    description:
      "Integration of multiple financial systems to create a unified platform for reporting.",
    teamMembers: [
      { id: "tm-002", name: "Emily Chen" },
      { id: "tm-004", name: "David Rodriguez" },
    ],
  },
  {
    id: "eng-003",
    name: "Mobile App Development",
    client: { id: "client-003", name: "HealthPlus" },
    startDate: "2023-09-15",
    endDate: "2024-03-15",
    status: "Planned",
    description:
      "Development of a mobile application for patient appointment scheduling and management.",
    teamMembers: [
      { id: "tm-001", name: "John Smith" },
      { id: "tm-006", name: "Sarah Lee" },
    ],
  },
  {
    id: "eng-004",
    name: "ERP Implementation",
    client: { id: "client-004", name: "Manufacturing Inc." },
    startDate: "2023-01-10",
    endDate: "2023-07-30",
    status: "Completed",
    description: "Full implementation of ERP system across all departments.",
    teamMembers: [
      { id: "tm-004", name: "David Rodriguez" },
      { id: "tm-005", name: "Lisa Wang" },
      { id: "tm-007", name: "Robert Kim" },
    ],
  },
  {
    id: "eng-005",
    name: "Cloud Migration Strategy",
    client: { id: "client-005", name: "TechSolutions" },
    startDate: "2023-05-20",
    endDate: "2023-11-20",
    status: "On Hold",
    description:
      "Strategic planning and execution of migration to cloud infrastructure.",
    teamMembers: [
      { id: "tm-005", name: "Lisa Wang" },
      { id: "tm-008", name: "James Wilson" },
    ],
  },
];

// Function to fetch engagements (mock implementation)
const fetchEngagements = async () => {
  return new Promise<Engagement[]>((resolve) => {
    setTimeout(() => resolve(mockEngagements), 500);
  });
};

export default function EngagementsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: engagements, isLoading } = useQuery({
    queryKey: ["engagements"],
    queryFn: fetchEngagements,
  });

  // Filter engagements based on search term and status filter
  const filteredEngagements = engagements
    ? engagements.filter((engagement) => {
        const matchesSearch =
          searchTerm === "" ||
          engagement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          engagement.client.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          engagement.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "all" ||
          engagement.status.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
      })
    : [];

  // Get counts by status
  const getStatusCounts = () => {
    if (!engagements)
      return { Active: 0, Planned: 0, Completed: 0, "On Hold": 0 };

    return engagements.reduce((counts, engagement) => {
      counts[engagement.status] = (counts[engagement.status] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
  };

  const statusCounts = getStatusCounts();

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="mb-6 text-3xl font-bold">Engagements</h1>
        <div>Loading engagements...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Engagements</h1>
        <Link
          href="/engagements/new"
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          New Engagement
        </Link>
      </div>

      {/* Status Overview */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        <div className="rounded-md bg-blue-100 p-4">
          <h2 className="mb-1 text-sm font-medium text-gray-500">Active</h2>
          <p className="text-2xl font-bold text-blue-600">
            {statusCounts.Active || 0}
          </p>
        </div>
        <div className="rounded-md bg-purple-100 p-4">
          <h2 className="mb-1 text-sm font-medium text-gray-500">Planned</h2>
          <p className="text-2xl font-bold text-purple-600">
            {statusCounts.Planned || 0}
          </p>
        </div>
        <div className="rounded-md bg-green-100 p-4">
          <h2 className="mb-1 text-sm font-medium text-gray-500">Completed</h2>
          <p className="text-2xl font-bold text-green-600">
            {statusCounts.Completed || 0}
          </p>
        </div>
        <div className="rounded-md bg-orange-100 p-4">
          <h2 className="mb-1 text-sm font-medium text-gray-500">On Hold</h2>
          <p className="text-2xl font-bold text-orange-600">
            {statusCounts["On Hold"] || 0}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search engagements..."
            className="w-full rounded-md border border-gray-300 p-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <select
            className="rounded-md border border-gray-300 p-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="planned">Planned</option>
            <option value="completed">Completed</option>
            <option value="on hold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Engagements List */}
      <div className="space-y-4">
        {filteredEngagements.length === 0 ? (
          <p className="text-center text-gray-500">
            No engagements found matching your criteria.
          </p>
        ) : (
          filteredEngagements.map((engagement) => (
            <div
              key={engagement.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold text-gray-900">
                    <Link
                      href={`/engagements/${engagement.id}`}
                      className="hover:text-blue-600"
                    >
                      {engagement.name}
                    </Link>
                  </h2>
                  <p className="text-sm text-gray-500">
                    Client: {engagement.client.name}
                  </p>
                </div>
                <div className="flex items-center">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      engagement.status === "Active"
                        ? "bg-blue-100 text-blue-800"
                        : engagement.status === "Planned"
                        ? "bg-purple-100 text-purple-800"
                        : engagement.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {engagement.status}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {engagement.description}
              </p>
              <div className="mt-4 flex flex-wrap justify-between">
                <div className="text-sm text-gray-500">
                  {format(new Date(engagement.startDate), "MMM d, yyyy")} -{" "}
                  {engagement.endDate
                    ? format(new Date(engagement.endDate), "MMM d, yyyy")
                    : "Ongoing"}
                </div>
                <div className="flex flex-wrap gap-2">
                  {engagement.teamMembers.map((member) => (
                    <span
                      key={member.id}
                      className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800"
                    >
                      {member.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
