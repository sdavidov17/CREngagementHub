import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import {
  HomeIcon,
  BriefcaseIcon,
  UsersIcon,
  TagIcon,
  CalendarIcon,
  ChartBarSquareIcon,
  Cog6ToothIcon,
  BellIcon,
  UserCircleIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ClearRoute Engagement Hub",
  description: "Engagement management platform for ClearRoute",
};

const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Engagements", href: "/engagements", icon: BriefcaseIcon },
  { name: "Clients", href: "/clients", icon: BuildingOfficeIcon },
  { name: "Team", href: "/team", icon: UsersIcon },
  { name: "OKRs", href: "/okrs", icon: TagIcon },
  { name: "Governance", href: "/governance", icon: CalendarIcon },
  { name: "Success Metrics", href: "/metrics", icon: ChartBarSquareIcon },
  { name: "Status Tracker", href: "/status", icon: ExclamationTriangleIcon },
  { name: "Notice Board", href: "/notices", icon: DocumentTextIcon },
  { name: "Reports", href: "/reports", icon: ArchiveBoxIcon },
  { name: "Settings", href: "/settings", icon: Cog6ToothIcon },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header
              className="flex justify-between items-center py-4 px-6 border-b border-dark-gray"
              style={{
                backgroundColor: "#1A1E23", // Exact header background color from specs
              }}
            >
              <div className="flex items-center">
                <div className="text-teal font-bold text-xl mr-8">
                  ClearRoute
                </div>
                <h1 className="text-white font-bold text-xl">Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-white hover:text-teal">
                  <BellIcon className="h-6 w-6" />
                </button>
                <button className="text-white hover:text-teal">
                  <UserCircleIcon className="h-6 w-6" />
                </button>
              </div>
            </header>

            <div className="flex flex-1">
              {/* Sidebar Navigation */}
              <aside
                className="w-48 border-r border-dark-gray"
                style={{
                  backgroundColor: "#2D3239", // Exact sidebar background color from specs
                }}
              >
                <nav className="flex flex-col py-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center px-4 py-2 text-sm text-white hover:bg-dark/40 hover:text-teal group"
                    >
                      <item.icon className="h-5 w-5 mr-3 text-light-gray group-hover:text-teal" />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </aside>

              {/* Main Content */}
              <main
                className="flex-1 p-6 overflow-auto"
                style={{ backgroundColor: "#1A1E23" }}
              >
                {children}
              </main>
            </div>

            {/* Footer */}
            <footer
              className="py-4 px-6 border-t border-dark-gray flex justify-between items-center"
              style={{ backgroundColor: "#1A1E23" }}
            >
              <div className="text-teal font-bold">ClearRoute</div>
              <div className="text-light-gray text-sm">© 2025 ClearRoute</div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
