"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

// Define types for our report data
interface UtilizationMonth {
  month: string;
  utilization: number;
}

interface SkillCount {
  name: string;
  count: number;
}

interface SkillExperience {
  name: string;
  novice: number;
  intermediate: number;
  expert: number;
}

interface StatusCount {
  status: string;
  count: number;
}

interface SectorCount {
  sector: string;
  count: number;
}

interface QuarterProgress {
  quarter: string;
  objectives: number;
  completed: number;
}

interface ReportData {
  teamUtilization: {
    totalTeamMembers: number;
    activeTeamMembers: number;
    averageUtilization: number;
    utilizationByMonth: UtilizationMonth[];
  };
  teamSkills: {
    topSkills: SkillCount[];
    skillsByExperience: SkillExperience[];
  };
  engagementStatus: {
    total: number;
    byStatus: StatusCount[];
    bySector: SectorCount[];
  };
  okrProgress: {
    byQuarter: QuarterProgress[];
    byStatus: StatusCount[];
  };
}

// Colors for the charts
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#8DD1E1",
];

// Status colors for engagement status
const STATUS_COLORS = {
  Active: "#4caf50",
  Planned: "#9c27b0",
  Completed: "#2196f3",
  "On Hold": "#ff9800",
  "On Track": "#4caf50",
  "At Risk": "#ff9800",
  Behind: "#f44336",
};

// Mock data for our report
const mockReportData: ReportData = {
  teamUtilization: {
    totalTeamMembers: 12,
    activeTeamMembers: 10,
    averageUtilization: 78,
    utilizationByMonth: [
      { month: "Jan", utilization: 72 },
      { month: "Feb", utilization: 75 },
      { month: "Mar", utilization: 82 },
      { month: "Apr", utilization: 78 },
    ],
  },
  teamSkills: {
    topSkills: [
      { name: "React", count: 8 },
      { name: "Node.js", count: 7 },
      { name: "TypeScript", count: 6 },
      { name: "UX Design", count: 5 },
      { name: "DevOps", count: 4 },
    ],
    skillsByExperience: [
      { name: "React", novice: 2, intermediate: 4, expert: 2 },
      { name: "Node.js", novice: 1, intermediate: 5, expert: 1 },
      { name: "TypeScript", novice: 2, intermediate: 3, expert: 1 },
    ],
  },
  engagementStatus: {
    total: 8,
    byStatus: [
      { status: "Active", count: 4 },
      { status: "Planned", count: 2 },
      { status: "Completed", count: 1 },
      { status: "On Hold", count: 1 },
    ],
    bySector: [
      { sector: "Technology", count: 3 },
      { sector: "Finance", count: 2 },
      { sector: "Retail", count: 2 },
      { sector: "Healthcare", count: 1 },
    ],
  },
  okrProgress: {
    byQuarter: [
      { quarter: "Q1 2023", objectives: 4, completed: 3 },
      { quarter: "Q2 2023", objectives: 5, completed: 2 },
    ],
    byStatus: [
      { status: "On Track", count: 4 },
      { status: "At Risk", count: 2 },
      { status: "Behind", count: 1 },
      { status: "Completed", count: 5 },
    ],
  },
};

// Function to simulate API call to get report data
const fetchReportData = async (period: string): Promise<ReportData> => {
  // In a real app, this would be an API call with the period as a parameter
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockReportData), 500);
  });
};

export default function ReportPage() {
  const [reportPeriod, setReportPeriod] = useState<string>("all-time");

  const { data: reportData, isLoading } = useQuery({
    queryKey: ["reports", reportPeriod],
    queryFn: () => fetchReportData(reportPeriod),
  });

  if (isLoading || !reportData) {
    return (
      <div className="p-6">
        <h1 className="mb-6 text-3xl font-bold">Reports</h1>
        <div>Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Reports</h1>
        <div className="flex items-center space-x-4">
          <label
            htmlFor="report-period"
            className="text-sm font-medium text-gray-700"
          >
            Report Period
          </label>
          <select
            id="report-period"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value)}
            aria-label="Report Period"
          >
            <option value="all-time">All Time</option>
            <option value="this-year">This Year</option>
            <option value="last-quarter">Last Quarter</option>
            <option value="this-quarter">This Quarter</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Team Utilization Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Team Utilization</h2>
          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="rounded-md bg-blue-50 p-4 text-center">
              <p className="text-sm font-medium text-gray-500">Team Members</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.teamUtilization.totalTeamMembers}
              </p>
            </div>
            <div className="rounded-md bg-green-50 p-4 text-center">
              <p className="text-sm font-medium text-gray-500">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.teamUtilization.activeTeamMembers}
              </p>
            </div>
            <div className="rounded-md bg-purple-50 p-4 text-center">
              <p className="text-sm font-medium text-gray-500">
                Average Utilization
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.teamUtilization.averageUtilization}%
              </p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={reportData.teamUtilization.utilizationByMonth}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="utilization"
                  name="Utilization %"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team Skills Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Team Skills</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={reportData.teamSkills.topSkills}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Team Members" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <h3 className="mb-2 mt-6 text-lg font-medium">
            Skills by Experience Level
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={reportData.teamSkills.skillsByExperience}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="novice"
                  stackId="a"
                  name="Novice"
                  fill="#82ca9d"
                />
                <Bar
                  dataKey="intermediate"
                  stackId="a"
                  name="Intermediate"
                  fill="#8884d8"
                />
                <Bar
                  dataKey="expert"
                  stackId="a"
                  name="Expert"
                  fill="#ffc658"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Engagement Status Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Engagement Status</h2>
          <p className="mb-4 text-lg font-medium text-gray-700">
            Total Engagements: {reportData.engagementStatus.total}
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-base font-medium">By Status</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reportData.engagementStatus.byStatus}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      label={(entry) => entry.status}
                    >
                      {reportData.engagementStatus.byStatus.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              STATUS_COLORS[
                                entry.status as keyof typeof STATUS_COLORS
                              ] || COLORS[index % COLORS.length]
                            }
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-base font-medium">By Sector</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reportData.engagementStatus.bySector}
                      dataKey="count"
                      nameKey="sector"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      label={(entry) => entry.sector}
                    >
                      {reportData.engagementStatus.bySector.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* OKR Progress Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">OKR Progress</h2>
          <div className="mb-6">
            <h3 className="mb-4 text-base font-medium">By Quarter</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={reportData.okrProgress.byQuarter}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="objectives"
                    name="Total Objectives"
                    fill="#8884d8"
                  />
                  <Bar dataKey="completed" name="Completed" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-base font-medium">By Status</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reportData.okrProgress.byStatus}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label={(entry) => entry.status}
                  >
                    {reportData.okrProgress.byStatus.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          STATUS_COLORS[
                            entry.status as keyof typeof STATUS_COLORS
                          ] || COLORS[index % COLORS.length]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
