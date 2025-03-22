import { render, screen, fireEvent } from "@testing-library/react";
import EngagementPage from "@/app/engagements/page";
import { useQuery } from "@tanstack/react-query";

// Mock the useQuery hook
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

// Mock engagement data
const mockEngagementData = [
  {
    id: "1",
    name: "Digital Transformation",
    description: "Enterprise-wide digital transformation initiative",
    client: "Acme Corporation",
    status: "ACTIVE",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    teamSize: 5,
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "Develop new customer-facing mobile application",
    client: "TechCorp Inc",
    status: "PLANNED",
    startDate: "2023-04-01",
    endDate: "2023-09-30",
    teamSize: 3,
  },
];

describe("EngagementPage", () => {
  beforeEach(() => {
    // Mock the useQuery implementation for each test
    (useQuery as jest.Mock).mockImplementation(() => ({
      data: mockEngagementData,
      isLoading: false,
      error: null,
    }));
  });

  it("renders the engagements page with title", () => {
    render(<EngagementPage />);

    expect(screen.getByText("Engagements")).toBeInTheDocument();
  });

  it("displays engagements when data is loaded", () => {
    render(<EngagementPage />);

    expect(screen.getByText("Digital Transformation")).toBeInTheDocument();
    expect(screen.getByText("Mobile App Development")).toBeInTheDocument();
  });

  it("shows loading state when data is loading", () => {
    (useQuery as jest.Mock).mockImplementation(() => ({
      data: null,
      isLoading: true,
      error: null,
    }));

    render(<EngagementPage />);

    expect(screen.getByText("Loading engagements...")).toBeInTheDocument();
  });

  it("filters engagements by search input", () => {
    render(<EngagementPage />);

    const searchInput = screen.getByPlaceholderText("Search engagements...");
    fireEvent.change(searchInput, { target: { value: "Digital" } });

    expect(screen.getByText("Digital Transformation")).toBeInTheDocument();
    expect(
      screen.queryByText("Mobile App Development")
    ).not.toBeInTheDocument();
  });

  it("filters engagements by status", () => {
    render(<EngagementPage />);

    const statusFilter = screen.getByLabelText("Status");
    fireEvent.change(statusFilter, { target: { value: "PLANNED" } });

    expect(
      screen.queryByText("Digital Transformation")
    ).not.toBeInTheDocument();
    expect(screen.getByText("Mobile App Development")).toBeInTheDocument();
  });
});
