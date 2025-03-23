# CR Engagement Hub - Solution Design

This document outlines the architectural design of the CR Engagement Hub application.

## System Architecture

```mermaid
graph TD
    subgraph "Frontend Layer"
        UI[UI Components]
        Pages[Pages]
        StateManagement[State Management]
    end

    subgraph "Backend Layer"
        NextAPI[Next.js API Routes]
        Auth[Authentication]
        Middleware[Middleware]
    end

    subgraph "Data Layer"
        DB[(PostgreSQL)]
        Prisma[Prisma ORM]
    end

    UI --> Pages
    Pages --> StateManagement
    StateManagement --> NextAPI
    NextAPI --> Prisma
    Prisma --> DB
    Auth --> NextAPI
    Middleware --> NextAPI
```

## Local Development Infrastructure

```mermaid
graph TD
    subgraph "Developer Workstation"
        NextDev[Next.js Dev Server]
        NodeJS[Node.js Runtime]
        NPM[NPM Scripts]
        IDE[Code Editor/IDE]
        Git[Git Client]
        subgraph "Docker Environment"
            DockerCLI[Docker CLI]
            Postgres[PostgreSQL Container]
            PrismaStudio[Prisma Studio]
        end
    end

    subgraph "Development Tools"
        GitHub[GitHub Repository]
        Testing[Jest Testing Framework]
        Linting[ESLint]
        TypeChecking[TypeScript Compiler]
    end

    IDE --> Git
    Git --> GitHub
    NPM --> NextDev
    NPM --> Testing
    NPM --> Linting
    NPM --> TypeChecking
    NPM --> DockerCLI
    DockerCLI --> Postgres
    NextDev --> NodeJS
    Postgres --> PrismaStudio
    NextDev --> Postgres
    
    classDef container fill:#1b91ff,color:white;
    class Postgres,PrismaStudio container;
```

## Deployment Pipeline

```mermaid
flowchart TD
    subgraph "CI/CD Pipeline"
        GH[GitHub Repository]
        Actions[GitHub Actions]
        Build[Build Process]
        Test[Testing]
        Static[Static Analysis]
    end
    
    subgraph "Deployment Environments"
        subgraph "Development"
            DevDeploy[Development Deployment]
            DevDB[(Dev Database)]
        end
        
        subgraph "Staging"
            StageDeploy[Staging Deployment]
            StageDB[(Staging Database)]
        end
        
        subgraph "Production"
            BlueEnv[Blue Environment]
            GreenEnv[Green Environment]
            ProdDB[(Production Database)]
            CDN[CDN]
            LoadBalancer{Load Balancer}
        end
    end
    
    GH --> Actions
    Actions --> Build
    Build --> Test
    Test --> Static
    
    Static --> DevDeploy
    DevDeploy --> DevDB
    
    DevDeploy -- "Promotion" --> StageDeploy
    StageDeploy --> StageDB
    
    StageDeploy -- "Promotion" --> BlueEnv & GreenEnv
    BlueEnv & GreenEnv --> ProdDB
    
    LoadBalancer --> BlueEnv
    LoadBalancer --> GreenEnv
    BlueEnv & GreenEnv --> CDN
    
    classDef env fill:#59b353,color:white;
    classDef db fill:#3178c6,color:white;
    class DevDeploy,StageDeploy,BlueEnv,GreenEnv env;
    class DevDB,StageDB,ProdDB db;
```

## Feature Toggle Architecture

```mermaid
graph TD
    subgraph "Feature Toggle System"
        ToggleConfig[Toggle Configuration]
        ToggleService[Feature Toggle Service]
        ToggleAPI[Toggle Management API]
        ToggleUI[Toggle Dashboard UI]
    end
    
    subgraph "Application"
        Components[UI Components]
        Routes[Application Routes]
        API[API Endpoints]
    end
    
    subgraph "Configuration Sources"
        EnvVars[Environment Variables]
        RemoteConfig[Remote Configuration]
        Database[(Database Settings)]
    end
    
    EnvVars --> ToggleConfig
    RemoteConfig --> ToggleConfig
    Database --> ToggleConfig
    
    ToggleConfig --> ToggleService
    ToggleService --> Components
    ToggleService --> Routes
    ToggleService --> API
    
    ToggleAPI --> ToggleService
    ToggleUI --> ToggleAPI
    
    classDef config fill:#ff9900,color:white;
    classDef app fill:#59b353,color:white;
    class ToggleConfig,ToggleService,ToggleAPI,ToggleUI config;
    class Components,Routes,API app;
```

## Rollback Strategy

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant CI as CI/CD Pipeline
    participant LB as Load Balancer
    participant Blue as Blue Environment
    participant Green as Green Environment
    participant DB as Database
    
    Note over Blue,Green: Active-Passive Blue/Green Deployment
    
    Dev->>CI: Push code changes
    CI->>CI: Build & test
    CI->>Green: Deploy to inactive environment (Green)
    Note over Green: Run smoke tests
    Green->>Green: Smoke tests pass
    
    Green->>LB: Update routing
    LB->>Green: Route 10% traffic
    Note over Green: Monitor for errors
    
    alt If issues detected
        LB->>Blue: Revert 100% to Blue (active)
        Green->>Green: Diagnose & fix
    else If no issues
        LB->>Green: Gradually increase traffic
        LB->>Green: 100% traffic to Green
        Blue->>Blue: Now becomes inactive
    end
    
    Note over Blue,Green: Blue & Green have now swapped roles
```

## Database Schema

```mermaid
erDiagram
    User {
        string id PK
        string name
        string email
        string role
        datetime createdAt
        datetime updatedAt
    }
    
    Client {
        string id PK
        string name
        string industry
        string contactName
        string contactEmail
        string contactPhone
        datetime createdAt
        datetime updatedAt
    }
    
    Engagement {
        string id PK
        string name
        string description
        string clientId FK
        string status
        date startDate
        date endDate
        datetime createdAt
        datetime updatedAt
    }
    
    Team {
        string id PK
        string name
        string description
        datetime createdAt
        datetime updatedAt
    }
    
    TeamMember {
        string id PK
        string userId FK
        string teamId FK
        string role
        datetime createdAt
        datetime updatedAt
    }
    
    EngagementTeam {
        string id PK
        string engagementId FK
        string teamMemberId FK
        string role
        date startDate
        date endDate
        datetime createdAt
        datetime updatedAt
    }
    
    Objective {
        string id PK
        string title
        string description
        string engagementId FK
        string ownerId FK
        string status
        string quarter
        datetime createdAt
        datetime updatedAt
    }
    
    KeyResult {
        string id PK
        string title
        string description
        string objectiveId FK
        string ownerId FK
        number target
        number current
        string status
        datetime createdAt
        datetime updatedAt
    }
    
    SuccessMetric {
        string id PK
        string name
        string description
        string engagementId FK
        string format
        number target
        number current
        datetime createdAt
        datetime updatedAt
    }
    
    RagStatus {
        string id PK
        string entity
        string entityId FK
        string status
        string comment
        string updatedBy FK
        datetime createdAt
        datetime updatedAt
    }
    
    Meeting {
        string id PK
        string title
        string description
        string engagementId FK
        string meetingTypeId FK
        datetime scheduledAt
        datetime createdAt
        datetime updatedAt
    }
    
    MeetingType {
        string id PK
        string name
        string description
        string cadence
        datetime createdAt
        datetime updatedAt
    }
    
    AgendaItem {
        string id PK
        string title
        string description
        string meetingId FK
        string ownerId FK
        number duration
        string status
        datetime createdAt
        datetime updatedAt
    }
    
    StakeholderMapping {
        string id PK
        string engagementId FK
        string name
        string role
        string influence
        string interest
        string strategy
        datetime createdAt
        datetime updatedAt
    }
    
    Notice {
        string id PK
        string title
        string content
        string priority
        boolean isRead
        datetime createdAt
        datetime updatedAt
    }
    
    Document {
        string id PK
        string name
        string filepath
        string entityType
        string entityId FK
        string uploadedBy FK
        datetime createdAt
        datetime updatedAt
    }
    
    FeatureToggle {
        string id PK
        string name
        string description
        boolean enabled
        string scope
        datetime createdAt
        datetime updatedAt
    }
    
    Client ||--o{ Engagement : "has"
    Engagement ||--o{ EngagementTeam : "has"
    Team ||--o{ TeamMember : "includes"
    User ||--o{ TeamMember : "is"
    TeamMember ||--o{ EngagementTeam : "assigned to"
    Engagement ||--o{ Objective : "has"
    Objective ||--o{ KeyResult : "has"
    User ||--o{ Objective : "owns"
    User ||--o{ KeyResult : "owns"
    Engagement ||--o{ SuccessMetric : "tracks"
    User ||--o{ RagStatus : "updates"
    Engagement ||--o{ Meeting : "schedules"
    MeetingType ||--o{ Meeting : "categorizes"
    Meeting ||--o{ AgendaItem : "contains"
    User ||--o{ AgendaItem : "owns"
    Engagement ||--o{ StakeholderMapping : "maps"
    User ||--o{ Document : "uploads"
    Client ||--o{ Document : "has"
    Engagement ||--o{ Document : "has"
```

## Component Architecture

```mermaid
graph TD
    subgraph "Core Components"
        Layout[Layout]
        Card[Card]
        Button[Button]
        Badge[Badge]
        ProgressBar[ProgressBar]
        StatusBadge[StatusBadge]
    end

    subgraph "Feature Components"
        SuccessMetrics[Success Metrics Card]
        EnhancedObjective[Enhanced Objective Card]
        StatusTracker[RAG Status Tracker]
        NoticeBoard[Notice Board]
        MeetingAgenda[Meeting Agenda Builder]
        StakeholderMapping[Stakeholder Mapping Table]
        MeetingType[Meeting Type Selector]
    end

    subgraph "Pages"
        Dashboard[Dashboard]
        Clients[Clients]
        ClientDetail[Client Detail]
        Engagements[Engagements]
        EngagementDetail[Engagement Detail]
        OKRs[OKRs]
        Team[Team]
        Reports[Reports]
    end

    Layout --> Pages
    Card --> FeatureComponents
    Button --> FeatureComponents
    Badge --> FeatureComponents
    ProgressBar --> FeatureComponents
    StatusBadge --> FeatureComponents
    
    SuccessMetrics --> EngagementDetail
    EnhancedObjective --> OKRs
    EnhancedObjective --> EngagementDetail
    StatusTracker --> EngagementDetail
    NoticeBoard --> Dashboard
    MeetingAgenda --> EngagementDetail
    StakeholderMapping --> ClientDetail
    MeetingType --> EngagementDetail
```

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant UI as UI Components
    participant API as Next.js API
    participant DB as PostgreSQL
    
    User->>UI: Interacts with application
    UI->>API: Makes API request
    API->>DB: Database query/mutation
    DB->>API: Return data
    API->>UI: Return API response
    UI->>User: Display updated UI
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant App as CR Engagement Hub
    participant Auth as NextAuth.js
    participant DB as Database
    
    User->>App: Access protected route
    App->>Auth: Check authentication
    Auth->>DB: Verify session
    
    alt User authenticated
        DB->>Auth: Valid session
        Auth->>App: Allow access
        App->>User: Display protected content
    else User not authenticated
        DB->>Auth: No valid session
        Auth->>App: Deny access
        App->>User: Redirect to login page
        User->>App: Enter credentials
        App->>Auth: Validate credentials
        Auth->>DB: Check credentials
        DB->>Auth: Valid credentials
        Auth->>DB: Create session
        Auth->>App: Authentication successful
        App->>User: Redirect to protected route
    end
```

## Page Navigation Structure

```mermaid
flowchart TD
    Dashboard[Dashboard] --> Clients[Clients]
    Dashboard --> Engagements[Engagements]
    Dashboard --> Team[Team Management]
    Dashboard --> OKRs[OKR Tracking]
    Dashboard --> Reports[Reports]
    Dashboard --> Governance[Governance]
    Dashboard --> Metrics[Success Metrics]
    Dashboard --> Status[RAG Status]
    Dashboard --> Notices[Notice Board]
    
    Clients --> ClientDetail[Client Detail]
    ClientDetail --> ClientEngagements[Client Engagements]
    ClientDetail --> ClientContacts[Client Contacts]
    ClientDetail --> ClientDocuments[Client Documents]
    ClientDetail --> ClientNotes[Client Notes]
    
    Engagements --> EngagementDetail[Engagement Detail]
    EngagementDetail --> EngagementOverview[Overview]
    EngagementDetail --> EngagementTeam[Team]
    EngagementDetail --> EngagementMetrics[Metrics]
    EngagementDetail --> EngagementObjectives[Objectives]
    EngagementDetail --> EngagementDocuments[Documents]
    
    Team --> TeamMemberDetail[Team Member Detail]
    
    OKRs --> ObjectiveDetail[Objective Detail]
    
    Reports --> ReportDetail[Report Detail]
``` 