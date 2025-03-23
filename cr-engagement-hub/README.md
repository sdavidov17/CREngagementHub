# CR Engagement Hub

A comprehensive Team and Capacity Management application that allows delivery leads and engagement leads to manage team rosters, track OKRs, schedule meetings, and generate reports.

## Features

- **Team and Capacity Management**: Create and maintain team rosters, track skills and availability, visualize team allocations
- **OKR Tracking**: Set quarterly objectives and key results, monitor progress, link deliverables
- **Meeting Management**: Schedule recurring meetings, track attendance, record action items
- **Client and Engagement Overview**: View engagement health and metrics across clients
- **Reporting**: Generate progress reports, export data for presentations
- **Engagement Home Page**: Consolidated view of all engagement data in one place, including status updates, team, metrics, objectives, and documents
- **Client Home Page**: At-a-glance view of client information and all associated engagements
- **RAG Status Tracking**: Track red/amber/green statuses across engagements with detailed comments and history
- **Success Metrics**: Monitor and visualize key performance indicators and success metrics
- **Notice Board**: Share important announcements and notifications across teams

## Documentation

- [Solution Design](./docs/solution-design.md) - Architecture diagrams and database schema
- [Feature Toggle System](./docs/feature-toggles.md) - Comprehensive guide to the feature toggle system

## Technologies

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **State Management**: React Query, Zustand
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL database
- Docker (optional, for local database setup)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd cr-engagement-hub
```

2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables by copying the example:

```bash
cp .env.example .env
```

4. Configure your database connection in the `.env` file.

5. If using Docker, start the database:

```bash
npm run db:start
```

6. Otherwise, ensure your PostgreSQL database is running and the connection URL is correct in `.env`.

7. Run the database migrations:

```bash
npm run prisma:migrate:dev
```

8. Generate the Prisma client:

```bash
npm run prisma:generate
```

9. Seed the database with initial data:

```bash
npm run seed
```

10. Start the development server:

```bash
npm run dev
```

11. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Login Credentials (Development)

- **Admin User**:
  - Email: admin@example.com
  - Password: password123

- **Delivery Lead**:
  - Email: delivery@example.com
  - Password: password123

- **Engagement Lead**:
  - Email: engagement@example.com
  - Password: password123

## Project Structure

```
cr-engagement-hub/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/              # API routes
│   │   │   ├── feature-toggles/ # Feature toggle API endpoints
│   │   ├── (auth)/           # Authentication pages
│   │   ├── dashboard/        # Dashboard and authenticated pages
│   │   ├── clients/          # Client pages and [id] dynamic routes
│   │   ├── engagements/      # Engagement pages and [id] dynamic routes
│   │   ├── team/             # Team management pages
│   │   ├── okrs/             # OKR tracking pages
│   │   ├── admin/            # Admin pages
│   │   │   ├── feature-toggles/ # Feature toggle management UI
│   │   ├── components/       # Reusable components
│   │   │   ├── FeatureToggleProvider.tsx # Feature toggle context provider
│   │   │   ├── ui/           # Core UI components (ClearRoute design system)
│   │   │   │   ├── Badge.tsx # Status and information badges
│   │   │   │   ├── Button.tsx # Buttons with variants
│   │   │   │   ├── Card.tsx   # Content container cards
│   │   │   │   ├── ProgressBar.tsx # Progress visualization
│   │   │   │   ├── StatusBadge.tsx # Status indicators
│   │   ├── engagement/       # Engagement-related components
│   │   │   ├── QuickAddEngagement.tsx # Quick form for adding engagements
│   │   ├── metrics/          # Metrics visualization components
│   │   ├── governance/       # Governance and meeting components
│   │   ├── notice/           # Notice board components
│   │   ├── okr/              # OKR tracking components
│   │   ├── rag/              # RAG status tracking components
│   │   ├── lib/              # Utility functions and services
│   │   ├── types/            # TypeScript type definitions
│   │   │   ├── feature-toggle.ts # Feature toggle type definitions
│   │   │   ├── governance.ts # Governance type definitions
│   │   │   ├── metrics.ts    # Success metrics type definitions
│   │   │   ├── notice.ts     # Notice board type definitions
│   │   │   ├── okr.ts        # OKR type definitions
│   │   │   ├── rag.ts        # RAG status type definitions
│   │   ├── prisma/           # Prisma schema and migrations
│   │   │   ├── schema.prisma # Database schema
│   │   │   ├── seed.ts       # Seed script
│   └── public/               # Static assets
├── docs/                     # Documentation
│   ├── solution-design.md    # Architecture and database diagrams
```

## Key Pages and Components

### Engagement Home Page
The Engagement Home page (`/engagements/[id]`) provides a consolidated view of all engagement data with tabbed sections:

- **Overview**: Shows status updates, milestones, upcoming meetings, and key metrics summary
- **Team**: Lists all team members with contact information and roles
- **Metrics**: Displays success metrics with detailed progress visualization
- **Objectives**: Shows OKRs with progress tracking and update capability
- **Documents**: Manages engagement-related files and documents

### Client Home Page
The Client Home page (`/clients/[id]`) provides an at-a-glance view of client information with tabbed sections:

- **Engagements**: Shows all engagements for the client with status filtering, progress indicators, and activity logs
- **Contacts**: Lists all client contacts with detailed information
- **Documents**: Manages client-related files
- **Notes**: Tracks client-specific notes and communication

### UI Components
The ClearRoute design system includes reusable UI components:

- **Card**: Content containers with consistent styling
- **Badge**: Status and information indicators
- **StatusBadge**: Specialized badges for representing statuses (On Track, At Risk, etc.)
- **Button**: Action buttons with multiple variants (primary, secondary, ghost)
- **ProgressBar**: Visual representation of progress

## Design System

The ClearRoute design system follows these guidelines:

- **Color Scheme**: Dark mode with teal (#00E9A3) highlights
- **Background Colors**:
  - Header: #1A1E23 (dark navy)
  - Sidebar: #2D3239 (dark gray)
  - Card: #2D3239 (dark gray)
- **Status Colors**:
  - On Track/Success: #198754 (green)
  - At Risk/Warning: #FFC107 (amber)
  - Critical/Danger: #DC3545 (red)
- **Typography**:
  - Headings: Inter font, medium/bold weight
  - Body: Inter font, regular weight
- **Component Styling**:
  - Card: 8px border radius, 16px padding, 2px blur box shadow
  - Buttons: Multiple variants with consistent padding and hover states
  - Badges: Rounded pill shape for statuses and indicators

## Feature Toggle System

The CR Engagement Hub includes a comprehensive feature toggle system that enables:

- Deploying code to production without exposing in-progress features
- Enabling features selectively for different users or environments
- A/B testing new functionality
- Quick disabling of problematic features without code deployment

### Feature Flag Types

Feature flags are grouped into three categories:

- **Core Features**: Fundamental features that are enabled by default (`core.*`)
- **New Features**: Recently added features that may be toggled (`feature.*`)
- **Experimental Features**: Experimental functionality for testing (`experimental.*`)

### Currently Implemented Flags

| Flag Name | Default | Description |
|-----------|---------|-------------|
| `core.okr-tracking` | Enabled | OKR tracking functionality |
| `core.team-management` | Enabled | Team roster and management |
| `core.client-overview` | Enabled | Client management and overview |
| `core.engagement-management` | Enabled | Engagement creation and management |
| `feature.rag-status-tracking` | Enabled | Red/Amber/Green status tracking |
| `feature.success-metrics` | Enabled | Success metrics visualization |
| `feature.notice-board` | Enabled | Company notice board |
| `feature.meeting-agenda-builder` | Enabled | Meeting agenda creation tools |
| `feature.stakeholder-mapping` | Enabled | Stakeholder relationship mapping |
| `feature.engagement-filters` | Enabled | Advanced engagement list filtering |
| `feature.quick-add-engagement` | Disabled | Quick engagement creation form |
| `experimental.ai-recommendations` | Disabled | AI-powered recommendations |
| `experimental.data-visualization` | Disabled | Advanced data visualization |
| `experimental.automated-reporting` | Disabled | Automated report generation |

### Using Feature Toggles in Components

To conditionally render UI elements based on feature flags, use the `WithFeatureFlag` component:

```tsx
import { WithFeatureFlag } from "@/components/FeatureToggleProvider";

// Simple usage
<WithFeatureFlag featureName="feature.quick-add-engagement">
  <QuickAddEngagement onAddEngagement={handleAddEngagement} clients={clients} />
</WithFeatureFlag>

// With fallback content
<WithFeatureFlag 
  featureName="feature.engagement-filters"
  fallback={<div>Filter options coming soon</div>}
>
  <FilterControls />
</WithFeatureFlag>
```

### Managing Feature Flags

Feature flags can be managed in several ways:

1. **Environment Variables**: Set variables in the format `FEATURE_CORE_OKR_TRACKING=true`
2. **Admin Interface**: Access `/admin/feature-toggles` to toggle features in the UI (requires admin access)
3. **Code**: Programmatically set flags using the feature toggle service:

```tsx
import { setFeatureFlag } from '@/lib/feature-toggle';

// Enable a feature
setFeatureFlag('feature.quick-add-engagement', true);
```

### Adding New Feature Flags

To add a new feature flag, update the `defaultFeatures` object in `src/lib/feature-toggle.ts`:

```ts
const defaultFeatures: FeatureFlags = {
  // Existing flags...
  'feature.my-new-feature': false, // disabled by default
};
```

## Development

### Database Management

- View your database with Prisma Studio:

```bash
npm run prisma:studio
```

- Create a new migration after schema changes:

```bash
npm run prisma:migrate:dev -- --name <migration-name>
```

### Testing

Run tests with Jest:

```bash
npm test
```

## Deployment

TODO: Add deployment instructions

## License

This project is licensed under the MIT License - see the LICENSE file for details.
