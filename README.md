# ZPanel

ZPanel (Zeta Panel), is a self-hosted admin panel for managing data, behavior, and content across my side projects. It provides an intuitive dashboard, API service, and a shared core library to streamline development.

## Features

- 🏭 **Admin Dashboard**: Built with Next.js for managing projects.

- 🌐 **API Service**: A Nest.js backend handling business logic.

- 🌱 **Shared Core Package**: Provides type definitions, Zod validation schemas, and DTOs.

- ⚡ **Monorepo Structure**: Managed with PNPM for better modularity.

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Material UI, React Hook Form

- **Backend**: Nest.js, TypeScript, Prisma

- **Package Management**: PNPM Monorepo

- **Database**: PostgreSQL

- **Deployment**: GitHub Workflows, Vercel

- **Other Tools**: AWS S3, Zod

## Monorepo Structure
```bash
ZPanel/
├── apps/
│   ├── admin/ # Next.js front end
│   └── service/ # Nest.js back end
├── packages/
│   └── core/ # Shared types, DTOs, and validation schemas
├── .env # environment variables
├── .env.example # Example environment variables
├── package.json # PNPM workspace configuration
├── .github/workflows # GitHub action configs
└── .vscode/
    └── zpanel.code-workspace # workspace setting for Vscode
```

## Installation & Setup
### Prerequisites
- Node.js 22.14.0
- PNPM installed (`npm install -g pnpm`)

### Setup
```sh
# SSH 
git clone git@github.com:zdd997106/zpanel.git # or run `git clone https://github.com/zdd997106/zpanel.git` for HTTP

cd zpanel
pnpm install
```

## Running Locally

- Back end

```sh
# Prepare Prisma Client interfaces
pnpm service generate # or run `pnpm service db:update` to update to database

# Run backend
pnpm service dev
```

- Front end

```sh
# Run front end
pnpm admin dev
```

- Others

```sh
# Update shared interfaces, schema, and data
pnpm core build # or rebuild with replacement run `pnpm core build:update`
```
