/**
 * Feature Toggle Types
 * 
 * This file contains all the type definitions related to the feature toggle system.
 */

/**
 * Represents a complete feature toggle entity that would be stored in the database
 */
export interface FeatureToggle {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  scope: FeatureScope;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Possible scopes for feature toggles:
 * - GLOBAL: Applies to the entire application
 * - USER: Can be enabled/disabled per user
 * - ROLE: Can be enabled/disabled per role
 * - CLIENT: Can be enabled/disabled per client
 * - ENGAGEMENT: Can be enabled/disabled per engagement
 */
export enum FeatureScope {
  GLOBAL = 'global',
  USER = 'user',
  ROLE = 'role',
  CLIENT = 'client',
  ENGAGEMENT = 'engagement'
}

/**
 * Simple key-value map of feature flags and their states
 * 
 * Example:
 * ```
 * {
 *   'core.okr-tracking': true,
 *   'feature.quick-add-engagement': false,
 *   'experimental.ai-recommendations': false
 * }
 * ```
 */
export type FeatureFlags = {
  [key: string]: boolean;
};

/**
 * Context type for the FeatureToggle provider
 */
export type FeatureFlagContextType = {
  features: FeatureFlags;
  isEnabled: (featureName: string) => boolean;
}; 