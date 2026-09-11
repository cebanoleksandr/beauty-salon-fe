# Beauty Salon — Frontend

A React + TypeScript SPA for a beauty salon booking platform. Clients discover salons and book
appointments, masters manage their schedule and bookings, and salon owners manage their salons,
services and staff.

## Tech stack

- **React 19** + **TypeScript**, built with **Vite**
- **React Router** for routing, with role-based route guards
- **TanStack Query** for server state (fetching, caching, mutations)
- **Redux Toolkit** for lightweight client-only UI state (e.g. global alerts)
- **MUI** for form controls/buttons and **Tailwind CSS** for layout/styling
- **react-i18next** for localization (`en`, `uk`, `pl`, `es`)
- **Leaflet** / **react-leaflet** for maps (nearby salons, picking a salon's location)
- **Axios** for HTTP, **React Hook Form** + **Yup** for form validation

## Getting started

```bash
npm install
npm run dev
```

The app expects a backend API. Configure its base URL via an environment variable:

```bash
# .env
VITE_API_URL=http://localhost:3000
```

If `VITE_API_URL` is not set, it defaults to `http://localhost:3000/api`.

### Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check (`tsc -b`) and build for production
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint

## User roles

The app has four roles (`src/types/api.ts` → `UserRole`), each with its own navigation
(`src/components/layouts/nav/`) and route access (`src/routing/guards/RequireRole.tsx`):

- **CLIENT** — browse/search salons, book appointments, manage own bookings, notifications.
- **MASTER** — dashboard with upcoming bookings (confirm/complete/cancel), manage own services,
  working hours & blocked time, and salon join requests.
- **SALON_OWNER** — manage owned salons (details, location, services), review masters' join
  requests.
- **ADMIN** — currently limited to browsing salons.

`HomePage` (`/`) redirects masters and salon owners to their respective dashboards; clients see a
personalized landing page with upcoming bookings and a link to browse salons.

## Project structure

```
src/
  components/       Shared UI: layouts & role-based nav, popups, salon widgets (map, search)
  hooks/            Small reusable hooks (e.g. geolocation)
  i18n/             i18next setup
  network/
    hooks/          React Query hooks, one file per domain (bookings, salons, services, ...)
    _types/         Query key constants (EQueries)
  pages/            Route-level page components, grouped by domain
  routing/          Router config and role/auth guards
  services/         Axios-based API clients, one per backend resource
  store/            Redux Toolkit store (UI-only state, e.g. alerts)
  types/            Shared API types (api.ts) matching backend DTOs/entities
public/
  locales/          Translation files: en, uk, pl, es
```

## Conventions

- **Data fetching**: each backend resource has a `services/<resource>.service.ts` (plain Axios
  calls) and a matching `network/hooks/use<Resource>.ts` (React Query wrappers). Pages only import
  hooks, never services directly.
- **Styling**: Tailwind utility classes for layout/spacing (`bg-white rounded-xl shadow-sm p-4`
  card pattern is used throughout), MUI components for interactive form controls.
- **i18n**: every user-facing string goes through `useTranslation()` / `t(...)`; keys are added to
  all four locale files under `public/locales/*/translation.json`.
- **Confirmations**: destructive actions (delete salon, delete service, etc.) go through the
  shared `ConfirmPopup` component (`src/components/popups/`), not `window.confirm`.
