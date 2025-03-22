"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  title: string;
  startDate: string;
  endDate?: string | null;
  skills: string[];
  engagements: {
    id: string;
    name: string;
    role: string;
    allocation: number;
  }[];
}

// Mock data for team member - in a real app this would come from an API
const mockTeamMember: Record<string, TeamMember> = {
  "1": {
    id: "1",
    name: "John Developer",
    email: "john@example.com",
    title: "Senior Developer",
    startDate: "2022-01-15",
    skills: ["React", "Node.js"],
    engagements: [
      {
        id: "1",
        name: "Digital Transformation",
        role: "Technical Lead",
        allocation: 80,
      },
    ],
  },
  "2": {
    id: "2",
    name: "Jane Designer",
    email: "jane@example.com",
    title: "UX Designer",
    startDate: "2022-02-10",
    skills: ["UX Design"],
    engagements: [
      {
        id: "1",
        name: "Digital Transformation",
        role: "UX Lead",
        allocation: 60,
      },
    ],
  },
};

// Simulate API call
const fetchTeamMember = async (id: string): Promise<TeamMember | null> => {
  // In a real application, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockTeamMember[id] || null), 500);
  });
};

export default function TeamMemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: teamMember, isLoading } = useQuery({
    queryKey: ["teamMember", id],
    queryFn: () => fetchTeamMember(id),
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="mb-6 text-3xl font-bold">Team Member Details</h1>
        <div>Loading team member data...</div>
      </div>
    );
  }

  if (!teamMember) {
    return (
      <div className="p-6">
        <h1 className="mb-6 text-3xl font-bold">Team Member Details</h1>
        <div className="rounded-md bg-red-50 p-4">
          <h3 className="text-sm font-medium text-red-800">
            Team member not found
          </h3>
          <div className="mt-2 text-sm text-red-700">
            The team member you are looking for does not exist or has been
            removed.
          </div>
          <div className="mt-4">
            <Link
              href="/team"
              className="rounded bg-red-100 px-2 py-1.5 text-xs font-medium text-red-800"
            >
              Return to Team List
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{teamMember.name}</h1>
        <div className="flex space-x-3">
          <Link
            href={`/team/${teamMember.id}/edit`}
            className="rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Edit
          </Link>
          <Link
            href="/team"
            className="rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to Team
          </Link>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Personal Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-sm font-medium">{teamMember.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Job Title</p>
              <p className="text-sm font-medium">{teamMember.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Start Date</p>
              <p className="text-sm font-medium">
                {new Date(teamMember.startDate).toLocaleDateString()}
              </p>
            </div>
            {teamMember.endDate && (
              <div>
                <p className="text-sm text-gray-500">End Date</p>
                <p className="text-sm font-medium">
                  {new Date(teamMember.endDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {teamMember.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Status</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Current Allocation</p>
              <div className="mt-1 flex items-center">
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-blue-600"
                    style={{
                      width: `${teamMember.engagements.reduce(
                        (total, engagement) => total + engagement.allocation,
                        0
                      )}%`,
                    }}
                  ></div>
                </div>
                <span className="ml-2 text-sm font-medium">
                  {teamMember.engagements.reduce(
                    (total, engagement) => total + engagement.allocation,
                    0
                  )}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium">Current Engagements</h2>
        {teamMember.engagements.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Engagement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Allocation
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {teamMember.engagements.map((engagement) => (
                  <tr key={engagement.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {engagement.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {engagement.role}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {engagement.allocation}%
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <Link
                        href={`/engagements/${engagement.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View Engagement
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No current engagements</p>
        )}
      </div>
    </div>
  );
}
