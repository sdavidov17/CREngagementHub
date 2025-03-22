import { render, screen, fireEvent } from "@testing-library/react";
import OKRPage from "@/app/okrs/page";
import { useQuery } from "@tanstack/react-query";

// Mock the useQuery hook
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

// Mock OKR data
const mockOKRData = [
  {
    id: "1",
    title: "Improve customer engagement",
    description: "Enhance customer interaction across digital touchpoints",
    type: "OBJECTIVE",
    status: "IN_PROGRESS",
    quarter: "Q1-2023",
    engagementName: "Digital Transformation",
    progress: 65,
    keyResults: [
      {
        id: "2",
        title: "Increase mobile app usage by 30%",
        status: "ON_TRACK",
        progress: 80,
      },
      {
        id: "3",
        title: "Reduce customer support tickets by 20%",
        status: "AT_RISK",
        progress: 40,
      },
    ],
  },
  {
    id: "4",
    title: "Optimize development workflow",
    description:
      "Streamline software development process and reduce bottlenecks",
    type: "OBJECTIVE",
    status: "ON_TRACK",
    quarter: "Q1-2023",
    engagementName: "Mobile App Development",
    progress: 85,
    keyResults: [
      {
        id: "5",
        title: "Reduce build times by 50%",
        status: "COMPLETED",
        progress: 100,
      },
      {
        id: "6",
        title: "Implement CI/CD pipeline",
        status: "IN_PROGRESS",
        progress: 70,
      },
    ],
  },
];

describe("OKRPage", () => {
  beforeEach(() => {
    // Mock the useQuery implementation for each test
    (useQuery as jest.Mock).mockImplementation(() => ({
      data: mockOKRData,
      isLoading: false,
      error: null,
    }));
  });

  it("renders the OKRs page with title", () => {
    render(<OKRPage />);

    expect(
      screen.getByText("OKRs (Objectives & Key Results)")
    ).toBeInTheDocument();
  });

  it("displays objectives when data is loaded", () => {
    render(<OKRPage />);

    expect(screen.getByText("Improve customer engagement")).toBeInTheDocument();
    expect(
      screen.getByText("Optimize development workflow")
    ).toBeInTheDocument();
  });

  it("displays key results for each objective", () => {
    render(<OKRPage />);

    expect(
      screen.getByText("Increase mobile app usage by 30%")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Reduce customer support tickets by 20%")
    ).toBeInTheDocument();
    expect(screen.getByText("Reduce build times by 50%")).toBeInTheDocument();
    expect(screen.getByText("Implement CI/CD pipeline")).toBeInTheDocument();
  });

  it("shows loading state when data is loading", () => {
    (useQuery as jest.Mock).mockImplementation(() => ({
      data: null,
      isLoading: true,
      error: null,
    }));

    render(<OKRPage />);

    expect(screen.getByText("Loading OKRs...")).toBeInTheDocument();
  });

  it("filters OKRs by search input", () => {
    render(<OKRPage />);

    const searchInput = screen.getByPlaceholderText("Search OKRs...");
    fireEvent.change(searchInput, { target: { value: "customer" } });

    expect(screen.getByText("Improve customer engagement")).toBeInTheDocument();
    expect(
      screen.queryByText("Optimize development workflow")
    ).not.toBeInTheDocument();
  });

  it("filters OKRs by quarter", () => {
    render(<OKRPage />);

    const quarterFilter = screen.getByLabelText("Quarter");
    fireEvent.change(quarterFilter, { target: { value: "Q1-2023" } });

    expect(screen.getByText("Improve customer engagement")).toBeInTheDocument();
    expect(
      screen.getByText("Optimize development workflow")
    ).toBeInTheDocument();
  });
});
