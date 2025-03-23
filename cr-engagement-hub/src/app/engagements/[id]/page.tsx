"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeftIcon,
  CalendarIcon,
  UserGroupIcon,
  DocumentIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckCircleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
  StatusBadge,
  ProgressBar,
} from "@/components/ui";
import { StatusTracker } from "@/components/rag/StatusTracker";
import { RAGStatusForm } from "@/components/rag/RAGStatusForm";
import { FormModal } from "@/components/modals/FormModal";
import { SuccessMetricsCard } from "@/components/metrics/SuccessMetricsCard";
import { EnhancedObjectiveCard } from "@/components/okr/EnhancedObjectiveCard";
import { RagStatus } from "@/types/rag";
import { SuccessMetric } from "@/types/metrics";
import { Objective, KeyResult } from "@/types/okr";

// Mock data interfaces
interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  createdBy: string;
  url: string;
}

interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  status: "completed" | "in_progress" | "pending";
}

interface MeetingSchedule {
  id: string;
  title: string;
  frequency: string;
  nextDate: string;
  participants: string[];
}

interface Engagement {
  id: string;
  name: string;
  client: {
    id: string;
    name: string;
  };
  description: string;
  startDate: string;
  endDate: string | null;
  status: "Active" | "Planned" | "Completed" | "On Hold";
  teamMembers: TeamMember[];
  documents: Document[];
  milestones: Milestone[];
  meetings: MeetingSchedule[];
}

// Mock data for a single engagement
const mockEngagement: Engagement = {
  id: "eng-001",
  name: "E-commerce Platform Redesign",
  client: { id: "client-001", name: "RetailX" },
  description:
    "Complete redesign of the client's e-commerce platform with focus on UX and performance improvements. This includes a full technical assessment, UI/UX redesign, and implementation of a new checkout process.",
  startDate: "2023-06-15",
  endDate: "2023-12-15",
  status: "Active",
  teamMembers: [
    {
      id: "tm-001",
      name: "John Smith",
      role: "Project Manager",
      email: "john.smith@clearroute.com",
    },
    {
      id: "tm-002",
      name: "Emily Chen",
      role: "Technical Lead",
      email: "emily.chen@clearroute.com",
    },
    {
      id: "tm-003",
      name: "Michael Johnson",
      role: "UX Designer",
      email: "michael.johnson@clearroute.com",
    },
    {
      id: "tm-004",
      name: "Sara Williams",
      role: "Frontend Developer",
      email: "sara.williams@clearroute.com",
    },
    {
      id: "tm-005",
      name: "David Rodriguez",
      role: "Backend Developer",
      email: "david.rodriguez@clearroute.com",
    },
  ],
  documents: [
    {
      id: "doc-001",
      name: "Project Plan",
      type: "PDF",
      createdAt: "2023-06-20",
      createdBy: "John Smith",
      url: "/documents/project-plan.pdf",
    },
    {
      id: "doc-002",
      name: "Technical Specification",
      type: "DOCX",
      createdAt: "2023-06-25",
      createdBy: "Emily Chen",
      url: "/documents/tech-spec.docx",
    },
    {
      id: "doc-003",
      name: "UX Research",
      type: "PDF",
      createdAt: "2023-07-05",
      createdBy: "Michael Johnson",
      url: "/documents/ux-research.pdf",
    },
    {
      id: "doc-004",
      name: "Status Report - July",
      type: "PDF",
      createdAt: "2023-07-30",
      createdBy: "John Smith",
      url: "/documents/status-july.pdf",
    },
  ],
  milestones: [
    {
      id: "ms-001",
      title: "Project Kickoff",
      dueDate: "2023-06-15",
      status: "completed",
    },
    {
      id: "ms-002",
      title: "Requirements Gathering",
      dueDate: "2023-07-01",
      status: "completed",
    },
    {
      id: "ms-003",
      title: "Design Phase Completion",
      dueDate: "2023-08-15",
      status: "in_progress",
    },
    {
      id: "ms-004",
      title: "Development Phase 1",
      dueDate: "2023-09-30",
      status: "pending",
    },
    {
      id: "ms-005",
      title: "User Acceptance Testing",
      dueDate: "2023-11-15",
      status: "pending",
    },
    {
      id: "ms-006",
      title: "Production Deployment",
      dueDate: "2023-12-10",
      status: "pending",
    },
  ],
  meetings: [
    {
      id: "meet-001",
      title: "Weekly Status Update",
      frequency: "Weekly",
      nextDate: "2023-08-07",
      participants: ["John Smith", "Emily Chen", "Client PM"],
    },
    {
      id: "meet-002",
      title: "Technical Review",
      frequency: "Bi-weekly",
      nextDate: "2023-08-15",
      participants: [
        "Emily Chen",
        "David Rodriguez",
        "Sara Williams",
        "Client Tech Lead",
      ],
    },
    {
      id: "meet-003",
      title: "Steering Committee",
      frequency: "Monthly",
      nextDate: "2023-08-30",
      participants: ["John Smith", "Emily Chen", "Client Stakeholders"],
    },
  ],
};

// Mock RAG statuses for the engagement
const mockRagStatuses: RagStatus[] = [
  {
    id: "rag-001",
    title: "Development Progress",
    description: "Overall development progress against timeline",
    currentStatus: "amber",
    category: "Timeline",
    owner: "Emily Chen",
    priority: "high",
    lastUpdated: "2023-08-01",
    engagementId: "eng-001",
    comments: [
      {
        author: "Emily Chen",
        text: "We're experiencing some delays with the payment integration. Working on solutions.",
        timestamp: "2023-08-01",
      },
    ],
  },
  {
    id: "rag-002",
    title: "Budget Status",
    description: "Current budget utilization and forecast",
    currentStatus: "green",
    category: "Budget",
    owner: "John Smith",
    priority: "high",
    lastUpdated: "2023-07-28",
    engagementId: "eng-001",
    comments: [
      {
        author: "John Smith",
        text: "Budget is on track. Current utilization is at 42% which aligns with our timeline.",
        timestamp: "2023-07-28",
      },
    ],
  },
  {
    id: "rag-003",
    title: "Resource Allocation",
    description: "Team availability and resource gaps",
    currentStatus: "red",
    category: "Resourcing",
    owner: "John Smith",
    priority: "medium",
    lastUpdated: "2023-08-02",
    engagementId: "eng-001",
    comments: [
      {
        author: "John Smith",
        text: "We need an additional frontend developer to meet the upcoming milestones.",
        timestamp: "2023-08-02",
      },
    ],
  },
];

// Mock success metrics for the engagement
const mockSuccessMetrics: SuccessMetric[] = [
  {
    id: "metric-001",
    name: "Page Load Time",
    description: "Average time to load product pages",
    current: 2.3,
    target: 1.5,
    format: "number",
    status: "at_risk",
    trend: "decreasing",
    trendIsGood: true,
    period: "Last 7 days",
    category: "Performance",
    engagementId: "eng-001",
    lastUpdated: "2023-08-01",
  },
  {
    id: "metric-002",
    name: "Conversion Rate",
    description: "Percentage of visitors completing a purchase",
    current: 3.2,
    target: 5.0,
    format: "percentage",
    status: "off_track",
    trend: "stable",
    trendIsGood: false,
    period: "Last 30 days",
    category: "Business",
    engagementId: "eng-001",
    lastUpdated: "2023-07-30",
  },
  {
    id: "metric-003",
    name: "Average Order Value",
    description: "Average amount spent per order",
    current: 65,
    target: 75,
    format: "currency",
    status: "on_track",
    trend: "increasing",
    trendIsGood: true,
    period: "Last 30 days",
    category: "Business",
    engagementId: "eng-001",
    lastUpdated: "2023-07-30",
  },
];

// Mock OKRs for the engagement
const mockObjectives: Objective[] = [
  {
    id: "obj-001",
    title: "Improve Website Performance",
    description: "Enhance overall website performance and user experience",
    status: "on_track",
    quarter: "Q3 2023",
    owner: "Emily Chen",
    progress: 65,
    keyResults: [
      {
        id: "kr-001",
        title: "Reduce page load time to under 1.5 seconds",
        description: "Optimize assets and implement lazy loading",
        status: "at_risk",
        progress: 60,
        owner: "Sara Williams",
        startDate: "2023-07-01",
        targetDate: "2023-09-15",
        comments: [
          {
            author: "Sara Williams",
            text: "Working on image optimization to improve load times",
            timestamp: "2023-07-25",
          },
        ],
      },
      {
        id: "kr-002",
        title: "Achieve 90+ Google PageSpeed score",
        description:
          "Address all critical performance issues flagged by PageSpeed",
        status: "on_track",
        progress: 75,
        owner: "David Rodriguez",
        startDate: "2023-07-10",
        targetDate: "2023-09-30",
        comments: [],
      },
      {
        id: "kr-003",
        title: "Implement CDN for all static assets",
        description: "Set up and configure CDN distribution",
        status: "completed",
        progress: 100,
        owner: "David Rodriguez",
        startDate: "2023-07-05",
        targetDate: "2023-07-31",
        comments: [
          {
            author: "David Rodriguez",
            text: "CDN implementation completed ahead of schedule",
            timestamp: "2023-07-15",
          },
        ],
      },
    ],
    engagementId: "eng-001",
    createdAt: "2023-06-20",
    updatedAt: "2023-08-01",
  },
  {
    id: "obj-002",
    title: "Redesign Checkout Flow",
    description: "Create a streamlined checkout process to reduce abandonment",
    status: "on_track",
    quarter: "Q3 2023",
    owner: "Michael Johnson",
    progress: 40,
    keyResults: [
      {
        id: "kr-004",
        title: "Reduce checkout abandonment rate by 20%",
        description: "Analyze current abandonment points and redesign flow",
        status: "on_track",
        progress: 50,
        owner: "Michael Johnson",
        startDate: "2023-07-15",
        targetDate: "2023-10-15",
        comments: [],
      },
      {
        id: "kr-005",
        title: "Implement one-click purchase for returning customers",
        description:
          "Add feature for saved payment methods and shipping addresses",
        status: "behind",
        progress: 30,
        owner: "Sara Williams",
        startDate: "2023-07-15",
        targetDate: "2023-09-30",
        comments: [
          {
            author: "Emily Chen",
            text: "Facing some integration challenges with the payment processor",
            timestamp: "2023-07-28",
          },
        ],
      },
    ],
    engagementId: "eng-001",
    createdAt: "2023-06-25",
    updatedAt: "2023-08-02",
  },
];

// Mock fetch functions
const fetchEngagement = async (id: string): Promise<Engagement> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockEngagement), 500);
  });
};

const fetchRagStatuses = async (engagementId: string): Promise<RagStatus[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockRagStatuses), 500);
  });
};

const fetchSuccessMetrics = async (
  engagementId: string
): Promise<SuccessMetric[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockSuccessMetrics), 500);
  });
};

const fetchObjectives = async (engagementId: string): Promise<Objective[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockObjectives), 500);
  });
};

export default function EngagementHomePage() {
  const params = useParams();
  const engagementId = params.id as string;
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isAddRAGStatusModalOpen, setIsAddRAGStatusModalOpen] = useState(false);

  const { data: engagement, isLoading: isLoadingEngagement } = useQuery({
    queryKey: ["engagement", engagementId],
    queryFn: () => fetchEngagement(engagementId),
  });

  const { data: ragStatuses, isLoading: isLoadingRagStatuses } = useQuery({
    queryKey: ["ragStatuses", engagementId],
    queryFn: () => fetchRagStatuses(engagementId),
  });

  const { data: successMetrics, isLoading: isLoadingSuccessMetrics } = useQuery(
    {
      queryKey: ["successMetrics", engagementId],
      queryFn: () => fetchSuccessMetrics(engagementId),
    }
  );

  const { data: objectives, isLoading: isLoadingObjectives } = useQuery({
    queryKey: ["objectives", engagementId],
    queryFn: () => fetchObjectives(engagementId),
  });

  // Handler for adding a new RAG status (mock implementation)
  const handleAddRAGStatus = async (data: any) => {
    console.log("Adding new RAG status:", data);
    // In a real app, this would submit to an API
    setIsAddRAGStatusModalOpen(false);
    // Refetch RAG statuses if needed
  };

  if (isLoadingEngagement) {
    return (
      <div className="p-6">
        <div className="text-light-gray">Loading engagement details...</div>
      </div>
    );
  }

  if (!engagement) {
    return (
      <div className="p-6">
        <div className="text-light-gray">Engagement not found</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Navigation and Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link
            href="/engagements"
            className="mb-4 flex items-center text-light-gray hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Engagements
          </Link>
          <h1 className="text-h1 font-bold text-white">{engagement.name}</h1>
          <div className="mt-1 text-light-gray">
            Client: {engagement.client.name}
          </div>
        </div>
        <StatusBadge status={engagement.status} />
      </div>

      {/* Tabs */}
      <div className="border-b border-dark-gray">
        <nav className="-mb-px flex space-x-8">
          {["overview", "team", "documents", "okrs", "milestones"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab
                    ? "border-teal text-teal"
                    : "border-transparent text-light-gray hover:text-white hover:border-dark-gray"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            )
          )}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-secondary-bg rounded-lg p-4">
                <div className="flex items-center text-light-gray mb-2">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  <span>Start Date</span>
                </div>
                <div className="text-h3 font-bold text-white">
                  {format(new Date(engagement.startDate), "MMM d, yyyy")}
                </div>
              </div>
              <div className="bg-secondary-bg rounded-lg p-4">
                <div className="flex items-center text-light-gray mb-2">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  <span>End Date</span>
                </div>
                <div className="text-h3 font-bold text-white">
                  {engagement.endDate
                    ? format(new Date(engagement.endDate), "MMM d, yyyy")
                    : "Ongoing"}
                </div>
              </div>
              <div className="bg-secondary-bg rounded-lg p-4">
                <div className="flex items-center text-light-gray mb-2">
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  <span>Team Size</span>
                </div>
                <div className="text-h3 font-bold text-white">
                  {engagement.teamMembers.length} members
                </div>
              </div>
              <div className="bg-secondary-bg rounded-lg p-4">
                <div className="flex items-center text-light-gray mb-2">
                  <DocumentIcon className="h-5 w-5 mr-2" />
                  <span>Documents</span>
                </div>
                <div className="text-h3 font-bold text-white">
                  {engagement.documents.length} files
                </div>
              </div>
            </div>

            {/* RAG Status */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-h2 font-bold">RAG Status</CardTitle>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsAddRAGStatusModalOpen(true)}
                  className="flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Status Report
                </Button>
              </CardHeader>
              <CardContent>
                {isLoadingRagStatuses ? (
                  <div className="text-light-gray">Loading statuses...</div>
                ) : !ragStatuses || ragStatuses.length === 0 ? (
                  <div className="text-center py-8 text-light-gray">
                    No statuses available yet. Add a status report to begin
                    tracking.
                  </div>
                ) : (
                  <StatusTracker statuses={ragStatuses} />
                )}
              </CardContent>
            </Card>

            {/* Success Metrics */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-h2 font-bold">
                  Success Metrics
                </CardTitle>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Metric
                </Button>
              </CardHeader>
              <CardContent>
                {isLoadingSuccessMetrics ? (
                  <div className="text-light-gray">Loading metrics...</div>
                ) : !successMetrics || successMetrics.length === 0 ? (
                  <div className="text-center py-8 text-light-gray">
                    No success metrics defined yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {successMetrics.map((metric) => (
                      <SuccessMetricsCard key={metric.id} metric={metric} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Objectives */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-h2 font-bold">OKRs</CardTitle>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Objective
                </Button>
              </CardHeader>
              <CardContent>
                {isLoadingObjectives ? (
                  <div className="text-light-gray">Loading objectives...</div>
                ) : !objectives || objectives.length === 0 ? (
                  <div className="text-center py-8 text-light-gray">
                    No objectives defined yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {objectives.map((objective) => (
                      <EnhancedObjectiveCard
                        key={objective.id}
                        objective={objective}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === "team" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-h2 font-bold text-white">Team Members</h2>
              <Button variant="secondary" className="flex items-center">
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Team Member
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {engagement.teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-secondary-bg rounded-lg p-4 flex items-start space-x-4"
                >
                  <div className="h-12 w-12 rounded-full bg-dark-gray flex items-center justify-center">
                    <span className="text-light-gray">
                      {member.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{member.name}</h3>
                    <p className="text-light-gray">{member.role}</p>
                    <a
                      href={`mailto:${member.email}`}
                      className="text-sm text-teal hover:underline"
                    >
                      {member.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* The rest of the tab content... */}
      </div>

      {/* RAG Status Modal */}
      <FormModal
        isOpen={isAddRAGStatusModalOpen}
        onClose={() => setIsAddRAGStatusModalOpen(false)}
        title="Add Status Report"
        size="xl"
      >
        <RAGStatusForm
          engagementId={engagementId}
          onSubmit={handleAddRAGStatus}
          onCancel={() => setIsAddRAGStatusModalOpen(false)}
        />
      </FormModal>
    </div>
  );
}
