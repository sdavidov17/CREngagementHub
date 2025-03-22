export interface Comment {
  author: string;
  text: string;
  timestamp: Date | string;
}

export type KeyResultStatus = 'not_started' | 'on_track' | 'at_risk' | 'behind' | 'completed';
export type ObjectiveStatus = 'on_track' | 'at_risk' | 'behind' | 'completed';

export interface KeyResult {
  id: string;
  title: string;
  description: string;
  status: KeyResultStatus;
  progress: number;
  owner: string;
  startDate: Date | string;
  targetDate: Date | string;
  comments?: Comment[];
}

export interface Objective {
  id: string;
  title: string;
  description: string;
  status: ObjectiveStatus;
  quarter: string;
  owner: string;
  keyResults: KeyResult[];
  engagementId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface KeyResultTask {
  id: string;
  keyResultId: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  dueDate?: Date;
  assigneeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OKRFilter {
  quarters?: string[];
  statuses?: ObjectiveStatus[];
  search?: string;
  engagementId?: string;
  teamId?: string;
  ownerId?: string;
}

export const ObjectiveStatusColors = {
  on_track: 'success',
  at_risk: 'warning',
  behind: 'danger',
  completed: 'teal'
};

export const KeyResultStatusColors = {
  not_started: 'light-gray',
  in_progress: 'success',
  at_risk: 'warning',
  behind: 'danger',
  completed: 'teal'
};

export const ObjectiveStatusLabels = {
  on_track: 'On Track',
  at_risk: 'At Risk',
  behind: 'Behind',
  completed: 'Completed'
};

export const KeyResultStatusLabels = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  at_risk: 'At Risk',
  behind: 'Behind',
  completed: 'Completed'
}; 