import { render, screen, fireEvent } from "@testing-library/react";
import ClientPage from "@/app/clients/page";
import { useQuery } from "@tanstack/react-query";

// Mock the useQuery hook
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

// Mock client data
const mockClientData = [
  {
    id: "1",
    name: "Acme Corporation",
    description: "Global technology company",
    industry: "Technology",
    contactName: "John Smith",
    contactEmail: "john@acmecorp.com",
    contactPhone: "555-123-4567",
    engagementCount: 2,
    activeEngagements: 1,
  },
  {
    id: "2",
    name: "TechCorp Inc",
    description: "Software development and consulting",
    industry: "IT Services",
    contactName: "Jane Doe",
    contactEmail: "jane@techcorp.com",
    contactPhone: "555-987-6543",
    engagementCount: 1,
    activeEngagements: 1,
  },
  {
    id: "3",
    name: "Global Finance",
    description: "Financial services provider",
    industry: "Finance",
    contactName: "Robert Johnson",
    contactEmail: "robert@globalfinance.com",
    contactPhone: "555-456-7890",
    engagementCount: 3,
    activeEngagements: 2,
  },
];

describe("ClientPage", () => {
  beforeEach(() => {
    // Mock the useQuery implementation for each test
    (useQuery as jest.Mock).mockImplementation(() => ({
      data: mockClientData,
      isLoading: false,
      error: null,
    }));
  });

  it("renders the clients page with title", () => {
    render(<ClientPage />);

    expect(screen.getByText("Clients")).toBeInTheDocument();
  });

  it("displays clients when data is loaded", () => {
    render(<ClientPage />);

    expect(screen.getByText("Acme Corporation")).toBeInTheDocument();
    expect(screen.getByText("TechCorp Inc")).toBeInTheDocument();
    expect(screen.getByText("Global Finance")).toBeInTheDocument();
  });

  it("shows client details", () => {
    render(<ClientPage />);

    expect(screen.getByText("Global technology company")).toBeInTheDocument();
    expect(screen.getAllByText("Technology")[0]).toBeInTheDocument();
    expect(screen.getByText("John Smith")).toBeInTheDocument();
    expect(screen.getByText("john@acmecorp.com")).toBeInTheDocument();
  });

  it("shows loading state when data is loading", () => {
    (useQuery as jest.Mock).mockImplementation(() => ({
      data: null,
      isLoading: true,
      error: null,
    }));

    render(<ClientPage />);

    expect(screen.getByText("Loading clients...")).toBeInTheDocument();
  });

  it("filters clients by search input", () => {
    render(<ClientPage />);

    const searchInput = screen.getByPlaceholderText("Search clients...");
    fireEvent.change(searchInput, { target: { value: "Finance" } });

    expect(screen.queryByText("Acme Corporation")).not.toBeInTheDocument();
    expect(screen.queryByText("TechCorp Inc")).not.toBeInTheDocument();
    expect(screen.getByText("Global Finance")).toBeInTheDocument();
  });

  it("filters clients by industry", () => {
    render(<ClientPage />);

    const industryFilter = screen.getByLabelText("Industry");
    fireEvent.change(industryFilter, { target: { value: "Technology" } });

    expect(screen.getByText("Acme Corporation")).toBeInTheDocument();
    expect(screen.queryByText("TechCorp Inc")).not.toBeInTheDocument();
    expect(screen.queryByText("Global Finance")).not.toBeInTheDocument();
  });
});
