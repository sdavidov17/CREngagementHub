"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui";
import { PlusIcon } from "@heroicons/react/24/outline";
import { FormModal } from "@/components/modals/FormModal";
import { ObjectiveForm } from "@/components/okr/ObjectiveForm";
import { KeyResultForm } from "@/components/okr/KeyResultForm";

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
  const [isAddObjectiveModalOpen, setIsAddObjectiveModalOpen] = useState(false);
  const [isAddKeyResultModalOpen, setIsAddKeyResultModalOpen] = useState(false);
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string | null>(
    null
  );

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

  // Sample data for dropdown options
  const teamMembers = [
    { id: "tm-001", name: "John Smith" },
    { id: "tm-002", name: "Emily Chen" },
    { id: "tm-003", name: "Michael Johnson" },
    { id: "tm-004", name: "David Rodriguez" },
  ];

  const quarters = getQuarters();

  // Handler for adding a new objective (mock implementation)
  const handleAddObjective = async (data: any) => {
    console.log("Adding new objective:", data);
    // In a real app, this would submit to an API
    // After success, close the modal and maybe refetch data
    setIsAddObjectiveModalOpen(false);
    // Refetch objectives if needed
  };

  // Handler for adding a new key result (mock implementation)
  const handleAddKeyResult = async (objectiveId: string, data: any) => {
    console.log(`Adding new key result to objective ${objectiveId}:`, data);
    // In a real app, this would submit to an API
    // After success, close the modal and maybe refetch data
    setIsAddKeyResultModalOpen(false);
    setSelectedObjectiveId(null);
    // Refetch objectives if needed
  };

  // Handler to open the Add Key Result modal for a specific objective
  const openAddKeyResultModal = (objectiveId: string) => {
    setSelectedObjectiveId(objectiveId);
    setIsAddKeyResultModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="mb-6 text-h1 font-bold text-white">OKRs</h1>
        <div className="text-light-gray">Loading objectives...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-h1 font-bold text-white">OKRs</h1>
        <Button
          variant="primary"
          onClick={() => setIsAddObjectiveModalOpen(true)}
          className="flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Objective
        </Button>
      </div>

      {/* Status summary section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-secondary-bg rounded-lg p-4">
          <div className="text-sm text-light-gray mb-1">On Track</div>
          <div className="text-h3 font-bold text-success">
            {statusCounts["On Track"] || 0}
          </div>
        </div>
        <div className="bg-secondary-bg rounded-lg p-4">
          <div className="text-sm text-light-gray mb-1">At Risk</div>
          <div className="text-h3 font-bold text-warning">
            {statusCounts["At Risk"] || 0}
          </div>
        </div>
        <div className="bg-secondary-bg rounded-lg p-4">
          <div className="text-sm text-light-gray mb-1">Behind</div>
          <div className="text-h3 font-bold text-danger">
            {statusCounts["Behind"] || 0}
          </div>
        </div>
        <div className="bg-secondary-bg rounded-lg p-4">
          <div className="text-sm text-light-gray mb-1">Completed</div>
          <div className="text-h3 font-bold text-teal">
            {statusCounts["Completed"] || 0}
          </div>
        </div>
      </div>

      {/* Filters section */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search objectives..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-dark-gray bg-secondary-bg p-2 text-white focus:outline-none focus:ring-1 focus:ring-teal"
          />
        </div>
        <div className="w-full md:w-48">
          <select
            value={quarterFilter}
            onChange={(e) => setQuarterFilter(e.target.value)}
            className="w-full rounded-md border border-dark-gray bg-secondary-bg p-2 text-white focus:outline-none focus:ring-1 focus:ring-teal"
          >
            <option value="">All Quarters</option>
            {quarters.map((quarter) => (
              <option key={quarter} value={quarter}>
                {quarter}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-md border border-dark-gray bg-secondary-bg p-2 text-white focus:outline-none focus:ring-1 focus:ring-teal"
          >
            <option value="">All Statuses</option>
            <option value="On Track">On Track</option>
            <option value="At Risk">At Risk</option>
            <option value="Behind">Behind</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Objectives list section */}
      <div className="space-y-6">
        {filteredObjectives.length === 0 ? (
          <div className="text-light-gray text-center py-8">
            No objectives found matching your criteria.
          </div>
        ) : (
          filteredObjectives.map((objective) => (
            <div
              key={objective.id}
              className="bg-secondary-bg rounded-lg p-6 space-y-4"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <Link
                    href={`/objectives/${objective.id}`}
                    className="text-h2 font-bold text-white hover:text-teal transition-colors"
                  >
                    {objective.title}
                  </Link>
                  <div className="text-light-gray mt-1">
                    {objective.description}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-light-gray">
                    {objective.quarter}
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      objective.status
                    )}`}
                  >
                    {objective.status}
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="text-sm text-light-gray">
                  Owner: {objective.owner.name}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-dark-gray rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getProgressColor(
                        calculateObjectiveProgress(objective.keyResults)
                      )}`}
                      style={{
                        width: `${calculateObjectiveProgress(
                          objective.keyResults
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-sm text-light-gray">
                    {calculateObjectiveProgress(objective.keyResults)}%
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">
                    Key Results ({objective.keyResults.length})
                  </h3>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => openAddKeyResultModal(objective.id)}
                    className="flex items-center"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Key Result
                  </Button>
                </div>
                <div className="space-y-2">
                  {objective.keyResults.map((kr) => (
                    <div
                      key={kr.id}
                      className="bg-primary-bg p-4 rounded-lg space-y-2"
                    >
                      <div className="flex justify-between items-center gap-4">
                        <div className="text-white font-medium">
                          {kr.description}
                        </div>
                        <div
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            kr.status
                          )}`}
                        >
                          {kr.status}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-full h-1.5 bg-dark-gray rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getProgressColor(
                              kr.progress
                            )}`}
                            style={{ width: `${kr.progress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-light-gray w-8 text-right">
                          {kr.progress}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Objective Modal */}
      <FormModal
        isOpen={isAddObjectiveModalOpen}
        onClose={() => setIsAddObjectiveModalOpen(false)}
        title="Add New Objective"
        size="xl"
      >
        <ObjectiveForm
          owners={teamMembers}
          quarters={quarters}
          onSubmit={handleAddObjective}
          onCancel={() => setIsAddObjectiveModalOpen(false)}
        />
      </FormModal>

      {/* Add Key Result Modal */}
      <FormModal
        isOpen={isAddKeyResultModalOpen}
        onClose={() => {
          setIsAddKeyResultModalOpen(false);
          setSelectedObjectiveId(null);
        }}
        title="Add Key Result"
        size="xl"
      >
        {selectedObjectiveId && (
          <KeyResultForm
            objectiveId={selectedObjectiveId}
            owners={teamMembers}
            onSubmit={handleAddKeyResult}
            onCancel={() => {
              setIsAddKeyResultModalOpen(false);
              setSelectedObjectiveId(null);
            }}
          />
        )}
      </FormModal>
    </div>
  );
}
