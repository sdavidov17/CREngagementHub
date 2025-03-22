import { render, screen, fireEvent } from "@testing-library/react";
import { useQuery } from "@tanstack/react-query";
import ReportPage from "@/app/reports/page";

// Mock the React Query hook
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

// Mock the recharts to avoid errors with SVG rendering in tests
jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Line: () => <div>Line</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Bar: () => <div>Bar</div>,
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Pie: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Cell: () => <div>Cell</div>,
  CartesianGrid: () => <div>CartesianGrid</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  Tooltip: () => <div>Tooltip</div>,
  Legend: () => <div>Legend</div>,
}));

// Mock data for the tests
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
    ],
    skillsByExperience: [
      { name: "React", novice: 2, intermediate: 4, expert: 2 },
      { name: "Node.js", novice: 1, intermediate: 5, expert: 1 },
    ],
  },
  engagementStatus: {
    total: 8,
    byStatus: [
      { status: "Active", count: 4 },
      { status: "Planned", count: 2 },
    ],
    bySector: [
      { sector: "Technology", count: 3 },
      { sector: "Finance", count: 2 },
    ],
  },
  okrProgress: {
    byQuarter: [
      { quarter: "Q1 2023", objectives: 4, completed: 3 },
      { quarter: "Q2 2023", objectives: 5, completed: 2 },
    ],
    byStatus: [
      { status: "On Track", count: 4 },
      { status: "Completed", count: 5 },
    ],
  },
};

describe("ReportsPage", () => {
  beforeEach(() => {
    // Reset mock
    jest.clearAllMocks();
  });

  test("renders reports page with title", () => {
    // Mock the useQuery hook to return our test data
    (useQuery as jest.Mock).mockReturnValue({
      data: mockReportData,
      isLoading: false,
    });

    render(<ReportPage />);
    expect(screen.getByText("Reports")).toBeInTheDocument();
  });

  test("shows loading state when data is being fetched", () => {
    // Mock the loading state
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(<ReportPage />);
    expect(screen.getByText("Loading reports...")).toBeInTheDocument();
  });

  test("shows team utilization section", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockReportData,
      isLoading: false,
    });

    render(<ReportPage />);
    expect(screen.getByText("Team Utilization")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument(); // Total team members
    expect(screen.getByText("78%")).toBeInTheDocument(); // Average utilization
  });

  test("shows team skills section", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockReportData,
      isLoading: false,
    });

    render(<ReportPage />);
    expect(screen.getByText("Team Skills")).toBeInTheDocument();
    expect(screen.getByText("Skills by Experience Level")).toBeInTheDocument();
  });

  test("shows engagement status section", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockReportData,
      isLoading: false,
    });

    render(<ReportPage />);
    expect(screen.getByText("Engagement Status")).toBeInTheDocument();
    expect(screen.getByText("Total Engagements: 8")).toBeInTheDocument();
    expect(screen.getAllByText("By Status")[0]).toBeInTheDocument();
    expect(screen.getByText("By Sector")).toBeInTheDocument();
  });

  test("shows OKR progress section", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockReportData,
      isLoading: false,
    });

    render(<ReportPage />);
    expect(screen.getByText("OKR Progress")).toBeInTheDocument();
    expect(screen.getByText("By Quarter")).toBeInTheDocument();
    expect(screen.getAllByText("By Status")[1]).toBeInTheDocument();
  });

  test("can change report period", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockReportData,
      isLoading: false,
    });

    render(<ReportPage />);

    // Find the select element and change its value
    const select = screen.getByLabelText("Report Period");
    fireEvent.change(select, { target: { value: "this-year" } });

    // Check that useQuery was called with the new period
    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["reports", "this-year"],
      })
    );
  });
});
