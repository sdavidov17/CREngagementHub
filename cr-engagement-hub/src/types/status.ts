export type RAGStatus = 'on_track' | 'at_risk' | 'critical';

export interface EngagementRAGStatus {
  id: string;
  engagementId: string;
  peopleStatus: RAGStatus;
  deliveryStatus: RAGStatus;
  commercialStatus: RAGStatus;
  overallStatus: RAGStatus;
  comments: string;
  periodStartDate: Date;
  periodEndDate: Date;
  updatedAt: Date;
  updatedById: string;
}

export interface RAGStatusComment {
  id: string;
  engagementRAGStatusId: string;
  type: 'people' | 'delivery' | 'commercial' | 'overall';
  content: string;
  createdAt: Date;
  createdById: string;
}

export interface RAGStatusHistoryEntry {
  id: string;
  engagementId: string;
  statusDate: Date;
  peopleStatus: RAGStatus;
  deliveryStatus: RAGStatus;
  commercialStatus: RAGStatus;
  overallStatus: RAGStatus;
}

export interface RAGStatusFilter {
  engagementIds?: string[];
  clientIds?: string[];
  statuses?: RAGStatus[];
  startDate?: Date;
  endDate?: Date;
}

export const RAGStatusColors = {
  on_track: 'success',
  at_risk: 'warning',
  critical: 'danger'
};

export const RAGStatusLabels = {
  on_track: 'On Track',
  at_risk: 'At Risk',
  critical: 'Critical'
}; 