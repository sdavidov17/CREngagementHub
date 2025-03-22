# CR Engagement Hub

A comprehensive Team and Capacity Management application that allows delivery leads and engagement leads to manage team rosters, track OKRs, schedule meetings, and generate reports.

## Features

- **Team and Capacity Management**: Create and maintain team rosters, track skills and availability, visualize team allocations
- **OKR Tracking**: Set quarterly objectives and key results, monitor progress, link deliverables
- **Meeting Management**: Schedule recurring meetings, track attendance, record action items
- **Client and Engagement Overview**: View engagement health and metrics across clients
- **Reporting**: Generate progress reports, export data for presentations

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
│   │   ├── (auth)/           # Authentication pages
│   │   ├── dashboard/        # Dashboard and authenticated pages
│   ├── components/           # Reusable components
│   ├── lib/                  # Utility functions and services
│   ├── types/                # TypeScript type definitions
├── prisma/                   # Prisma schema and migrations
│   ├── schema.prisma         # Database schema
│   ├── seed.ts               # Seed script
├── public/                   # Static assets
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

TODO: Add testing instructions

## Deployment

TODO: Add deployment instructions

## License

This project is licensed under the MIT License - see the LICENSE file for details.
