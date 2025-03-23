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