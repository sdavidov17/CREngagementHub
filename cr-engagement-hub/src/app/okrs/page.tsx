"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface KeyResult {
  id: string;
  description: string;
  progress: number; // 0-100
  status: "Not Started" | "In Progress" | "At Risk" | "Behind" | "Completed";
}

interface Objective {
  id: string;
  title: string;
  description: string;
  quarter: string;
  owner: {
    id: string;
    name: string;
  };
  status: "On Track" | "At Risk" | "Behind" | "Completed";
  keyResults: KeyResult[];
}

// Mock data for OKRs
const mockObjectives: Objective[] = [
  {
    id: "obj-001",
    title: "Increase Team Efficiency",
    description:
      "Implement processes and tools to improve team productivity and collaboration",
    quarter: "Q3 2023",
    owner: {
      id: "tm-001",
      name: "John Smith",
    },
    status: "On Track",
    keyResults: [
      {
        id: "kr-001",
        description: "Reduce meeting time by 20%",
        progress: 75,
        status: "In Progress",
      },
      {
        id: "kr-002",
        description: "Implement automated testing for core modules",
        progress: 90,
        status: "In Progress",
      },
      {
        id: "kr-003",
        description: "Achieve 95% on-time delivery for sprint tasks",
        progress: 85,
        status: "In Progress",
      },
    ],
  },
  {
    id: "obj-002",
    title: "Improve Client Satisfaction",
    description: "Enhance client experience and feedback metrics",
    quarter: "Q3 2023",
    owner: {
      id: "tm-002",
      name: "Emily Chen",
    },
    status: "At Risk",
    keyResults: [
      {
        id: "kr-004",
        description: "Increase NPS score from 7.5 to 8.5",
        progress: 50,
        status: "At Risk",
      },
      {
        id: "kr-005",
        description: "Reduce client support response time to under 2 hours",
        progress: 70,
        status: "In Progress",
      },
      {
        id: "kr-006",
        description: "Conduct quarterly reviews with all active clients",
        progress: 33,
        status: "Behind",
      },
    ],
  },
  {
    id: "obj-003",
    title: "Expand Technical Expertise",
    description: "Develop team skills in emerging technologies",
    quarter: "Q2 2023",
    owner: {
      id: "tm-003",
      name: "Michael Johnson",
    },
    status: "Completed",
    keyResults: [
      {
        id: "kr-007",
        description: "Complete cloud certification for 80% of technical team",
        progress: 100,
        status: "Completed",
      },
      {
        id: "kr-008",
        description: "Deliver 3 internal workshops on new technologies",
        progress: 100,
        status: "Completed",
      },
      {
        id: "kr-009",
        description: "Create learning path documentation for key roles",
        progress: 100,
        status: "Completed",
      },
    ],
  },
  {
    id: "obj-004",
    title: "Optimize Resource Utilization",
    description: "Improve allocation and utilization of team resources",
    quarter: "Q4 2023",
    owner: {
      id: "tm-004",
      name: "David Rodriguez",
    },
    status: "Behind",
    keyResults: [
      {
        id: "kr-010",
        description: "Increase team utilization to 85%",
        progress: 40,
        status: "At Risk",
      },
      {
        id: "kr-011",
        description: "Implement capacity planning tool",
        progress: 20,
        status: "Not Started",
      },
      {
        id: "kr-012",
        description: "Reduce bench time by 15%",
        progress: 30,
        status: "Behind",
      },
    ],
  },
];

// Function to fetch objectives (mock implementation)
const fetchObjectives = async () => {
  return new Promise<Objective[]>((resolve) => {
    setTimeout(() => resolve(mockObjectives), 500);
  });
};

export default function OKRsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [quarterFilter, setQuarterFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const { data: objectives, isLoading } = useQuery({
    queryKey: ["objectives"],
    queryFn: fetchObjectives,
  });

  // Filter objectives based on search term, quarter, and status
  const filteredObjectives = objectives
    ? objectives.filter((objective) => {
        const matchesSearch =
          searchTerm === "" ||
          objective.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          objective.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          objective.owner.name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesQuarter =
          quarterFilter === "" || objective.quarter === quarterFilter;

        const matchesStatus =
          statusFilter === "" ||
          objective.status.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesQuarter && matchesStatus;
      })
    : [];

  // Extract unique quarters for filter dropdown
  const getQuarters = () => {
    if (!objectives) return [];
    const quarters = new Set(objectives.map((obj) => obj.quarter));
    return Array.from(quarters).sort();
  };

  // Count objectives by status
  const getStatusCounts = () => {
    if (!objectives)
      return { "On Track": 0, "At Risk": 0, Behind: 0, Completed: 0 };

    return objectives.reduce((counts, obj) => {
      counts[obj.status] = (counts[obj.status] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
  };

  // Calculate objective progress based on key results
  const calculateObjectiveProgress = (keyResults: KeyResult[]) => {
    if (keyResults.length === 0) return 0;
    const totalProgress = keyResults.reduce((sum, kr) => sum + kr.progress, 0);
    return Math.round(totalProgress / keyResults.length);
  };

  // Get color for status badge
  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Track":
        return "bg-success/20 text-success";
      case "At Risk":
        return "bg-warning/20 text-warning";
      case "Behind":
        return "bg-danger/20 text-danger";
      case "Completed":
        return "bg-teal/20 text-teal";
      default:
        return "bg-light-gray/20 text-light-gray";
    }
  };

  // Get color for progress bar
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-success";
    if (progress >= 50) return "bg-warning";
    return "bg-danger";
  };

  const statusCounts = getStatusCounts();

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="mb-6 text-h1 font-bold text-white">OKRs</h1>
        <div className="text-light-gray">Loading objectives...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-h1 font-bold text-white">OKRs</h1>
        <Link
          href="/okrs/new"
          className="btn btn-primary rounded-md bg-teal px-4 py-2 font-medium text-navy"
        >
          New Objective
        </Link>
      </div>

      {/* Status Overview */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        <div className="rounded-md bg-secondary-bg p-4">
          <h2 className="mb-1 text-sm font-medium text-light-gray">On Track</h2>
          <p className="text-2xl font-bold text-success">
            {statusCounts["On Track"] || 0}
          </p>
        </div>
        <div className="rounded-md bg-secondary-bg p-4">
          <h2 className="mb-1 text-sm font-medium text-light-gray">At Risk</h2>
          <p className="text-2xl font-bold text-warning">
            {statusCounts["At Risk"] || 0}
          </p>
        </div>
        <div className="rounded-md bg-secondary-bg p-4">
          <h2 className="mb-1 text-sm font-medium text-light-gray">Behind</h2>
          <p className="text-2xl font-bold text-danger">
            {statusCounts["Behind"] || 0}
          </p>
        </div>
        <div className="rounded-md bg-secondary-bg p-4">
          <h2 className="mb-1 text-sm font-medium text-light-gray">
            Completed
          </h2>
          <p className="text-2xl font-bold text-teal">
            {statusCounts["Completed"] || 0}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search objectives..."
            className="w-full rounded-md border border-dark-gray bg-secondary-bg p-2 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <select
            className="rounded-md border border-dark-gray bg-secondary-bg p-2 text-white"
            value={quarterFilter}
            onChange={(e) => setQuarterFilter(e.target.value)}
            aria-label="Quarter Filter"
          >
            <option value="">All Quarters</option>
            {getQuarters().map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            className="rounded-md border border-dark-gray bg-secondary-bg p-2 text-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Status Filter"
          >
            <option value="">All Statuses</option>
            <option value="on track">On Track</option>
            <option value="at risk">At Risk</option>
            <option value="behind">Behind</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Objectives */}
      <div className="space-y-4">
        {filteredObjectives.length === 0 ? (
          <div className="rounded-md bg-secondary-bg p-6 text-center">
            <p className="text-light-gray">
              No objectives found matching your criteria.
            </p>
          </div>
        ) : (
          filteredObjectives.map((objective) => (
            <div
              key={objective.id}
              className="rounded-lg border border-dark-gray bg-secondary-bg p-4 shadow-card"
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-h2 font-bold text-white">
                    <Link
                      href={`/okrs/${objective.id}`}
                      className="hover:text-teal"
                    >
                      {objective.title}
                    </Link>
                  </h2>
                  <p className="mt-1 text-small text-light-gray">
                    {objective.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`status-pill inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                      objective.status
                    )}`}
                  >
                    {objective.status}
                  </span>
                </div>
              </div>

              <div className="mb-4 flex flex-wrap justify-between gap-y-2 text-small">
                <div className="flex items-center space-x-4">
                  <span className="text-light-gray">
                    Owner: {objective.owner.name}
                  </span>
                  <span className="text-light-gray">
                    Quarter: {objective.quarter}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-light-gray">Progress:</span>
                  <div className="h-2 w-36 rounded-full bg-dark-gray">
                    <div
                      className={`h-2 rounded-full ${getProgressColor(
                        calculateObjectiveProgress(objective.keyResults)
                      )}`}
                      style={{
                        width: `${calculateObjectiveProgress(
                          objective.keyResults
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <span className="ml-2 text-white">
                    {calculateObjectiveProgress(objective.keyResults)}%
                  </span>
                </div>
              </div>

              <div className="border-t border-dark-gray pt-4">
                <h3 className="mb-2 text-h3 font-medium text-white">
                  Key Results
                </h3>
                <ul className="space-y-3">
                  {objective.keyResults.map((kr) => (
                    <li
                      key={kr.id}
                      className="flex flex-wrap items-center justify-between gap-2"
                    >
                      <div className="flex-grow">
                        <p className="text-small text-white">
                          {kr.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="h-2 w-24 rounded-full bg-dark-gray sm:w-32">
                          <div
                            className={`h-2 rounded-full ${getProgressColor(
                              kr.progress
                            )}`}
                            style={{ width: `${kr.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-small text-white">
                          {kr.progress}%
                        </span>
                        <span
                          className={`status-pill inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                            kr.status
                          )}`}
                        >
                          {kr.status}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
