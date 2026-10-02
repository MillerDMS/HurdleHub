# HurdleHub

HurdleHub is a full-stack issue tracker for organizing software projects, tracking development tasks, and monitoring project progress.

Built as a portfolio project to explore full-stack development with Next.js, PostgreSQL, Prisma, TypeScript, and server-side application architecture.

## Demo

The easiest way to try HurdleHub is through the live application:

**https://hurdle-hub.vercel.app**

No account or local setup is required.

The instructions below are only needed if you want to run the project locally.

## Features

### Project Management

- Create, edit, and delete projects
- View project-level issue statistics
- Track completion progress
- Cascade project deletion to related issues

### Issue Tracking

- Create, edit, and delete issues
- Permanent project-specific issue numbers
- Statuses: Open, In Progress, and Done
- Priorities: Low, Medium, and High
- Search issues by title
- Filter issues by status and priority

### Issue Archiving

- Completed issues can be archived
- Archived issues are separated from active work
- Archived issues become read-only
- Issues can be restored to the active list
- Issue numbers are never reused

### Dashboard

- Total project count
- Active issue count
- Open issue count
- Completed issue count
- Per-project completion indicators

### Anonymous Workspace Isolation

HurdleHub creates an isolated workspace for each visitor using a secure random browser token.

The raw token is stored in an HTTP-only cookie while only its SHA-256 hash is stored in PostgreSQL.

All project and issue operations are scoped to the current workspace, preventing one anonymous visitor from accessing another visitor's data even if a project or issue ID is known.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI:** React + Tailwind CSS
- **Database:** PostgreSQL
- **ORM:** Prisma 7
- **Validation:** Zod
- **Mutations:** Next.js Server Actions
- **Local Database:** PostgreSQL 18 with Docker
- **Production Database:** Neon PostgreSQL
- **Deployment:** Vercel

## Architecture

HurdleHub uses Next.js Server Components for data-driven pages and Client Components where browser-side interactivity is required, such as issue filtering and confirmation controls.

Database mutations are implemented with Server Actions. Input is validated with Zod before database operations are performed.

Prisma provides the application's database layer, with PostgreSQL enforcing relationships and constraints.

Issue numbers are generated per project inside database transactions to provide stable identifiers such as:

```text
#1
#2
#3
```

Deleting or archiving an issue does not cause its number to be reused.

## Data Model

The application is centered around three primary models:

```text
Workspace
└── Project
    └── Issue
```

A workspace owns projects, and each project owns its issues.

Projects maintain their own issue-number counter, while issues store their project-specific number separately from their internal database ID.

## Local Development

### Prerequisites

Install:

- Node.js
- npm
- Docker Desktop

### 1. Clone the repository

```bash
git clone https://github.com/MillerDMS/hurdlehub.git
cd hurdlehub
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the database

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://devtrack:devtrack_dev_password@localhost:5434/devtrack?schema=public"
```

These credentials are for the local Docker development database defined by the project. Production credentials are not stored in the repository.

### 4. Start PostgreSQL

Make sure Docker Desktop is running, then:

```bash
docker compose up -d
```

### 5. Apply database migrations

```bash
npx prisma migrate deploy
```

### 6. Generate the Prisma client

```bash
npx prisma generate
```

### 7. Start the development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Useful Commands

```bash
# Start local PostgreSQL
docker compose up -d

# Stop local PostgreSQL
docker compose down

# Validate the Prisma schema
npx prisma validate

# Generate Prisma Client
npx prisma generate

# Check migration status
npx prisma migrate status

# Open Prisma Studio
npx prisma studio

# Create a production build
npm run build
```

## Production

HurdleHub is deployed on Vercel and uses a managed PostgreSQL database hosted on Neon.

Production database credentials are supplied through environment variables and are never committed to the repository.

Database schema changes are tracked and deployed through Prisma migrations.

## What I Practiced

Building HurdleHub involved working with:

- Relational database modeling
- PostgreSQL migrations and constraints
- Transactional database operations
- Server and Client Components
- Server Actions
- Input validation
- Anonymous session design
- Authorization at the data-access layer
- CRUD application architecture
- Responsive UI design
- Docker-based local development
- Production environment configuration
- Cloud database deployment

## Future Improvements

Potential extensions include:

- User authentication
- Persistent accounts
- Team workspaces
- Issue comments
- Assignees
- Labels and tags
- Due dates
- Activity history

## License

This project was created as a portfolio and learning project.