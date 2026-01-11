# ETO - Eleven to One (Next.js + TypeScript)

A production-ready scaffold for a money management and service distribution platform (ETO).

## Features
- Next.js (App Router) + TypeScript
- Tailwind CSS, mobile-first + dark mode
- ESLint + Prettier
- PostgreSQL with Prisma ORM
- API architecture: Route → Controller → Service → DB
- Glassmorphism reusable UI components

---

## Setup
1. Copy `.env.example` to `.env.local` and set `DATABASE_URL`.
2. Install dependencies:

   npm install

3. Generate Prisma client and run migrations:

   npx prisma generate
   npx prisma migrate dev --name init

4. Run dev server:

   npm run dev

---

## Folder structure (high-level)

- `app/` - Next.js app router pages and API route entrypoints (`app/api/*/route.ts`)
  - `(agent)/` - agent-facing pages
  - `(admin)/` - admin-facing pages
- `api/` - Controllers and Services (Route → Controller → Service → DB)
- `components/ui/` - Reusable glassmorphism components (Button, Card, Table, Input, Modal, Select)
- `components/money/` - Money-specific components (CashEntryForm, TransactionTable, ObligationCard, LendingCard)
- `lib/` - Prisma client and helpers
- `services/` - Higher-level business logic
- `prisma/schema.prisma` - Database models (CashEntry, Obligation, Lending)

---

## API flow (Route → Controller → Service → DB)
- `app/api/money/cashflow/route.ts` → `api/money/cashflow/cashflow.controller.ts` → `api/money/cashflow/cashflow.service.ts` → `lib/prisma.ts`
- Controllers handle input validation and mapping
- Services contain business validations and call Prisma client

---

## Glassmorphism UI
- Use components in `components/ui` only. They are props-driven and theme-ready.
- Use `.glass` utility (in `globals.css`) for frosted backgrounds, rounded corners, and subtle shadows.

---

## Next steps
- Add authentication, more extensive validation and tests
- Add migrations and seed data for sample accounts and entries
- Expand reports endpoints and client-side charts

---

For details on file-level implementation, open the `api/`, `app/` and `components/` folders.
