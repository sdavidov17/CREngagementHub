export type MetricUnit = 'percentage' | 'minutes' | 'hours' | 'days' | 'count' | 'currency' | 'custom';
export type MetricDirection = 'increase' | 'decrease';
export type MetricCategory = 'delivery' | 'quality' | 'performance' | 'productivity' | 'satisfaction' | 'custom';

export interface SuccessMetric {
  id: string;
  name: string;
  description: string;
  current: number;
  target: number;
  format: 'percentage' | 'currency' | 'number';
  status: 'on_track' | 'at_risk' | 'off_track';
  trend: 'increasing' | 'decreasing' | 'stable';
  trendIsGood: boolean;
  period: string;
  category: string;
  engagementId: string;
  lastUpdated: Date | string;
}

export interface MetricHistoryEntry {
  id: string;
  metricId: string;
  value: number;
  date: Date;
  notes?: string;
}

export interface MetricFilter {
  engagementIds?: string[];
  categories?: MetricCategory[];
  startDate?: Date;
  endDate?: Date;
  showInactive?: boolean;
}

export interface PredefinedMetric {
  id: string;
  name: string;
  description: string;
  unit: MetricUnit;
  customUnit?: string;
  direction: MetricDirection;
  category: MetricCategory;
  defaultBaseline?: number;
  defaultTarget?: number;
}

export const predefinedMetrics: PredefinedMetric[] = [
  {
    id: 'test_execution_time',
    name: 'Reduction in Test Execution Time',
    description: 'Measure the time it takes to run test suites before and after implementing shift-left techniques',
    unit: 'minutes',
    direction: 'decrease',
    category: 'performance'
  },
  {
    id: 'test_coverage',
    name: 'Increased Test Coverage',
    description: 'Percentage of codebase covered by automated tests',
    unit: 'percentage',
    direction: 'increase',
    category: 'quality',
    defaultBaseline: 60,
    defaultTarget: 85
  },
  {
    id: 'lead_time',
    name: 'Improved Lead Time for Changes',
    description: 'Time it takes for code changes to be developed, tested, and deployed to production',
    unit: 'days',
    direction: 'decrease',
    category: 'delivery'
  },
  {
    id: 'developer_productivity',
    name: 'Improved Developer Productivity',
    description: 'Number of features or user stories completed within a given timeframe',
    unit: 'count',
    direction: 'increase',
    category: 'productivity'
  },
  {
    id: 'defect_rate',
    name: 'Reduced Defect Rate',
    description: 'Number of defects found in production per release',
    unit: 'count',
    direction: 'decrease',
    category: 'quality'
  },
  {
    id: 'client_satisfaction',
    name: 'Client Satisfaction Score',
    description: 'Average satisfaction score from client feedback surveys',
    unit: 'percentage',
    direction: 'increase',
    category: 'satisfaction',
    defaultBaseline: 70,
    defaultTarget: 90
  },
  {
    id: 'time_to_resolution',
    name: 'Time to Resolution',
    description: 'Average time to resolve reported issues',
    unit: 'hours',
    direction: 'decrease',
    category: 'performance'
  }
]; 