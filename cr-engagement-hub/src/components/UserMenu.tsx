"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { UserCircleIcon } from "@heroicons/react/24/outline";

export default function UserMenu() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!session || !session.user) {
    return (
      <button className="text-white hover:text-teal">
        <UserCircleIcon className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center focus:outline-none"
      >
        <div className="h-8 w-8 rounded-full bg-teal/20 flex items-center justify-center text-teal text-sm font-bold">
          {session.user.name?.charAt(0) || "U"}
        </div>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md bg-dark-gray shadow-lg z-10">
          <div className="p-3 border-b border-dark">
            <p className="text-sm font-medium text-white">
              {session.user.name}
            </p>
            <p className="text-xs text-light-gray">{session.user.email}</p>
          </div>
          <div className="p-2">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full text-left px-3 py-2 text-sm text-white hover:bg-dark/40 hover:text-teal rounded-md"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
