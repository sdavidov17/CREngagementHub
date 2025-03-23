import { render, screen, fireEvent } from "@testing-library/react";
import { QuickAddEngagement } from "@/components/engagement/QuickAddEngagement";

const mockClients = [
  { id: "client-001", name: "Test Client 1" },
  { id: "client-002", name: "Test Client 2" },
];

describe("QuickAddEngagement", () => {
  const mockOnAddEngagement = jest.fn();

  beforeEach(() => {
    mockOnAddEngagement.mockClear();
  });

  it("renders the quick add button initially", () => {
    render(
      <QuickAddEngagement
        onAddEngagement={mockOnAddEngagement}
        clients={mockClients}
      />
    );

    expect(screen.getByText("Quick Add")).toBeInTheDocument();
    expect(screen.queryByText("Quick Add Engagement")).not.toBeInTheDocument();
  });

  it("displays the form when button is clicked", () => {
    render(
      <QuickAddEngagement
        onAddEngagement={mockOnAddEngagement}
        clients={mockClients}
      />
    );

    fireEvent.click(screen.getByText("Quick Add"));

    expect(screen.getByText("Quick Add Engagement")).toBeInTheDocument();
    expect(screen.getByLabelText("Engagement Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Client")).toBeInTheDocument();
    expect(screen.getByLabelText("Start Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Status")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Add Engagement")).toBeInTheDocument();
  });

  it("submits the form with correct data", () => {
    render(
      <QuickAddEngagement
        onAddEngagement={mockOnAddEngagement}
        clients={mockClients}
      />
    );

    // Open form
    fireEvent.click(screen.getByText("Quick Add"));

    // Fill in form
    fireEvent.change(screen.getByLabelText("Engagement Name"), {
      target: { value: "Test Engagement" },
    });

    fireEvent.change(screen.getByLabelText("Client"), {
      target: { value: "client-001" },
    });

    fireEvent.change(screen.getByLabelText("Start Date"), {
      target: { value: "2023-10-15" },
    });

    fireEvent.change(screen.getByLabelText("Status"), {
      target: { value: "Planned" },
    });

    // Submit form
    fireEvent.click(screen.getByText("Add Engagement"));

    // Verify onAddEngagement was called with correct data
    expect(mockOnAddEngagement).toHaveBeenCalledTimes(1);
    expect(mockOnAddEngagement).toHaveBeenCalledWith({
      name: "Test Engagement",
      clientId: "client-001",
      startDate: "2023-10-15",
      status: "Planned",
    });

    // Form should be closed after submission
    expect(screen.getByText("Quick Add")).toBeInTheDocument();
    expect(screen.queryByText("Quick Add Engagement")).not.toBeInTheDocument();
  });

  it("closes the form when Cancel is clicked", () => {
    render(
      <QuickAddEngagement
        onAddEngagement={mockOnAddEngagement}
        clients={mockClients}
      />
    );

    // Open form
    fireEvent.click(screen.getByText("Quick Add"));
    expect(screen.getByText("Quick Add Engagement")).toBeInTheDocument();

    // Click Cancel
    fireEvent.click(screen.getByText("Cancel"));

    // Form should be closed
    expect(screen.getByText("Quick Add")).toBeInTheDocument();
    expect(screen.queryByText("Quick Add Engagement")).not.toBeInTheDocument();

    // onAddEngagement should not have been called
    expect(mockOnAddEngagement).not.toHaveBeenCalled();
  });
});
