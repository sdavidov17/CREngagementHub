import { render, screen, fireEvent } from "@testing-library/react";
import { useQuery } from "@tanstack/react-query";
import EngagementsPage from "@/app/engagements/page";

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
const mockEngagements = [
  {
    id: "eng-001",
    name: "E-commerce Platform Redesign",
    client: { id: "client-001", name: "RetailX" },
    startDate: "2023-06-15",
    endDate: "2023-12-15",
    status: "Active",
    description:
      "Complete redesign of the client's e-commerce platform with focus on UX and performance.",
    teamMembers: [
      { id: "tm-001", name: "John Smith" },
      { id: "tm-002", name: "Emily Chen" },
    ],
  },
  {
    id: "eng-002",
    name: "Financial System Integration",
    client: { id: "client-002", name: "Global Finance Co." },
    startDate: "2023-08-01",
    endDate: null,
    status: "Active",
    description:
      "Integration of multiple financial systems to create a unified platform for reporting.",
    teamMembers: [{ id: "tm-002", name: "Emily Chen" }],
  },
  {
    id: "eng-003",
    name: "Mobile App Development",
    client: { id: "client-003", name: "HealthPlus" },
    startDate: "2023-09-15",
    endDate: "2024-03-15",
    status: "Planned",
    description: "Development of a mobile application for patient scheduling.",
    teamMembers: [{ id: "tm-001", name: "John Smith" }],
  },
];

describe("EngagementsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders engagements page with title", () => {
    // Mock the useQuery hook to return our test data
    (useQuery as jest.Mock).mockReturnValue({
      data: mockEngagements,
      isLoading: false,
    });

    render(<EngagementsPage />);
    expect(screen.getByText("Engagements")).toBeInTheDocument();
  });

  test("shows loading state when data is being fetched", () => {
    // Mock the loading state
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(<EngagementsPage />);
    expect(screen.getByText("Loading engagements...")).toBeInTheDocument();
  });

  test("displays engagement cards with correct information", () => {
    // Mock the useQuery hook to return our test data
    (useQuery as jest.Mock).mockReturnValue({
      data: mockEngagements,
      isLoading: false,
    });

    render(<EngagementsPage />);

    // Check if all engagement names are displayed
    expect(
      screen.getByText("E-commerce Platform Redesign")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Financial System Integration")
    ).toBeInTheDocument();
    expect(screen.getByText("Mobile App Development")).toBeInTheDocument();

    // Check client names
    expect(screen.getByText("Client: RetailX")).toBeInTheDocument();
    expect(screen.getByText("Client: Global Finance Co.")).toBeInTheDocument();
    expect(screen.getByText("Client: HealthPlus")).toBeInTheDocument();

    // Check for status text in the engagement cards
    const activeCards = screen
      .getAllByText("Active")
      .filter((element) => element.className.includes("rounded-full"));
    expect(activeCards).toHaveLength(2);

    const plannedCards = screen
      .getAllByText("Planned")
      .filter((element) => element.className.includes("rounded-full"));
    expect(plannedCards).toHaveLength(1);

    // Check team members
    expect(screen.getAllByText("John Smith")).toHaveLength(2);
    expect(screen.getAllByText("Emily Chen")).toHaveLength(2);
  });

  test("filters engagements by search term", () => {
    // Mock the useQuery hook to return our test data
    (useQuery as jest.Mock).mockReturnValue({
      data: mockEngagements,
      isLoading: false,
    });

    render(<EngagementsPage />);

    // Type "mobile" in the search input
    const searchInput = screen.getByPlaceholderText("Search engagements...");
    fireEvent.change(searchInput, { target: { value: "mobile" } });

    // Only the Mobile App Development engagement should be visible
    expect(screen.getByText("Mobile App Development")).toBeInTheDocument();
    expect(
      screen.queryByText("E-commerce Platform Redesign")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Financial System Integration")
    ).not.toBeInTheDocument();
  });

  test("filters engagements by status", () => {
    // Mock the useQuery hook to return our test data
    (useQuery as jest.Mock).mockReturnValue({
      data: mockEngagements,
      isLoading: false,
    });

    render(<EngagementsPage />);

    // Select "Planned" status in the filter dropdown
    const statusFilter = screen.getByRole("combobox");
    fireEvent.change(statusFilter, { target: { value: "planned" } });

    // Only the Planned engagement should be visible
    expect(screen.getByText("Mobile App Development")).toBeInTheDocument();
    expect(
      screen.queryByText("E-commerce Platform Redesign")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Financial System Integration")
    ).not.toBeInTheDocument();
  });

  test("shows status counts correctly", () => {
    // Mock the useQuery hook to return our test data
    (useQuery as jest.Mock).mockReturnValue({
      data: mockEngagements,
      isLoading: false,
    });

    render(<EngagementsPage />);

    // Check status counts
    const activeCount = screen.getByText("2"); // 2 Active engagements
    const plannedCount = screen.getByText("1"); // 1 Planned engagement

    expect(activeCount).toBeInTheDocument();
    expect(plannedCount).toBeInTheDocument();
  });

  test("shows empty state when no engagements match filters", () => {
    // Mock the useQuery hook to return our test data
    (useQuery as jest.Mock).mockReturnValue({
      data: mockEngagements,
      isLoading: false,
    });

    render(<EngagementsPage />);

    // Type a search term that won't match any engagements
    const searchInput = screen.getByPlaceholderText("Search engagements...");
    fireEvent.change(searchInput, { target: { value: "nonexistent" } });

    // Check for empty state message
    expect(
      screen.getByText("No engagements found matching your criteria.")
    ).toBeInTheDocument();
  });
});
