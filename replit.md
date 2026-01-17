# Pócima Salvage

## Overview
A medical reference application built with Expo (React Native for web) and an Express.js backend using tRPC. The app provides information about diseases (enfermedades) and medicinal plants (plantas).

## Tech Stack
- **Frontend**: Expo (React Native Web) on port 5000
- **Backend**: Express.js with tRPC on port 3000
- **Database**: PostgreSQL (Drizzle ORM)
- **Package Manager**: pnpm

## Project Structure
```
├── app/              # Expo Router pages
│   ├── (tabs)/       # Tab navigation screens
│   ├── oauth/        # OAuth callback handlers
│   └── _layout.tsx   # Root layout
├── components/       # Reusable React components
├── constants/        # App constants and OAuth config
├── data/             # Static data files (medicinal plants, diseases)
├── drizzle/          # Database schema and migrations
├── hooks/            # Custom React hooks
├── lib/              # Utility libraries (tRPC client, auth)
├── server/           # Backend server code
│   └── _core/        # Core server infrastructure
├── shared/           # Shared types and constants
└── scripts/          # Build and utility scripts
```

## Running the App
```bash
pnpm dev          # Start both server and frontend
pnpm dev:server   # Start only the API server
pnpm dev:metro    # Start only the Expo web frontend
```

## Database
- Uses PostgreSQL via Drizzle ORM
- Run migrations: `pnpm db:push`
- Schema in `drizzle/schema.ts`

## Environment Variables
Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for session tokens
- OAuth-related variables for authentication (optional)

## Recent Changes
- Converted from MySQL to PostgreSQL for Replit compatibility
- Configured Expo to run on port 5000 for Replit proxy support
- API server runs on port 3000
