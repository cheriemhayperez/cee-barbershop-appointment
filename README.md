# Cee Barbershop
Barbershop site with a customer front and an admin panel.

## Setup

```bash
npm install
cp .env.example .env.local
npm start
```

Dev server: http://localhost:6001

## Routes
**Customer**
- `/` — home
- `/book` — booking

**Admin**
- `/admin` — dashboard
- `/admin/appointments`
- `/admin/barbers`
- `/admin/services`
- `/admin/customers`
- `/admin/settings`
- `/admin/settings/schedule` — hours, blocked dates, slot toggles

## Project notes

- Pages live in `src/pages/`
- Logic in `src/hooks/` (admin hooks use `useAdmin*` naming)
- Shared UI is `CB*` components in `src/components/` — use those in admin instead of importing antd directly
- Icons: `iconsax-react`
- Imports use the `@/` alias (`@/` → `src/`), configured in `vite.config.js` and `tsconfig.json`

### Redux 

Admin CRUD state lives in Redux Toolkit slices under `src/reducers/`:

- `appointments`, `barbers`, `customers`, `services`

## Env

Uses `VITE_` prefix. Copy from `.env.example`.

- `.env.local` — local secrets (gitignored; loaded in all modes)
- `.env.deploy` — deploy/staging build (`npm run build:deploy`)

Supabase vars optional unless you need booking emails.

## Scripts

- `npm start` — local dev server
- `npm run start:deploy` — dev server with deploy env
- `npm run build` — production build (uses `.env.local` overrides when present)
- `npm run build:deploy` — build with `.env.deploy`
- `npm run lint` — ESLint
- `npm run test` — Vitest unit tests
- `npm run typecheck` — TypeScript check
