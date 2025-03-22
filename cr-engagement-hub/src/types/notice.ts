export type NoticePriority = 'low' | 'medium' | 'high';
export type NoticeCategory = 'general' | 'engagement' | 'company' | 'event' | 'technical' | 'client' | 'resource';

export interface Notice {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  publishedDate: Date | string;
  expiryDate?: Date | string;
  createdBy: string;
  department: string;
  tags: string[];
  readBy: string[];
  link?: string;
}

export interface NoticeFilter {
  categories?: NoticeCategory[];
  priorities?: NoticePriority[];
  engagementId?: string;
  showExpired?: boolean;
  searchTerm?: string;
}

export const NoticePriorityColors = {
  low: 'text-light-gray',
  medium: 'text-warning',
  high: 'text-danger'
};

export const NoticePriorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High'
};

export const NoticeCategoryLabels = {
  general: 'General',
  engagement: 'Engagement',
  company: 'Company',
  event: 'Event',
  technical: 'Technical',
  client: 'Client',
  resource: 'Resource'
}; 