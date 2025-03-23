import { render, screen } from "@testing-library/react";
import {
  WithFeatureFlag,
  FeatureToggleProvider,
} from "@/components/FeatureToggleProvider";
import featureToggleService from "@/lib/feature-toggle";

// Mock the feature toggle service
jest.mock("@/lib/feature-toggle", () => ({
  __esModule: true,
  default: {
    isEnabled: jest.fn(),
    getAll: jest.fn(),
    initialize: jest.fn().mockResolvedValue({}),
    setFeature: jest.fn(),
    reset: jest.fn(),
  },
  isFeatureEnabled: jest.fn(),
  setFeatureFlag: jest.fn(),
  getAllFeatures: jest.fn(),
  resetFeatures: jest.fn(),
}));

describe("WithFeatureFlag", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders children when feature is enabled", () => {
    // Mock the feature toggle service to return true for the feature
    (featureToggleService.isEnabled as jest.Mock).mockReturnValue(true);

    render(
      <FeatureToggleProvider>
        <WithFeatureFlag featureName="feature.test">
          <div data-testid="feature-content">Feature Content</div>
        </WithFeatureFlag>
      </FeatureToggleProvider>
    );

    expect(screen.getByTestId("feature-content")).toBeInTheDocument();
    expect(screen.getByText("Feature Content")).toBeInTheDocument();
    expect(featureToggleService.isEnabled).toHaveBeenCalledWith("feature.test");
  });

  it("does not render children when feature is disabled", () => {
    // Mock the feature toggle service to return false for the feature
    (featureToggleService.isEnabled as jest.Mock).mockReturnValue(false);

    render(
      <FeatureToggleProvider>
        <WithFeatureFlag featureName="feature.test">
          <div data-testid="feature-content">Feature Content</div>
        </WithFeatureFlag>
      </FeatureToggleProvider>
    );

    expect(screen.queryByTestId("feature-content")).not.toBeInTheDocument();
    expect(screen.queryByText("Feature Content")).not.toBeInTheDocument();
    expect(featureToggleService.isEnabled).toHaveBeenCalledWith("feature.test");
  });

  it("renders fallback content when feature is disabled and fallback is provided", () => {
    // Mock the feature toggle service to return false for the feature
    (featureToggleService.isEnabled as jest.Mock).mockReturnValue(false);

    render(
      <FeatureToggleProvider>
        <WithFeatureFlag
          featureName="feature.test"
          fallback={<div data-testid="fallback-content">Fallback Content</div>}
        >
          <div data-testid="feature-content">Feature Content</div>
        </WithFeatureFlag>
      </FeatureToggleProvider>
    );

    expect(screen.queryByTestId("feature-content")).not.toBeInTheDocument();
    expect(screen.queryByText("Feature Content")).not.toBeInTheDocument();
    expect(screen.getByTestId("fallback-content")).toBeInTheDocument();
    expect(screen.getByText("Fallback Content")).toBeInTheDocument();
    expect(featureToggleService.isEnabled).toHaveBeenCalledWith("feature.test");
  });
});
