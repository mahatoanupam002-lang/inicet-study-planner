# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### NEET PG Study Planner (`artifacts/neet-pg-planner`)
- **Type**: React + Vite frontend-only app (no backend)
- **Preview Path**: `/`
- **Purpose**: 28-day INI-CET/NEET PG exam study planner for May 16, 2026
- **Features**: Live countdown, 28-day grid, subject filter, detailed day cards (Topics/India/Images/MCQ/Notes tabs), daily schedule, personal notes — all persisted via localStorage
- **Data**: All 28 days of schedule data embedded in App.tsx (no API)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## GitHub Push
The user wants to push this project to GitHub. The Replit GitHub OAuth integration was dismissed. To proceed, either:
1. Re-initiate the GitHub integration via the OAuth flow
2. Or ask the user for a GitHub Personal Access Token (classic, `repo` scope) and store it as a secret (GITHUB_TOKEN), then use git commands to push
