# API Endpoints

Base: /api

- GET /api/health - simple health check
- GET /api/money/cashflow - list cash entries
- POST /api/money/cashflow - create cash entry (body: { type, amount, category, note })
- GET /api/money/obligations - list obligations
- POST /api/money/obligations - create obligation (body: { counterparty, amount, dueDate })
- GET /api/money/reports?range=day|week|month|year - aggregated totals

Flow: route.ts → controller → service → prisma client
