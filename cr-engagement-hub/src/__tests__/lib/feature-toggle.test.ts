import featureToggleService, {
  isFeatureEnabled,
  setFeatureFlag,
  getAllFeatures,
  resetFeatures
} from '@/lib/feature-toggle';

describe('Feature Toggle Service', () => {
  // Reset the feature flags before each test
  beforeEach(() => {
    resetFeatures();
  });

  it('should have default feature flags after initialization', async () => {
    await featureToggleService.initialize();
    const features = featureToggleService.getAll();
    
    // Check core features are enabled by default
    expect(features['core.okr-tracking']).toBe(true);
    expect(features['core.team-management']).toBe(true);
    expect(features['core.client-overview']).toBe(true);
    expect(features['core.engagement-management']).toBe(true);
    
    // Check that experimental features are disabled by default
    expect(features['experimental.ai-recommendations']).toBe(false);
    expect(features['experimental.data-visualization']).toBe(false);
    expect(features['experimental.automated-reporting']).toBe(false);
  });

  it('should correctly check if a feature is enabled', async () => {
    await featureToggleService.initialize();
    
    // Test core feature (should be enabled)
    expect(isFeatureEnabled('core.okr-tracking')).toBe(true);
    
    // Test experimental feature (should be disabled)
    expect(isFeatureEnabled('experimental.ai-recommendations')).toBe(false);
    
    // Test non-existent feature (should be disabled)
    expect(isFeatureEnabled('non.existent.feature')).toBe(false);
  });

  it('should successfully set a feature flag', async () => {
    await featureToggleService.initialize();
    
    // Initial state
    expect(isFeatureEnabled('experimental.ai-recommendations')).toBe(false);
    
    // Enable the feature
    setFeatureFlag('experimental.ai-recommendations', true);
    expect(isFeatureEnabled('experimental.ai-recommendations')).toBe(true);
    
    // Disable the feature
    setFeatureFlag('experimental.ai-recommendations', false);
    expect(isFeatureEnabled('experimental.ai-recommendations')).toBe(false);
  });

  it('should correctly add a new feature flag', async () => {
    await featureToggleService.initialize();
    
    // Set a new feature flag
    setFeatureFlag('new.feature', true);
    
    // Check it was added
    expect(isFeatureEnabled('new.feature')).toBe(true);
    
    // Verify it appears in all features
    const features = getAllFeatures();
    expect(features['new.feature']).toBe(true);
  });

  it('should reset feature flags to defaults', async () => {
    await featureToggleService.initialize();
    
    // Change some feature flags
    setFeatureFlag('core.okr-tracking', false);
    setFeatureFlag('experimental.ai-recommendations', true);
    setFeatureFlag('new.feature', true);
    
    // Verify changes
    expect(isFeatureEnabled('core.okr-tracking')).toBe(false);
    expect(isFeatureEnabled('experimental.ai-recommendations')).toBe(true);
    expect(isFeatureEnabled('new.feature')).toBe(true);
    
    // Reset to defaults
    resetFeatures();
    
    // Verify reset worked
    expect(isFeatureEnabled('core.okr-tracking')).toBe(true);
    expect(isFeatureEnabled('experimental.ai-recommendations')).toBe(false);
    expect(isFeatureEnabled('new.feature')).toBe(false);
  });
}); 