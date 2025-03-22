export type CadenceType = 'quarterly' | 'monthly' | 'fortnightly' | 'weekly' | 'ad_hoc';
export type RoleType = 
  | 'client_sponsor' 
  | 'client_champion' 
  | 'client_lead'
  | 'client_engagement_sponsor' 
  | 'client_delivery_lead'
  | 'cr_engagement_lead' 
  | 'cr_sponsor'
  | 'cr_customer_success'
  | 'cr_delivery_manager'
  | 'cr_delivery_leads'
  | 'cr_head_of_delivery'
  | 'clearroute_qces';

export interface MeetingType {
  id: string;
  name: string;
  description: string;
  cadence: string;
  durationMinutes: number;
  requiredAttendees: string[];
  optionalAttendees?: string[];
  defaultAgendaItems?: AgendaItem[];
}

export const meetingTypes: MeetingType[] = [
  {
    id: 'steering-committee',
    name: 'Steering Committee',
    description: 'Strategic decision-making meeting with senior stakeholders',
    cadence: 'Monthly',
    durationMinutes: 60,
    requiredAttendees: ['Delivery Director', 'Client Sponsor', 'Project Manager'],
    optionalAttendees: ['Technical Lead', 'Product Owner'],
    defaultAgendaItems: [
      {
        id: 'sc-1',
        title: 'Project Status Update',
        description: 'Overview of progress, milestones, and key achievements',
        durationMinutes: 15,
        owner: 'Project Manager',
        notes: '',
        sequence: 0
      },
      {
        id: 'sc-2',
        title: 'Risk & Issues Review',
        description: 'Discussion of current risks, issues and mitigations',
        durationMinutes: 15,
        owner: 'Project Manager',
        notes: '',
        sequence: 1
      },
      {
        id: 'sc-3',
        title: 'Strategic Decisions',
        description: 'Key decisions requiring stakeholder input',
        durationMinutes: 20,
        owner: 'Delivery Director',
        notes: '',
        sequence: 2
      },
      {
        id: 'sc-4',
        title: 'Next Steps',
        description: 'Actions and focus areas for next period',
        durationMinutes: 10,
        owner: 'Project Manager',
        notes: '',
        sequence: 3
      }
    ]
  },
  {
    id: 'sprint-review',
    name: 'Sprint Review',
    description: 'End of sprint demonstration of completed work',
    cadence: 'Bi-weekly',
    durationMinutes: 60,
    requiredAttendees: ['Product Owner', 'Development Team', 'Scrum Master'],
    optionalAttendees: ['Project Manager', 'Client Stakeholders'],
    defaultAgendaItems: [
      {
        id: 'sr-1',
        title: 'Sprint Goals Review',
        description: 'Review of sprint goals and achievements',
        durationMinutes: 10,
        owner: 'Scrum Master',
        notes: '',
        sequence: 0
      },
      {
        id: 'sr-2',
        title: 'Demo of Completed Work',
        description: 'Demonstration of features completed in this sprint',
        durationMinutes: 30,
        owner: 'Development Team',
        notes: '',
        sequence: 1
      },
      {
        id: 'sr-3',
        title: 'Feedback & Discussion',
        description: 'Stakeholder feedback and open discussion',
        durationMinutes: 15,
        owner: 'Product Owner',
        notes: '',
        sequence: 2
      },
      {
        id: 'sr-4',
        title: 'Next Sprint Preview',
        description: 'Brief overview of upcoming sprint',
        durationMinutes: 5,
        owner: 'Product Owner',
        notes: '',
        sequence: 3
      }
    ]
  },
  {
    id: 'daily-standup',
    name: 'Daily Standup',
    description: 'Daily team check-in to discuss progress and blockers',
    cadence: 'Daily',
    durationMinutes: 15,
    requiredAttendees: ['Development Team', 'Scrum Master'],
    optionalAttendees: ['Product Owner'],
    defaultAgendaItems: [
      {
        id: 'ds-1',
        title: 'What did you do yesterday?',
        description: 'Updates on progress from previous day',
        durationMinutes: 5,
        owner: 'Team',
        notes: '',
        sequence: 0
      },
      {
        id: 'ds-2',
        title: 'What will you do today?',
        description: 'Plans for the current day',
        durationMinutes: 5,
        owner: 'Team',
        notes: '',
        sequence: 1
      },
      {
        id: 'ds-3',
        title: 'Any blockers?',
        description: 'Discussion of impediments requiring attention',
        durationMinutes: 5,
        owner: 'Team',
        notes: '',
        sequence: 2
      }
    ]
  },
  {
    id: 'technical-review',
    name: 'Technical Review',
    description: 'Deep dive into technical aspects of the project',
    cadence: 'Weekly',
    durationMinutes: 45,
    requiredAttendees: ['Technical Lead', 'Development Team'],
    optionalAttendees: ['Product Owner', 'Architect'],
    defaultAgendaItems: [
      {
        id: 'tr-1',
        title: 'Architecture Updates',
        description: 'Discussion of any architectural changes or decisions',
        durationMinutes: 10,
        owner: 'Technical Lead',
        notes: '',
        sequence: 0
      },
      {
        id: 'tr-2',
        title: 'Code Quality & Standards',
        description: 'Review of code quality metrics and adherence to standards',
        durationMinutes: 10,
        owner: 'Development Team',
        notes: '',
        sequence: 1
      },
      {
        id: 'tr-3',
        title: 'Technical Debt',
        description: 'Discussion of current technical debt and mitigation strategies',
        durationMinutes: 15,
        owner: 'Technical Lead',
        notes: '',
        sequence: 2
      },
      {
        id: 'tr-4',
        title: 'Technical Risks',
        description: 'Identification and discussion of technical risks',
        durationMinutes: 10,
        owner: 'Development Team',
        notes: '',
        sequence: 3
      }
    ]
  }
];

export interface MeetingEvent {
  id: string;
  meetingTypeId: string;
  engagementId: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  location?: string;
  virtualLink?: string;
  attendees: string[]; // User IDs
  agenda?: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface StakeholderMapping {
  id: string;
  clientStakeholderId: string;
  clearRouteTeamMemberId: string;
  relationship: 'primary' | 'secondary';
  lastContactDate?: Date | string;
  notes?: string;
}

export interface AgendaItem {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  owner: string;
  notes: string;
  sequence: number;
} 