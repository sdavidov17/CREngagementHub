import { render, screen } from "@testing-library/react";
import TeamMemberDetailPage from "@/app/team/[id]/page";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

// Mock the modules
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mock team member data
const mockTeamMember = {
  id: "1",
  name: "John Developer",
  email: "john@example.com",
  title: "Senior Developer",
  startDate: "2022-01-15",
  skills: ["React", "Node.js"],
  engagements: [
    {
      id: "1",
      name: "Digital Transformation",
      role: "Technical Lead",
      allocation: 80,
    },
  ],
};

describe("TeamMemberDetailPage", () => {
  beforeEach(() => {
    // Set up mocks
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
    (useQuery as jest.Mock).mockImplementation(() => ({
      data: mockTeamMember,
      isLoading: false,
      error: null,
    }));
  });

  it("renders the team member details page with name", () => {
    render(<TeamMemberDetailPage />);

    expect(screen.getByText("John Developer")).toBeInTheDocument();
  });

  it("displays personal information", () => {
    render(<TeamMemberDetailPage />);

    expect(screen.getByText("Personal Information")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Senior Developer")).toBeInTheDocument();
  });

  it("displays skills", () => {
    render(<TeamMemberDetailPage />);

    expect(screen.getByText("Skills")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
  });

  it("displays engagement information", () => {
    render(<TeamMemberDetailPage />);

    expect(screen.getByText("Current Engagements")).toBeInTheDocument();
    expect(screen.getByText("Digital Transformation")).toBeInTheDocument();
    expect(screen.getByText("Technical Lead")).toBeInTheDocument();

    // Use getAllByText to deal with multiple occurrences and check if at least one exists
    const allocations = screen.getAllByText(/80%/);
    expect(allocations.length).toBeGreaterThan(0);
  });

  it("shows loading state when data is loading", () => {
    (useQuery as jest.Mock).mockImplementation(() => ({
      data: null,
      isLoading: true,
      error: null,
    }));

    render(<TeamMemberDetailPage />);

    expect(screen.getByText("Loading team member data...")).toBeInTheDocument();
  });

  it("shows error message when team member is not found", () => {
    (useQuery as jest.Mock).mockImplementation(() => ({
      data: null,
      isLoading: false,
      error: null,
    }));

    render(<TeamMemberDetailPage />);

    expect(screen.getByText("Team member not found")).toBeInTheDocument();
  });
});
