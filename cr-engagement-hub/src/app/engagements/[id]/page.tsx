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
  const { id } = useParams<{ id: string }>();

  const [activeSection, setActiveSection] = useState<string>("overview");

  const { data: engagement, isLoading: isLoadingEngagement } = useQuery({
    queryKey: ["engagement", id],
    queryFn: () => fetchEngagement(id as string),
  });

  const { data: ragStatuses, isLoading: isLoadingRagStatuses } = useQuery({
    queryKey: ["ragStatuses", id],
    queryFn: () => fetchRagStatuses(id as string),
  });

  const { data: successMetrics, isLoading: isLoadingSuccessMetrics } = useQuery(
    {
      queryKey: ["successMetrics", id],
      queryFn: () => fetchSuccessMetrics(id as string),
    }
  );

  const { data: objectives, isLoading: isLoadingObjectives } = useQuery({
    queryKey: ["objectives", id],
    queryFn: () => fetchObjectives(id as string),
  });

  const isLoading =
    isLoadingEngagement ||
    isLoadingRagStatuses ||
    isLoadingSuccessMetrics ||
    isLoadingObjectives;

  if (isLoading) {
    return (
      <div className="p-6">
        <Link
          href="/engagements"
          className="flex items-center text-teal hover:underline mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Engagements
        </Link>
        <div>Loading engagement details...</div>
      </div>
    );
  }

  if (!engagement) {
    return (
      <div className="p-6">
        <Link
          href="/engagements"
          className="flex items-center text-teal hover:underline mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Engagements
        </Link>
        <div>Engagement not found</div>
      </div>
    );
  }

  // Calculate overall progress based on milestones
  const completedMilestones = engagement.milestones.filter(
    (milestone) => milestone.status === "completed"
  ).length;
  const overallProgress = Math.round(
    (completedMilestones / engagement.milestones.length) * 100
  );

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "on-track";
      case "on hold":
        return "at-risk";
      case "completed":
        return "default";
      case "planned":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/engagements"
            className="flex items-center text-teal hover:underline mb-2"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Engagements
          </Link>
          <h1 className="text-h1 text-white">{engagement.name}</h1>
          <div className="flex items-center mt-2">
            <Badge variant="outline" className="mr-2">
              Client: {engagement.client.name}
            </Badge>
            <StatusBadge status={engagement.status as any} />
          </div>
        </div>

        <div className="text-right">
          <div className="text-light-gray mb-1">Overall Progress</div>
          <div className="flex items-center">
            <ProgressBar
              value={overallProgress}
              max={100}
              className="w-48 mr-2"
            />
            <span className="text-white font-bold">{overallProgress}%</span>
          </div>
          <div className="text-xs text-light-gray mt-1">
            {completedMilestones} of {engagement.milestones.length} milestones
            completed
          </div>
        </div>
      </div>

      <Card className="bg-dark">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="text-light-gray mb-1 flex items-center">
                <CalendarIcon className="w-4 h-4 mr-1" />
                Timeline
              </div>
              <div className="text-white">
                {format(new Date(engagement.startDate), "MMM d, yyyy")} -
                {engagement.endDate
                  ? format(new Date(engagement.endDate), " MMM d, yyyy")
                  : " Ongoing"}
              </div>
            </div>

            <div>
              <div className="text-light-gray mb-1 flex items-center">
                <UserGroupIcon className="w-4 h-4 mr-1" />
                Team Size
              </div>
              <div className="text-white">
                {engagement.teamMembers.length} members
              </div>
            </div>

            <div>
              <div className="text-light-gray mb-1 flex items-center">
                <DocumentIcon className="w-4 h-4 mr-1" />
                Documents
              </div>
              <div className="text-white">
                {engagement.documents.length} files
              </div>
            </div>

            <div>
              <div className="text-light-gray mb-1 flex items-center">
                <CalendarIcon className="w-4 h-4 mr-1" />
                Next Meeting
              </div>
              <div className="text-white">
                {engagement.meetings.length > 0
                  ? format(
                      new Date(engagement.meetings[0].nextDate),
                      "MMM d, yyyy"
                    )
                  : "None scheduled"}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-light-gray mb-1">Description</div>
            <p className="text-white">{engagement.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs navigation */}
      <div className="flex border-b border-dark-gray">
        <button
          className={`px-4 py-2 font-medium ${
            activeSection === "overview"
              ? "text-teal border-b-2 border-teal"
              : "text-light-gray hover:text-white"
          }`}
          onClick={() => setActiveSection("overview")}
        >
          Overview
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeSection === "team"
              ? "text-teal border-b-2 border-teal"
              : "text-light-gray hover:text-white"
          }`}
          onClick={() => setActiveSection("team")}
        >
          Team
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeSection === "metrics"
              ? "text-teal border-b-2 border-teal"
              : "text-light-gray hover:text-white"
          }`}
          onClick={() => setActiveSection("metrics")}
        >
          Metrics
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeSection === "objectives"
              ? "text-teal border-b-2 border-teal"
              : "text-light-gray hover:text-white"
          }`}
          onClick={() => setActiveSection("objectives")}
        >
          Objectives
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeSection === "documents"
              ? "text-teal border-b-2 border-teal"
              : "text-light-gray hover:text-white"
          }`}
          onClick={() => setActiveSection("documents")}
        >
          Documents
        </button>
      </div>

      {/* Overview section */}
      {activeSection === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* RAG Statuses */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Status Updates</CardTitle>
              </CardHeader>
              <CardContent>
                {ragStatuses && ragStatuses.length > 0 ? (
                  <div className="space-y-4">
                    {ragStatuses.map((status) => (
                      <div key={status.id} className="flex items-start">
                        <div
                          className={`rounded-full w-3 h-3 mt-1.5 mr-2 flex-shrink-0 ${
                            status.currentStatus === "red"
                              ? "bg-danger"
                              : status.currentStatus === "amber"
                              ? "bg-warning"
                              : "bg-success"
                          }`}
                        />
                        <div>
                          <h4 className="text-white font-medium">
                            {status.title}
                          </h4>
                          <p className="text-light-gray text-sm">
                            {status.description}
                          </p>
                          {status.comments.length > 0 && (
                            <p className="text-sm text-light-gray mt-1">
                              {status.comments[status.comments.length - 1].text}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-light-gray">No status updates available</p>
                )}
              </CardContent>
            </Card>

            {/* Milestones */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {engagement.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center">
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                          milestone.status === "completed"
                            ? "bg-success/20 text-success"
                            : milestone.status === "in_progress"
                            ? "bg-warning/20 text-warning"
                            : "bg-light-gray/20 text-light-gray"
                        }`}
                      >
                        {milestone.status === "completed" ? (
                          <CheckCircleIcon className="w-4 h-4" />
                        ) : (
                          <ClockIcon className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <span className="text-white">{milestone.title}</span>
                          <span className="text-light-gray text-sm">
                            {format(new Date(milestone.dueDate), "MMM d, yyyy")}
                          </span>
                        </div>
                        <div className="text-sm text-light-gray capitalize">
                          {milestone.status.replace("_", " ")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Meetings & Metrics summary */}
          <div>
            {/* Upcoming Meetings */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Meetings</CardTitle>
              </CardHeader>
              <CardContent>
                {engagement.meetings.length > 0 ? (
                  <div className="space-y-4">
                    {engagement.meetings.map((meeting) => (
                      <div key={meeting.id} className="flex items-start">
                        <CalendarIcon className="w-5 h-5 text-light-gray mr-3 mt-0.5" />
                        <div>
                          <h4 className="text-white font-medium">
                            {meeting.title}
                          </h4>
                          <p className="text-sm text-light-gray">
                            {format(new Date(meeting.nextDate), "EEEE, MMMM d")}{" "}
                            • {meeting.frequency}
                          </p>
                          <p className="text-sm text-light-gray">
                            {meeting.participants.join(", ")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-light-gray">No meetings scheduled</p>
                )}
              </CardContent>
            </Card>

            {/* Key Metrics Summary */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                {successMetrics && successMetrics.length > 0 ? (
                  <div className="space-y-6">
                    {successMetrics.map((metric) => (
                      <div key={metric.id}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="text-white font-medium">
                            {metric.name}
                          </h4>
                          <Badge
                            variant={
                              metric.status === "on_track"
                                ? "on-track"
                                : metric.status === "at_risk"
                                ? "at-risk"
                                : "critical"
                            }
                          >
                            {metric.status
                              .replace("_", " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </Badge>
                        </div>
                        <p className="text-sm text-light-gray mb-2">
                          {metric.description}
                        </p>
                        <ProgressBar
                          value={metric.current}
                          max={metric.target}
                          color={
                            metric.status === "on_track"
                              ? "success"
                              : metric.status === "at_risk"
                              ? "warning"
                              : "danger"
                          }
                        />
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-light-gray">
                            Current: {metric.current}
                            {metric.format === "percentage" ? "%" : ""}
                          </span>
                          <span className="text-light-gray">
                            Target: {metric.target}
                            {metric.format === "percentage" ? "%" : ""}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-light-gray">No metrics available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Team section */}
      {activeSection === "team" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-h2 text-white">Team Members</h2>
            <Button variant="primary" size="sm">
              Add Team Member
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {engagement.teamMembers.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-teal/20 flex items-center justify-center text-teal text-lg font-bold mr-4">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{member.name}</h3>
                      <p className="text-light-gray text-sm">{member.role}</p>
                      <a
                        href={`mailto:${member.email}`}
                        className="text-teal text-sm hover:underline"
                      >
                        {member.email}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Metrics section */}
      {activeSection === "metrics" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-h2 text-white">Success Metrics</h2>
            <Button variant="primary" size="sm">
              Add Metric
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {successMetrics &&
              successMetrics.map((metric) => (
                <SuccessMetricsCard key={metric.id} metric={metric} />
              ))}
          </div>
        </div>
      )}

      {/* Objectives section */}
      {activeSection === "objectives" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-h2 text-white">Objectives & Key Results</h2>
            <Button variant="primary" size="sm">
              Add Objective
            </Button>
          </div>

          <div className="space-y-6">
            {objectives &&
              objectives.map((objective) => (
                <EnhancedObjectiveCard
                  key={objective.id}
                  objective={objective}
                  onUpdateKeyResult={(objectiveId, keyResultId, progress) => {
                    console.log(
                      "Updating key result",
                      objectiveId,
                      keyResultId,
                      progress
                    );
                  }}
                  onAddComment={(objectiveId, keyResultId, comment) => {
                    console.log(
                      "Adding comment",
                      objectiveId,
                      keyResultId,
                      comment
                    );
                  }}
                />
              ))}
          </div>
        </div>
      )}

      {/* Documents section */}
      {activeSection === "documents" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-h2 text-white">Documents</h2>
            <Button variant="primary" size="sm">
              Upload Document
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-gray">
                    <th className="text-left p-4 text-light-gray font-medium">
                      Name
                    </th>
                    <th className="text-left p-4 text-light-gray font-medium">
                      Type
                    </th>
                    <th className="text-left p-4 text-light-gray font-medium">
                      Created By
                    </th>
                    <th className="text-left p-4 text-light-gray font-medium">
                      Date
                    </th>
                    <th className="text-right p-4 text-light-gray font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {engagement.documents.map((document) => (
                    <tr key={document.id} className="border-b border-dark-gray">
                      <td className="p-4 text-white">
                        <div className="flex items-center">
                          <DocumentIcon className="w-5 h-5 text-light-gray mr-2" />
                          {document.name}
                        </div>
                      </td>
                      <td className="p-4 text-light-gray">{document.type}</td>
                      <td className="p-4 text-light-gray">
                        {document.createdBy}
                      </td>
                      <td className="p-4 text-light-gray">
                        {format(new Date(document.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="xs">
                          View
                        </Button>
                        <Button variant="ghost" size="xs">
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
