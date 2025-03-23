# Feature Toggle System

The CR Engagement Hub implements a robust feature toggle system that provides fine-grained control over feature visibility throughout the application. This document provides a comprehensive guide to understanding, implementing, and managing feature toggles.

## Table of Contents

- [Overview](#overview)
- [Benefits](#benefits)
- [Architecture](#architecture)
- [Feature Flag Naming Convention](#feature-flag-naming-convention)
- [Usage](#usage)
  - [Using WithFeatureFlag Component](#using-withfeatureflag-component)
  - [Using useFeatureFlag Hook](#using-usefeatureflag-hook)
  - [Directly Using the Service](#directly-using-the-service)
- [Management](#management)
  - [Admin Interface](#admin-interface)
  - [Environment Variables](#environment-variables)
  - [Code-Based Configuration](#code-based-configuration)
- [Implementation Examples](#implementation-examples)
- [Testing Feature Flags](#testing-feature-flags)
- [Best Practices](#best-practices)

## Overview

Feature toggles (also known as feature flags) allow developers to enable or disable functionality without deploying new code. The CR Engagement Hub uses a centralized feature toggle service to manage and provide access to feature flags throughout the application.

## Benefits

- **Incremental Deployment**: Deploy in-progress features to production without exposing them to users
- **Targeted Rollouts**: Enable features for specific users, roles, or contexts
- **A/B Testing**: Test different implementations or designs with different user groups
- **Operational Safety**: Quickly disable problematic features without a new deployment
- **Development Efficiency**: Multiple developers can work on separate features without code conflicts

## Architecture

The feature toggle system consists of several key components:

1. **Feature Toggle Service (`src/lib/feature-toggle.ts`)**:
   - Manages the default state of all features
   - Loads feature configurations from environment variables and potentially databases/remote sources
   - Provides methods to check, enable, and disable features

2. **Feature Toggle Provider (`src/components/FeatureToggleProvider.tsx`)**:
   - Context provider that wraps the application
   - Initializes the feature toggle service
   - Provides React components and hooks to access feature flags

3. **Type Definitions (`src/types/feature-toggle.ts`)**:
   - Defines the TypeScript types used by the feature toggle system
   - Documents available feature flags and their structure

4. **Admin UI (`src/app/admin/feature-toggles/`)**:
   - Provides an interface for administrators to enable/disable features

## Feature Flag Naming Convention

Feature flags follow a structured naming convention:

- **Core Features**: Fundamental functionality, prefixed with `core.`
  - Example: `core.okr-tracking`

- **New Features**: Recently added features, prefixed with `feature.`
  - Example: `feature.quick-add-engagement`

- **Experimental Features**: Unstable or testing functionality, prefixed with `experimental.`
  - Example: `experimental.ai-recommendations`

## Usage

### Using WithFeatureFlag Component

The most common way to conditionally render components based on feature flags:

```tsx
import { WithFeatureFlag } from "@/components/FeatureToggleProvider";

// Simple usage - component is only rendered if the feature is enabled
<WithFeatureFlag featureName="feature.quick-add-engagement">
  <QuickAddEngagement onAddEngagement={handleAddEngagement} clients={clients} />
</WithFeatureFlag>

// With fallback content - displays alternative content when the feature is disabled
<WithFeatureFlag 
  featureName="feature.engagement-filters"
  fallback={<div className="text-light-gray">Filter options coming soon</div>}
>
  <FilterControls />
</WithFeatureFlag>
```

### Using useFeatureFlag Hook

For more complex conditional logic:

```tsx
import { useFeatureFlag } from "@/components/FeatureToggleProvider";

function MyComponent() {
  const { isEnabled } = useFeatureFlag();
  
  // Use the flag in conditional logic
  const showNewUI = isEnabled('feature.enhanced-ui');
  const enableExport = isEnabled('feature.data-export');
  
  return (
    <div>
      <h1>{showNewUI ? "Enhanced View" : "Standard View"}</h1>
      {showNewUI && <NewUIComponent />}
      
      <button disabled={!enableExport}>
        Export Data
      </button>
    </div>
  );
}
```

### Directly Using the Service

For services, utilities, or non-React code:

```tsx
import { isFeatureEnabled } from "@/lib/feature-toggle";

function myUtilityFunction() {
  if (isFeatureEnabled('feature.advanced-calculations')) {
    return performAdvancedCalculation();
  } else {
    return performStandardCalculation();
  }
}
```

## Management

### Admin Interface

Administrators can manage feature flags through the admin interface:

1. Navigate to `/admin/feature-toggles`
2. Toggle features on/off using the provided controls
3. Changes take effect immediately without requiring a page refresh

### Environment Variables

Feature flags can be controlled through environment variables:

```
# Naming format: FEATURE_<FLAG_NAME_WITH_UNDERSCORES>=<true|false>
FEATURE_CORE_OKR_TRACKING=true
FEATURE_FEATURE_QUICK_ADD_ENGAGEMENT=false
```

Environment variables override the default configuration in the code.

### Code-Based Configuration

Default feature flag states are defined in `src/lib/feature-toggle.ts`:

```ts
const defaultFeatures: FeatureFlags = {
  // Core features
  'core.okr-tracking': true,
  
  // New features
  'feature.quick-add-engagement': false,
  
  // Experimental features
  'experimental.ai-recommendations': false,
};
```

## Implementation Examples

### Quick Add Engagement Feature

The Quick Add Engagement feature (`feature.quick-add-engagement`) demonstrates a complete feature toggle implementation:

1. **Feature Implementation**: A component that adds a quick form for adding engagements
   - Component: `src/components/engagement/QuickAddEngagement.tsx`
   - Test: `src/__tests__/components/QuickAddEngagement.test.tsx`

2. **Feature Integration**: Added to the Engagements page with a feature toggle
   ```tsx
   // In src/app/engagements/page.tsx
   <WithFeatureFlag
     featureName="feature.quick-add-engagement"
     fallback={
       <div className="mb-4 text-light-gray">
         Quick Add Engagement coming soon
       </div>
     }
   >
     <QuickAddEngagement
       onAddEngagement={handleAddEngagement}
       clients={mockClients}
     />
   </WithFeatureFlag>
   ```

3. **Default Configuration**: Disabled by default in `feature-toggle.ts`
   ```ts
   'feature.quick-add-engagement': false,
   ```

## Testing Feature Flags

Test files demonstrate how to test components that use feature flags:

1. **Testing the Feature Toggle Service**:
   - File: `src/__tests__/lib/feature-toggle.test.ts`
   - Tests setting, getting, and resetting feature flags

2. **Testing Components with Feature Flags**:
   - Use Jest mocks to control feature flag behavior during tests
   - Example in `src/__tests__/components/WithFeatureFlag.test.tsx`

## Best Practices

1. **Keep Feature Flags Temporary**: 
   - Once a feature is stable and widely adopted, remove the toggle
   - Avoid accumulating technical debt of long-lived toggles

2. **Use Descriptive Names**:
   - Follow the naming convention (`core.`, `feature.`, `experimental.`)
   - Use descriptive names that clearly identify the feature

3. **Document Feature Flags**:
   - Keep the README updated with all available flags
   - Include descriptions of what each flag controls

4. **Test Both States**:
   - Always test with the feature both enabled and disabled
   - Ensure graceful fallback for disabled features

5. **Clean Fallbacks**:
   - Provide informative fallback content when features are disabled
   - Use the `fallback` prop of `WithFeatureFlag` to show useful messages 