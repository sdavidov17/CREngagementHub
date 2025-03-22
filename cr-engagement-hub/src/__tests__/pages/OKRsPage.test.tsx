import { render, screen, fireEvent } from "@testing-library/react";
import { useQuery } from "@tanstack/react-query";
import OKRsPage from "@/app/okrs/page";

// Mock the React Query hook
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

// Mock the next/link component to avoid router errors
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock data for the tests
const mockObjectives = [
  {
    id: "obj-001",
    title: "Increase Team Efficiency",
    description: "Improve team productivity",
    quarter: "Q3 2023",
    owner: {
      id: "tm-001",
      name: "John Smith",
    },
    status: "On Track",
    keyResults: [
      {
        id: "kr-001",
        description: "Reduce meeting time by 20%",
        progress: 75,
        status: "In Progress",
      },
      {
        id: "kr-002",
        description: "Implement automated testing",
        progress: 90,
        status: "In Progress",
      },
    ],
  },
  {
    id: "obj-002",
    title: "Improve Client Satisfaction",
    description: "Enhance client experience",
    quarter: "Q3 2023",
    owner: {
      id: "tm-002",
      name: "Emily Chen",
    },
    status: "At Risk",
    keyResults: [
      {
        id: "kr-004",
        description: "Increase NPS score",
        progress: 50,
        status: "At Risk",
      },
    ],
  },
  {
    id: "obj-003",
    title: "Expand Technical Expertise",
    description: "Develop team skills",
    quarter: "Q2 2023",
    owner: {
      id: "tm-003",
      name: "Michael Johnson",
    },
    status: "Completed",
    keyResults: [
      {
        id: "kr-007",
        description: "Complete cloud certification",
        progress: 100,
        status: "Completed",
      },
    ],
  },
];

describe("OKRsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders OKRs page with title", () => {
    // Mock the useQuery hook to return our test data
    (useQuery as jest.Mock).mockReturnValue({
      data: mockObjectives,
      isLoading: false,
    });

    render(<OKRsPage />);
    expect(screen.getByText("OKRs")).toBeInTheDocument();
  });

  test("shows loading state when data is being fetched", () => {
    // Mock the loading state
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(<OKRsPage />);
    expect(screen.getByText("Loading objectives...")).toBeInTheDocument();
  });

  test("displays objective cards with correct information", () => {
    // Mock the useQuery hook to return our test data
    (useQuery as jest.Mock).mockReturnValue({
      data: mockObjectives,
      isLoading: false,
    });

    render(<OKRsPage />);

    // Check if all objective titles are displayed
    expect(screen.getByText("Increase Team Efficiency")).toBeInTheDocument();
    expect(screen.getByText("Improve Client Satisfaction")).toBeInTheDocument();
    expect(screen.getByText("Expand Technical Expertise")).toBeInTheDocument();

    // Check owner names
    expect(screen.getByText("Owner: John Smith")).toBeInTheDocument();
    expect(screen.getByText("Owner: Emily Chen")).toBeInTheDocument();
    expect(screen.getByText("Owner: Michael Johnson")).toBeInTheDocument();

    // Check for status badges
    const onTrackBadges = screen.getAllByText("On Track", {
      selector: "span.inline-flex.rounded-full",
    });
    expect(onTrackBadges.length).toBeGreaterThanOrEqual(1);
    expect(onTrackBadges[0].className).toContain("text-green-800");

    const atRiskBadges = screen.getAllByText("At Risk", {
      selector: "span.inline-flex.rounded-full",
    });
    expect(atRiskBadges.length).toBeGreaterThanOrEqual(1);
    expect(atRiskBadges[0].className).toContain("text-yellow-800");

    const completedBadges = screen.getAllByText("Completed", {
      selector: "span.inline-flex.rounded-full",
    });
    expect(completedBadges.length).toBeGreaterThanOrEqual(1);
    expect(completedBadges[0].className).toContain("text-blue-800");

    // Check quarters
    expect(screen.getAllByText("Quarter: Q3 2023")).toHaveLength(2);
    expect(screen.getByText("Quarter: Q2 2023")).toBeInTheDocument();

    // Check key results
    expect(screen.getByText("Reduce meeting time by 20%")).toBeInTheDocument();
    expect(screen.getByText("Increase NPS score")).toBeInTheDocument();
    expect(
      screen.getByText("Complete cloud certification")
    ).toBeInTheDocument();
  });

  test("filters objectives by search term", () => {
    // Mock the useQuery hook to return our test data
    (useQuery as jest.Mock).mockReturnValue({
      data: mockObjectives,
      isLoading: false,
    });

    render(<OKRsPage />);

    // Type "client" in the search input
    const searchInput = screen.getByPlaceholderText("Search objectives...");
    fireEvent.change(searchInput, { target: { value: "client" } });

    // Only the Client Satisfaction objective should be visible
    expect(screen.getByText("Improve Client Satisfaction")).toBeInTheDocument();
    expect(
      screen.queryByText("Increase Team Efficiency")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Expand Technical Expertise")
    ).not.toBeInTheDocument();
  });

  test("filters objectives by quarter", () => {
    // Mock the useQuery hook to return our test data
    (useQuery as jest.Mock).mockReturnValue({
      data: mockObjectives,
      isLoading: false,
    });

    render(<OKRsPage />);

    // Select Q2 2023 in the quarter filter
    const quarterFilter = screen.getByLabelText("Quarter Filter");
    fireEvent.change(quarterFilter, { target: { value: "Q2 2023" } });

    // Only the Q2 objective should be visible
    expect(screen.getByText("Expand Technical Expertise")).toBeInTheDocument();
    expect(
      screen.queryByText("Increase Team Efficiency")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Improve Client Satisfaction")
    ).not.toBeInTheDocument();
  });

  test("filters objectives by status", () => {
    // Mock the useQuery hook to return our test data
    (useQuery as jest.Mock).mockReturnValue({
      data: mockObjectives,
      isLoading: false,
    });

    render(<OKRsPage />);

    // Select "completed" status in the filter dropdown
    const statusFilter = screen.getByLabelText("Status Filter");
    fireEvent.change(statusFilter, { target: { value: "completed" } });

    // Only the Completed objective should be visible
    expect(screen.getByText("Expand Technical Expertise")).toBeInTheDocument();
    expect(
      screen.queryByText("Increase Team Efficiency")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Improve Client Satisfaction")
    ).not.toBeInTheDocument();
  });

  test("shows status counts correctly", () => {
    // Mock the useQuery hook to return our test data
    (useQuery as jest.Mock).mockReturnValue({
      data: mockObjectives,
      isLoading: false,
    });

    render(<OKRsPage />);

    // Find the status count elements
    const onTrackCount = screen.getByText("1", { selector: ".text-green-600" });
    const atRiskCount = screen.getByText("1", { selector: ".text-yellow-600" });
    const completedCount = screen.getByText("1", {
      selector: ".text-blue-600",
    });

    expect(onTrackCount).toBeInTheDocument();
    expect(atRiskCount).toBeInTheDocument();
    expect(completedCount).toBeInTheDocument();
  });

  test("shows empty state when no objectives match filters", () => {
    // Mock the useQuery hook to return our test data
    (useQuery as jest.Mock).mockReturnValue({
      data: mockObjectives,
      isLoading: false,
    });

    render(<OKRsPage />);

    // Type a search term that won't match any objectives
    const searchInput = screen.getByPlaceholderText("Search objectives...");
    fireEvent.change(searchInput, { target: { value: "nonexistent" } });

    // Check for empty state message
    expect(
      screen.getByText("No objectives found matching your criteria.")
    ).toBeInTheDocument();
  });
});
