/**
 * Feature Toggle Provider
 *
 * This component provides feature toggle functionality throughout the application
 * using React Context. It initializes and manages feature flags, and provides
 * components and hooks for accessing feature toggle state.
 *
 * @example
 * // In _app.tsx or layout.tsx:
 * import { FeatureToggleProvider } from "@/components/FeatureToggleProvider";
 *
 * function App() {
 *   return (
 *     <FeatureToggleProvider>
 *       <Component {...pageProps} />
 *     </FeatureToggleProvider>
 *   );
 * }
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import { FeatureFlags, FeatureFlagContextType } from "@/types/feature-toggle";
import featureToggleService from "@/lib/feature-toggle";

// Create a context with default values
const FeatureFlagContext = createContext<FeatureFlagContextType>({
  features: {},
  isEnabled: () => false,
});

interface FeatureToggleProviderProps {
  children: React.ReactNode;
}

/**
 * FeatureToggleProvider component
 *
 * This provider initializes feature flags and provides access to them throughout the app.
 * It wraps the application to provide feature flag context to all components.
 */
export const FeatureToggleProvider: React.FC<FeatureToggleProviderProps> = ({
  children,
}) => {
  const [features, setFeatures] = useState<FeatureFlags>({});
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize feature flags on component mount
    const initFeatures = async () => {
      try {
        await featureToggleService.initialize();
        setFeatures(featureToggleService.getAll());
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize feature flags:", error);
        // Default to empty state if initialization fails
        setIsInitialized(true);
      }
    };

    initFeatures();
  }, []);

  // Function to check if a feature is enabled
  const isEnabled = (featureName: string): boolean => {
    return featureToggleService.isEnabled(featureName);
  };

  // Provide the feature context to children components
  return (
    <FeatureFlagContext.Provider value={{ features, isEnabled }}>
      {isInitialized ? children : <div>Loading features...</div>}
    </FeatureFlagContext.Provider>
  );
};

/**
 * Hook for easy access to feature flags
 *
 * @example
 * // Inside a component:
 * import { useFeatureFlag } from "@/components/FeatureToggleProvider";
 *
 * function MyComponent() {
 *   const { isEnabled } = useFeatureFlag();
 *
 *   return (
 *     <div>
 *       {isEnabled('feature.quick-add-engagement') && (
 *         <QuickAddEngagement />
 *       )}
 *     </div>
 *   );
 * }
 */
export const useFeatureFlag = (): FeatureFlagContextType => {
  const context = useContext(FeatureFlagContext);

  if (context === undefined) {
    throw new Error(
      "useFeatureFlag must be used within a FeatureToggleProvider"
    );
  }

  return context;
};

/**
 * Props for the WithFeatureFlag component
 */
interface WithFeatureFlagProps {
  /**
   * The name of the feature to check
   */
  featureName: string;
  /**
   * Optional content to display when the feature is disabled
   */
  fallback?: React.ReactNode;
}

/**
 * Higher Order Component for conditionally rendering components based on feature flags
 *
 * @example
 * // Basic usage:
 * <WithFeatureFlag featureName="feature.quick-add-engagement">
 *   <QuickAddEngagement />
 * </WithFeatureFlag>
 *
 * // With fallback content:
 * <WithFeatureFlag
 *   featureName="feature.engagement-filters"
 *   fallback={<div>Filters coming soon</div>}
 * >
 *   <FilterComponent />
 * </WithFeatureFlag>
 */
export const WithFeatureFlag: React.FC<
  WithFeatureFlagProps & { children: React.ReactNode }
> = ({ featureName, fallback = null, children }) => {
  const { isEnabled } = useFeatureFlag();

  return isEnabled(featureName) ? <>{children}</> : <>{fallback}</>;
};

export default FeatureToggleProvider;
