"use client";

import { useState, useEffect } from "react";
import featureToggleService from "@/lib/feature-toggle";
import { FeatureFlags } from "@/types/feature-toggle";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function FeatureTogglesPage() {
  const [features, setFeatures] = useState<FeatureFlags>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatures = async () => {
      await featureToggleService.initialize();
      setFeatures(featureToggleService.getAll());
      setLoading(false);
    };

    loadFeatures();
  }, []);

  const toggleFeature = (featureName: string) => {
    const currentValue = features[featureName];
    featureToggleService.setFeature(featureName, !currentValue);
    setFeatures({ ...featureToggleService.getAll() });
  };

  const resetFeatures = () => {
    featureToggleService.reset();
    setFeatures({ ...featureToggleService.getAll() });
  };

  const getCategoryFromKey = (key: string) => {
    const parts = key.split(".");
    return parts[0] || "unknown";
  };

  const getFeatureNameFromKey = (key: string) => {
    const parts = key.split(".");
    return parts.slice(1).join(".");
  };

  const groupedFeatures = Object.entries(features).reduce(
    (acc, [key, value]) => {
      const category = getCategoryFromKey(key);
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({ key, value });
      return acc;
    },
    {} as Record<string, { key: string; value: boolean }[]>
  );

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Feature Toggles</h1>
        <p>Loading feature flags...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Feature Toggles</h1>
        <Button onClick={resetFeatures} variant="secondary">
          Reset to Defaults
        </Button>
      </div>

      <p className="mb-6 text-gray-400">
        Feature toggles allow you to enable or disable features across the
        application. Use this page to manage which features are available to
        users.
      </p>

      {Object.entries(groupedFeatures).map(([category, featureList]) => (
        <div key={category} className="mb-8">
          <h2 className="text-xl font-semibold mb-4 capitalize">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featureList.map(({ key, value }) => (
              <Card key={key} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{getFeatureNameFromKey(key)}</h3>
                  <Badge className={value ? "bg-green-600" : "bg-gray-600"}>
                    {value ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 mb-4">{key}</p>
                <Button
                  onClick={() => toggleFeature(key)}
                  variant={value ? "secondary" : "primary"}
                  className="w-full"
                >
                  {value ? "Disable" : "Enable"}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
