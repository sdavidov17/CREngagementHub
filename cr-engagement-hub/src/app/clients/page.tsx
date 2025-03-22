"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface Client {
  id: string;
  name: string;
  description: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  engagementCount: number;
  activeEngagements: number;
}

// Mock data for testing
const mockClients: Client[] = [
  {
    id: "1",
    name: "Acme Corporation",
    description: "Global technology company",
    industry: "Technology",
    contactName: "John Smith",
    contactEmail: "john@acmecorp.com",
    contactPhone: "555-123-4567",
    engagementCount: 2,
    activeEngagements: 1,
  },
  {
    id: "2",
    name: "TechCorp Inc",
    description: "Software development and consulting",
    industry: "IT Services",
    contactName: "Jane Doe",
    contactEmail: "jane@techcorp.com",
    contactPhone: "555-987-6543",
    engagementCount: 1,
    activeEngagements: 1,
  },
  {
    id: "3",
    name: "Global Finance",
    description: "Financial services provider",
    industry: "Finance",
    contactName: "Robert Johnson",
    contactEmail: "robert@globalfinance.com",
    contactPhone: "555-456-7890",
    engagementCount: 3,
    activeEngagements: 2,
  },
  {
    id: "4",
    name: "Retail Partners",
    description: "Leading retail chain",
    industry: "Retail",
    contactName: "Michael Brown",
    contactEmail: "michael@retailpartners.com",
    contactPhone: "555-222-3333",
    engagementCount: 1,
    activeEngagements: 0,
  },
];

// Simulate fetching clients
const fetchClients = async (): Promise<Client[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockClients), 500);
  });
};

export default function ClientPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState<string>("");

  const { data: clients, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: fetchClients,
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="mb-6 text-3xl font-bold">Clients</h1>
        <div>Loading clients...</div>
      </div>
    );
  }

  const industries = Array.from(
    new Set(clients?.map((client) => client.industry) || [])
  ).sort();

  const filteredClients = clients?.filter((client) => {
    const matchesSearch =
      searchQuery === "" ||
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.industry.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesIndustry =
      industryFilter === "" || client.industry === industryFilter;

    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Link
          href="/clients/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add Client
        </Link>
      </div>

      <div className="mb-6 flex space-x-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search clients..."
            className="w-full rounded-md border border-gray-300 px-4 py-2 pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </div>

        <div>
          <label htmlFor="industry-filter" className="sr-only">
            Industry
          </label>
          <select
            id="industry-filter"
            className="rounded-md border border-gray-300 px-4 py-2"
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            aria-label="Industry"
          >
            <option value="">All Industries</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredClients?.map((client) => (
          <div
            key={client.id}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {client.name}
              </h2>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                {client.industry}
              </span>
            </div>
            <p className="mb-4 text-sm text-gray-600">{client.description}</p>

            <div className="mb-4 space-y-2 border-t border-gray-200 pt-4">
              <div className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="text-sm text-gray-600">
                  {client.contactName}
                </span>
              </div>
              <div className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href={`mailto:${client.contactEmail}`}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {client.contactEmail}
                </a>
              </div>
              <div className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="text-sm text-gray-600">
                  {client.contactPhone}
                </span>
              </div>
            </div>

            <div className="mb-4 flex space-x-4 border-t border-gray-200 pt-4">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500">Engagements</p>
                <p className="text-lg font-semibold text-gray-900">
                  {client.engagementCount}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500">Active</p>
                <p className="text-lg font-semibold text-gray-900">
                  {client.activeEngagements}
                </p>
              </div>
            </div>

            <div className="flex space-x-2">
              <Link
                href={`/clients/${client.id}`}
                className="flex-1 rounded-md border border-transparent bg-blue-100 px-4 py-2 text-center text-sm font-medium text-blue-900 hover:bg-blue-200"
              >
                View Details
              </Link>
              <Link
                href={`/clients/${client.id}/edit`}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredClients?.length === 0 && (
        <div className="mt-6 rounded-md bg-gray-50 p-6 text-center">
          <p className="text-gray-500">No clients found</p>
        </div>
      )}
    </div>
  );
}
