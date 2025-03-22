"use client";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center bg-navy">
        <div className="text-center">
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
