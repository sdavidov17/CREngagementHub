export interface RagComment {
  author: string;
  text: string;
  timestamp: Date | string;
}

export interface RagStatus {
  id: string;
  title: string;
  description: string;
  currentStatus: 'red' | 'amber' | 'green';
  previousStatus?: 'red' | 'amber' | 'green';
  category: string;
  owner: string;
  priority: 'high' | 'medium' | 'low';
  lastUpdated: Date | string;
  engagementId: string;
  comments: RagComment[];
} 