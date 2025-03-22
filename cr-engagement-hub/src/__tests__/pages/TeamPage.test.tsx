import { render, screen, fireEvent } from "@testing-library/react";
import TeamPage from "@/app/team/page";
import { useQuery } from "@tanstack/react-query";

// Mock the useQuery hook
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

// Mock team data
const mockTeamData = [
  {
    id: "1",
    name: "John Developer",
    email: "john@example.com",
    title: "Senior Developer",
    skills: ["React", "Node.js"],
  },
  {
    id: "2",
    name: "Jane Designer",
    email: "jane@example.com",
    title: "UX Designer",
    skills: ["UX Design"],
  },
];

describe("TeamPage", () => {
  beforeEach(() => {
    // Mock the useQuery implementation for each test
    (useQuery as jest.Mock).mockImplementation(() => ({
      data: mockTeamData,
      isLoading: false,
      error: null,
    }));
  });

  it("renders the team page with title", () => {
    render(<TeamPage />);

    expect(screen.getByText("Team Management")).toBeInTheDocument();
  });

  it("displays team members when data is loaded", () => {
    render(<TeamPage />);

    expect(screen.getByText("John Developer")).toBeInTheDocument();
    expect(screen.getByText("Jane Designer")).toBeInTheDocument();
  });

  it("shows loading state when data is loading", () => {
    (useQuery as jest.Mock).mockImplementation(() => ({
      data: null,
      isLoading: true,
      error: null,
    }));

    render(<TeamPage />);

    expect(screen.getByText("Loading team members...")).toBeInTheDocument();
  });

  it("filters team members by search input", () => {
    render(<TeamPage />);

    const searchInput = screen.getByPlaceholderText(
      "Search by name, title, or skill..."
    );
    fireEvent.change(searchInput, { target: { value: "John" } });

    expect(screen.getByText("John Developer")).toBeInTheDocument();
    expect(screen.queryByText("Jane Designer")).not.toBeInTheDocument();
  });
});
