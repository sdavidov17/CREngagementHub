"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">
          Welcome, {session.user.name}
        </h2>
        <p className="text-gray-600">Role: {session.user.role}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Team Management"
          description="Manage team members and allocations"
          linkHref="/team"
          linkText="View Teams"
        />
        <DashboardCard
          title="Engagements"
          description="Track ongoing client engagements"
          linkHref="/engagements"
          linkText="View Engagements"
        />
        <DashboardCard
          title="OKRs"
          description="Monitor objectives and key results"
          linkHref="/okrs"
          linkText="View OKRs"
        />
        <DashboardCard
          title="Meetings"
          description="Schedule and manage meetings"
          linkHref="/meetings"
          linkText="View Meetings"
        />
        <DashboardCard
          title="Clients"
          description="Manage client relationships"
          linkHref="/clients"
          linkText="View Clients"
        />
        <DashboardCard
          title="Reports"
          description="Generate engagement reports"
          linkHref="/reports"
          linkText="View Reports"
        />
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  linkHref,
  linkText,
}: {
  title: string;
  description: string;
  linkHref: string;
  linkText: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-2 text-lg font-medium">{title}</h3>
      <p className="mb-4 text-sm text-gray-600">{description}</p>
      <Link
        href={linkHref}
        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
      >
        {linkText}
        <svg
          className="ml-1 h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Link>
    </div>
  );
}
