import { FeatureFlags } from '@/types/feature-toggle';

// Default feature flags configuration
const defaultFeatures: FeatureFlags = {
  // Core features
  'core.okr-tracking': true,
  'core.team-management': true,
  'core.client-overview': true,
  'core.engagement-management': true,
  
  // New features
  'feature.rag-status-tracking': true,
  'feature.success-metrics': true,
  'feature.notice-board': true,
  'feature.meeting-agenda-builder': true,
  'feature.stakeholder-mapping': true,
  'feature.engagement-filters': true,
  'feature.quick-add-engagement': false,
  
  // Experimental features
  'experimental.ai-recommendations': false,
  'experimental.data-visualization': false,
  'experimental.automated-reporting': false,
};

let features = { ...defaultFeatures };

// Load feature flags from environment variables
function loadFeaturesFromEnv() {
  try {
    Object.keys(defaultFeatures).forEach(featureKey => {
      const envKey = `FEATURE_${featureKey.replace(/\./g, '_').toUpperCase()}`;
      const envValue = process.env[envKey];
      
      if (envValue !== undefined) {
        features[featureKey] = envValue.toLowerCase() === 'true';
      }
    });
  } catch (error) {
    console.error('Error loading feature flags from environment variables:', error);
  }
}

// Load feature flags from remote config (placeholder for future implementation)
async function loadFeaturesFromRemoteConfig() {
  // This would be implemented to fetch from a remote configuration service
  // For now, we're just using local config
  return;
}

// Load feature flags from database (placeholder for future implementation)
async function loadFeaturesFromDatabase() {
  // This would fetch feature toggle configurations from the database
  // For now, we're just using local config
  return;
}

// Initialize feature flags
export async function initializeFeatureFlags() {
  loadFeaturesFromEnv();
  await loadFeaturesFromRemoteConfig();
  await loadFeaturesFromDatabase();
  return features;
}

// Check if a feature is enabled
export function isFeatureEnabled(featureName: string): boolean {
  return features[featureName] === true;
}

// Set feature flag (for testing or dynamic updates)
export function setFeatureFlag(featureName: string, value: boolean): void {
  features[featureName] = value;
}

// Get all feature flags
export function getAllFeatures(): FeatureFlags {
  return { ...features };
}

// Reset to default features (useful for testing)
export function resetFeatures(): void {
  features = { ...defaultFeatures };
}

// Export the feature toggle service
const featureToggleService = {
  initialize: initializeFeatureFlags,
  isEnabled: isFeatureEnabled,
  setFeature: setFeatureFlag,
  getAll: getAllFeatures,
  reset: resetFeatures,
};

export default featureToggleService; 