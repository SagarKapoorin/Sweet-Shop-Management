# Sweet Shop Frontend (React + Vite)

Responsive React/TypeScript UI for browsing, purchasing, and administering sweets. Includes protected admin flows, detail modal with server-backed data, and inline stock management.

## Tech Stack

- Vite + React 19 + TypeScript
- Tailwind CSS for styling (via `@tailwindcss/vite`)
- React Router 7
- Axios client (`src/api/axios.ts`) pointing at `VITE_API_BASE_URL` (defaults to `http://localhost:3000/api`)
- React Hot Toast for notifications
- Testing: Vitest + React Testing Library + jsdom

## AI Usage

- Used AI to bootstrap UI layout, detail modal, and restock flow, and to draft this README.
- GitHub Copilot assisted with small completions (props, hooks).
- All component logic, API wiring, and behaviors (purchase, admin CRUD/restock, detail fetch) were authored manually and reviewed; ~80% manual, ~20% assisted boilerplate/docs.

## Getting Started (Frontend)

Prerequisites:

- Node.js 18+ and npm
- Backend running at the API base URL in your `.env` (defaults to `http://localhost:3000/api`)

1) Install dependencies:

```bash
npm install
```

2) Run dev server:

```bash
npm run dev
```

App serves at the Vite URL (default `http://localhost:5173`). Backend must be running for API calls.

3) Build for production:

```bash
npm run build
```

4) Preview production build:

```bash
npm run preview
```

5) Lint / format / test:

```bash
npm run lint
npm run format    # check
npm run format:fix
npm test
```

## Features & Flows

- Public browse with search/filter (name, category, price range).
- Sweet detail modal fetches `/sweets/:id` when a card is activated.
- Purchase flow for authenticated users with quantity validation.
- Admin: create/edit/delete sweets, restock via `/sweets/:id/restock`, add sweets from nav.
- Auth context persists token/user in `localStorage`, provides logout and guards `/admin`.

## Notes

- API base URL comes from `VITE_API_BASE_URL` in `.env` (fallback `http://localhost:3000/api`).
- Tailwind styles rely on the Vite plugin (no `tailwind.config.js` needed in v4).
- Tests run in jsdom; see `src/components/__tests__` for examples.
