"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeftIcon,
  CalendarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Badge,
  Button,
  StatusBadge,
  ProgressBar,
} from "@/components/ui";
import { RagStatus } from "@/types/rag";
import { SuccessMetric } from "@/types/metrics";

// Mock data interfaces
interface ClientContact {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

interface ClientEngagement {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string | null;
  status: "Active" | "Planned" | "Completed" | "On Hold";
  teamSize: number;
  ragStatus: {
    red: number;
    amber: number;
    green: number;
  };
  progress: number;
  lastActivity: {
    date: string;
    description: string;
  };
}

interface Client {
  id: string;
  name: string;
  description: string;
  logo?: string;
  industry: string;
  website: string;
  address: string;
  contacts: ClientContact[];
  engagements: ClientEngagement[];
  relationshipManager: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

// Mock client data
const mockClient: Client = {
  id: "client-001",
  name: "RetailX Corporation",
  description:
    "A leading retail company focusing on online and brick-and-mortar sales with over 100 locations nationwide.",
  industry: "Retail",
  website: "https://retailx.example.com",
  address: "123 Commerce St, New York, NY 10001",
  contacts: [
    {
      id: "contact-001",
      name: "Jane Smith",
      position: "CTO",
      email: "jane.smith@retailx.example.com",
      phone: "212-555-1234",
      isPrimary: true,
    },
    {
      id: "contact-002",
      name: "Robert Johnson",
      position: "Head of Digital",
      email: "robert.johnson@retailx.example.com",
      phone: "212-555-5678",
      isPrimary: false,
    },
    {
      id: "contact-003",
      name: "Sarah Williams",
      position: "Project Manager",
      email: "sarah.williams@retailx.example.com",
      phone: "212-555-9012",
      isPrimary: false,
    },
  ],
  engagements: [
    {
      id: "eng-001",
      name: "E-commerce Platform Redesign",
      description:
        "Complete redesign of the client's e-commerce platform with focus on UX and performance improvements.",
      startDate: "2023-06-15",
      endDate: "2023-12-15",
      status: "Active",
      teamSize: 5,
      ragStatus: {
        red: 1,
        amber: 1,
        green: 1,
      },
      progress: 45,
      lastActivity: {
        date: "2023-08-02",
        description:
          "Weekly status meeting - discussed payment integration challenges",
      },
    },
    {
      id: "eng-002",
      name: "Mobile App Development",
      description:
        "Development of a native mobile app for iOS and Android to complement the web platform.",
      startDate: "2023-09-01",
      endDate: null,
      status: "Planned",
      teamSize: 4,
      ragStatus: {
        red: 0,
        amber: 0,
        green: 0,
      },
      progress: 0,
      lastActivity: {
        date: "2023-07-25",
        description: "Kick-off planning meeting - defined initial requirements",
      },
    },
    {
      id: "eng-003",
      name: "In-store Digital Kiosk Implementation",
      description:
        "Installation and configuration of digital kiosks in all retail locations.",
      startDate: "2023-01-10",
      endDate: "2023-06-30",
      status: "Completed",
      teamSize: 3,
      ragStatus: {
        red: 0,
        amber: 0,
        green: 3,
      },
      progress: 100,
      lastActivity: {
        date: "2023-06-30",
        description: "Project closure meeting - all deliverables accepted",
      },
    },
  ],
  relationshipManager: {
    id: "rm-001",
    name: "Michael Brown",
    email: "michael.brown@clearroute.com",
    phone: "212-555-4321",
  },
};

// Mock fetch function
const fetchClient = async (id: string): Promise<Client> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockClient), 500);
  });
};

export default function ClientHomePage() {
  const { id } = useParams<{ id: string }>();

  const [activeTab, setActiveTab] = useState<string>("engagements");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: client, isLoading } = useQuery({
    queryKey: ["client", id],
    queryFn: () => fetchClient(id as string),
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <Link
          href="/clients"
          className="flex items-center text-teal hover:underline mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Clients
        </Link>
        <div>Loading client details...</div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-6">
        <Link
          href="/clients"
          className="flex items-center text-teal hover:underline mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Clients
        </Link>
        <div>Client not found</div>
      </div>
    );
  }

  // Filter engagements by status if needed
  const filteredEngagements = client.engagements.filter(
    (engagement) =>
      statusFilter === "all" ||
      engagement.status.toLowerCase() === statusFilter.toLowerCase()
  );

  // Get counts by status
  const getStatusCounts = () => {
    const counts = {
      Active: 0,
      Planned: 0,
      Completed: 0,
      "On Hold": 0,
    };

    client.engagements.forEach((engagement) => {
      counts[engagement.status] = (counts[engagement.status] || 0) + 1;
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  // Get RAG status summary
  const getRAGSummary = () => {
    let redCount = 0;
    let amberCount = 0;
    let greenCount = 0;

    client.engagements.forEach((engagement) => {
      redCount += engagement.ragStatus.red;
      amberCount += engagement.ragStatus.amber;
      greenCount += engagement.ragStatus.green;
    });

    return {
      red: redCount,
      amber: amberCount,
      green: greenCount,
    };
  };

  const ragSummary = getRAGSummary();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/clients"
            className="flex items-center text-teal hover:underline mb-2"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Clients
          </Link>
          <h1 className="text-h1 text-white">{client.name}</h1>
          <Badge variant="outline" className="mt-2">
            {client.industry}
          </Badge>
        </div>

        <div className="flex space-x-3">
          <Button variant="secondary" size="sm">
            Edit Client
          </Button>
          <Button variant="primary" size="sm">
            New Engagement
          </Button>
        </div>
      </div>

      {/* Client overview card */}
      <Card className="bg-dark">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2">
              <div className="text-light-gray mb-1">Description</div>
              <p className="text-white mb-4">{client.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="text-light-gray mb-1">Website</div>
                  <a
                    href={client.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal hover:underline"
                  >
                    {client.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
                <div>
                  <div className="text-light-gray mb-1">Address</div>
                  <p className="text-white">{client.address}</p>
                </div>
              </div>
            </div>

            <div>
              <div className="text-light-gray mb-1">Relationship Manager</div>
              <div className="bg-dark-gray p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-teal/20 flex items-center justify-center text-teal text-lg font-bold mr-3">
                    {client.relationshipManager.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="text-white font-medium">
                      {client.relationshipManager.name}
                    </div>
                    <a
                      href={`mailto:${client.relationshipManager.email}`}
                      className="text-teal text-sm hover:underline block"
                    >
                      {client.relationshipManager.email}
                    </a>
                    <a
                      href={`tel:${client.relationshipManager.phone}`}
                      className="text-white text-sm"
                    >
                      {client.relationshipManager.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs navigation */}
      <div className="flex border-b border-dark-gray">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "engagements"
              ? "text-teal border-b-2 border-teal"
              : "text-light-gray hover:text-white"
          }`}
          onClick={() => setActiveTab("engagements")}
        >
          Engagements
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "contacts"
              ? "text-teal border-b-2 border-teal"
              : "text-light-gray hover:text-white"
          }`}
          onClick={() => setActiveTab("contacts")}
        >
          Contacts
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "documents"
              ? "text-teal border-b-2 border-teal"
              : "text-light-gray hover:text-white"
          }`}
          onClick={() => setActiveTab("documents")}
        >
          Documents
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "notes"
              ? "text-teal border-b-2 border-teal"
              : "text-light-gray hover:text-white"
          }`}
          onClick={() => setActiveTab("notes")}
        >
          Notes
        </button>
      </div>

      {/* Engagements tab */}
      {activeTab === "engagements" && (
        <div className="space-y-6">
          {/* Status overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-light-gray text-sm mb-1">Active</div>
                <div className="text-white text-2xl font-bold">
                  {statusCounts.Active}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-light-gray text-sm mb-1">Planned</div>
                <div className="text-white text-2xl font-bold">
                  {statusCounts.Planned}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-light-gray text-sm mb-1">Completed</div>
                <div className="text-white text-2xl font-bold">
                  {statusCounts.Completed}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-light-gray text-sm mb-1">On Hold</div>
                <div className="text-white text-2xl font-bold">
                  {statusCounts["On Hold"]}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RAG status summary */}
          <Card>
            <CardHeader>
              <CardTitle>Status Indicators Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-danger mr-2" />
                  <span className="text-white">{ragSummary.red} Red</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-warning mr-2" />
                  <span className="text-white">{ragSummary.amber} Amber</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-success mr-2" />
                  <span className="text-white">{ragSummary.green} Green</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status filter */}
          <div className="flex space-x-2">
            <Button
              variant={statusFilter === "all" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "active" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setStatusFilter("active")}
            >
              Active
            </Button>
            <Button
              variant={statusFilter === "planned" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setStatusFilter("planned")}
            >
              Planned
            </Button>
            <Button
              variant={statusFilter === "completed" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setStatusFilter("completed")}
            >
              Completed
            </Button>
            <Button
              variant={statusFilter === "on hold" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setStatusFilter("on hold")}
            >
              On Hold
            </Button>
          </div>

          {/* Engagements list */}
          <div className="space-y-4">
            {filteredEngagements.length === 0 ? (
              <div className="text-center text-light-gray p-8">
                No engagements found matching the selected filter.
              </div>
            ) : (
              filteredEngagements.map((engagement) => (
                <Card key={engagement.id}>
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Left side with status */}
                      <div className="p-4 border-b md:border-b-0 md:border-r border-dark-gray md:w-56 flex-shrink-0">
                        <StatusBadge
                          status={engagement.status as any}
                          className="mb-3"
                        />
                        <div className="text-light-gray text-sm mb-1">
                          Timeline
                        </div>
                        <div className="text-white text-sm">
                          {format(
                            new Date(engagement.startDate),
                            "MMM d, yyyy"
                          )}{" "}
                          -
                          {engagement.endDate
                            ? format(
                                new Date(engagement.endDate),
                                " MMM d, yyyy"
                              )
                            : " Ongoing"}
                        </div>
                        <div className="text-light-gray text-sm mt-3 mb-1">
                          Team Size
                        </div>
                        <div className="text-white text-sm">
                          {engagement.teamSize} members
                        </div>
                      </div>

                      {/* Main content */}
                      <div className="p-4 flex-grow">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-1">
                              {engagement.name}
                            </h3>
                            <p className="text-light-gray text-sm mb-3">
                              {engagement.description}
                            </p>
                          </div>

                          <Link href={`/engagements/${engagement.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center"
                            >
                              <span className="mr-1">View Details</span>
                              <ArrowRightIcon className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>

                        {/* Progress bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-light-gray">Progress</span>
                            <span className="text-white font-medium">
                              {engagement.progress}%
                            </span>
                          </div>
                          <ProgressBar
                            value={engagement.progress}
                            max={100}
                            showLabel={false}
                            color={
                              engagement.status === "Completed"
                                ? "success"
                                : engagement.progress > 66
                                ? "success"
                                : engagement.progress > 33
                                ? "warning"
                                : "danger"
                            }
                          />
                        </div>

                        {/* RAG status indicators */}
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-danger mr-2" />
                            <span className="text-white text-sm">
                              {engagement.ragStatus.red}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-warning mr-2" />
                            <span className="text-white text-sm">
                              {engagement.ragStatus.amber}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-success mr-2" />
                            <span className="text-white text-sm">
                              {engagement.ragStatus.green}
                            </span>
                          </div>
                        </div>

                        {/* Last activity */}
                        <div className="bg-dark-gray p-2 rounded">
                          <div className="text-light-gray text-xs">
                            Last activity:{" "}
                            {format(
                              new Date(engagement.lastActivity.date),
                              "dd MMM yyyy"
                            )}
                          </div>
                          <div className="text-white text-sm">
                            {engagement.lastActivity.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Contacts tab */}
      {activeTab === "contacts" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-h2 text-white">Client Contacts</h2>
            <Button variant="primary" size="sm">
              Add Contact
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {client.contacts.map((contact) => (
              <Card key={contact.id}>
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-teal/20 flex items-center justify-center text-teal text-lg font-bold mr-4 flex-shrink-0">
                      {contact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-white font-medium">
                          {contact.name}
                        </h3>
                        {contact.isPrimary && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Primary Contact
                          </Badge>
                        )}
                      </div>
                      <p className="text-light-gray text-sm">
                        {contact.position}
                      </p>

                      <div className="mt-3 space-y-1">
                        <div className="flex items-center">
                          <EnvelopeIcon className="h-4 w-4 text-light-gray mr-2" />
                          <a
                            href={`mailto:${contact.email}`}
                            className="text-teal text-sm hover:underline"
                          >
                            {contact.email}
                          </a>
                        </div>
                        <div className="flex items-center">
                          <PhoneIcon className="h-4 w-4 text-light-gray mr-2" />
                          <a
                            href={`tel:${contact.phone}`}
                            className="text-white text-sm"
                          >
                            {contact.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Documents tab */}
      {activeTab === "documents" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-h2 text-white">Client Documents</h2>
            <Button variant="primary" size="sm">
              Upload Document
            </Button>
          </div>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-light-gray">
                No documents have been uploaded yet.
              </div>
              <Button variant="secondary" size="sm" className="mt-4">
                Upload First Document
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notes tab */}
      {activeTab === "notes" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-h2 text-white">Client Notes</h2>
            <Button variant="primary" size="sm">
              Add Note
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <textarea
                className="w-full h-32 bg-dark-gray rounded-md border border-dark-gray p-3 text-white resize-none focus:outline-none focus:ring-1 focus:ring-teal"
                placeholder="Add a note about this client..."
              />
              <div className="flex justify-end mt-3">
                <Button variant="primary" size="sm">
                  Save Note
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-light-gray">
                No notes have been added yet.
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
