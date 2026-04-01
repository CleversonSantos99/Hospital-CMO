# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hospital-CMO is a React + TypeScript SPA for hospital staff to manage specialties (`especialidade`) and procedures (`procedimentos`). The UI is in Portuguese. Backend is a custom REST API (with Supabase as the database layer via Deno Edge Functions).

## Commands

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run lint       # ESLint
npm run typecheck  # Type-check without emitting (tsconfig.app.json)
npm run preview    # Preview production build
```

There are no tests configured.

## Architecture

### Auth & Session Flow

[src/App.tsx](src/App.tsx) bootstraps the app. On mount it calls `apiClient.isAuthenticated()` (a localStorage check) and listens for the `auth:logout` custom event. Authenticated users see `Dashboard`; unauthenticated users see `AuthForm`.

Session is stored in localStorage under the key `cmo_session` as `{ token, refreshToken, expiresAt }`. On every API call, `ApiClient.refreshIfNeeded()` auto-refreshes the token 60 s before expiry via `POST /api/auth/refresh`. A 401 response clears the session and dispatches `auth:logout`.

### Frontend → Backend

All data operations go through [src/lib/api.ts](src/lib/api.ts) (`ApiClient` class, exported as `apiClient` singleton). It calls a **custom REST backend** at `VITE_API_URL` (defaults to `http://localhost:3001`) — not Supabase directly.

Supported operations: `login`, `signOut`, `getEspecialidades`, `getProcedimentos`, `getLeads`, `getAgendamentos`, `updateEspecialidade(id, payload)`, `updateProcedimento(id, payload)`. Delete and create are not yet implemented (the UI shows an alert stub).

[src/lib/supabaseClient.ts](src/lib/supabaseClient.ts) exists and exports a `supabase` client (initialized from `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`), but it is **not used by `api.ts`**. It is available for future direct-Supabase use.

### Edge Functions (Deno)

These exist in `supabase/functions/` and implement the REST API that the frontend calls.

- `supabase/functions/data/index.ts` — REST API for GET/PUT on `especialidade`, `procedimentos`, `leads`, `agendamentos`. Verifies JWT manually (decode + expiry check) and uses the service role key for DB access.
- `supabase/functions/auth/index.ts` — signup/signin/signout/refresh via Supabase Admin API.

### UI Components

- [src/components/Dashboard.tsx](src/components/Dashboard.tsx) — tab layout (`Especialidades` / `Procedimentos`), sign-out
- [src/components/TableEditor.tsx](src/components/TableEditor.tsx) — generic paginated table with inline edit modal. Accepts `tableName` and a `columns` config array. **Pagination is client-side**: all records are fetched then sliced in memory. Renders as cards on mobile (`block lg:hidden`), table on desktop (`hidden lg:block`).
- [src/components/AuthForm.tsx](src/components/AuthForm.tsx) — login form; calls `apiClient.login()` then `window.location.reload()` on success.

### Database

DB table name is `especialidade` (singular) — not `especialidades`. Other tables: `procedimentos`, `leads`, `agendamentos`, `convenios`, and several `n8n_*` tables (chatbot integration). RLS is enabled on all tables — authenticated users get SELECT/UPDATE access to catalog tables; `n8n_*` tables are SELECT-public for webhook access.

## Environment Variables

```
VITE_API_URL=          # REST backend base URL (defaults to http://localhost:3001)
VITE_SUPABASE_URL=     # Required by supabaseClient.ts
VITE_SUPABASE_ANON_KEY=
```

Note: `vite-env.d.ts` currently only declares `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` — add `VITE_API_URL` there if strict typing is needed.

Edge functions additionally need `SUPABASE_SERVICE_ROLE_KEY` (set in Supabase dashboard, not in `.env`).
