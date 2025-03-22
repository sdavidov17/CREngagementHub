import { render, screen, fireEvent } from "@testing-library/react";
import ReportPage from "@/app/reports/page";
import { useQuery } from "@tanstack/react-query";

// Mock the useQuery hook
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

// Mock report data
const mockReportData = {
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

describe("ReportPage", () => {
  beforeEach(() => {
    // Mock the useQuery implementation for each test
    (useQuery as jest.Mock).mockImplementation(() => ({
      data: mockReportData,
      isLoading: false,
      error: null,
    }));
  });

  it("renders the reports page with title", () => {
    render(<ReportPage />);

    expect(screen.getByText("Reports")).toBeInTheDocument();
  });

  it("displays team utilization section", () => {
    render(<ReportPage />);

    expect(screen.getByText("Team Utilization")).toBeInTheDocument();
    expect(screen.getByText("78%")).toBeInTheDocument();
    expect(screen.getByText("Average Utilization")).toBeInTheDocument();
  });

  it("displays team skills section", () => {
    render(<ReportPage />);

    expect(screen.getByText("Team Skills")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
  });

  it("displays engagement status section", () => {
    render(<ReportPage />);

    expect(screen.getByText("Engagement Status")).toBeInTheDocument();
    expect(screen.getByText("Total Engagements: 8")).toBeInTheDocument();
  });

  it("displays OKR progress section", () => {
    render(<ReportPage />);

    expect(screen.getByText("OKR Progress")).toBeInTheDocument();
    expect(screen.getByText("Q1 2023")).toBeInTheDocument();
  });

  it("shows loading state when data is loading", () => {
    (useQuery as jest.Mock).mockImplementation(() => ({
      data: null,
      isLoading: true,
      error: null,
    }));

    render(<ReportPage />);

    expect(screen.getByText("Loading reports...")).toBeInTheDocument();
  });

  it("allows changing the report period", () => {
    render(<ReportPage />);

    const periodSelector = screen.getByLabelText("Report Period");
    fireEvent.change(periodSelector, { target: { value: "last-quarter" } });

    // In a real app, this would trigger a new data fetch
    // For our test, we just verify the selection changed
    expect(periodSelector.value).toBe("last-quarter");
  });
});
