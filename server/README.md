# Sweet Shop API (Express + MongoDB)

TypeScript/Express API for managing sweets with authentication, inventory, Atlas Search, Redis caching/rate limiting, and secure defaults.

## Tech Stack

- Node.js, TypeScript, Express 5
- MongoDB with Mongoose (text index + Atlas Search aggregation)
- Redis (ioredis) for caching and rate limiting
- Auth with JWT + bcrypt
- Validation with Zod
- Security middleware: helmet, hpp, CORS, compression, morgan logging
- Testing: Vitest + Supertest, mongodb-memory-server, ioredis-mock

## AI Usage

- Used AI for initial boilerplate and folder structure guidance, to refine early tests, and to draft this README.
- GitHub Copilot auto-completed code and variable names while typing.
- Core logic (sessions and transactions, security middleware choices, optimizations, and domain logic) is authored manually; roughly 80% of logic is original and 20% is assisted by tooling for scaffolding/completions and documentation.

## Getting Started (Backend)

Prerequisites:

- Node.js 18+ and npm
- MongoDB instance (local or Atlas)
- Redis instance (local or remote)

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

- Copy `.env.example` to `.env` and set:
  - `PORT`: API port (default 3000)
  - `MONGODB_URI`: Mongo connection string
  - `REDIS_URL`: Redis connection string
  - `JWT_SECRET`: strong signing key
  - `JWT_EXPIRES_IN`: token TTL (e.g., `1d`)
  - `FRONTEND_URL`: allowed origin for CORS
  - Optional: `RATE_LIMIT_WINDOW_SECONDS`, `RATE_LIMIT_MAX_REQUESTS`

Atlas Search:

- Create an Atlas Search index named `sweet-search` on the `sweets` collection. You can run this in the Atlas Data Explorer or `mongosh`:

```javascript
db['sweets'].runCommand({
  createSearchIndexes: 'sweets',
  indexes: [
    {
      name: 'sweet-search',
      definition: {
        mappings: {
          dynamic: false,
          fields: {
            name: { type: 'string' },
            category: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            stock: { type: 'number' },
          },
        },
      },
    },
  ],
});
```

Mongo indexes:

- Models define indexes (unique email on users; text index on sweets). After connecting, Mongoose will build them; you can also ensure them manually with MongoDB tools.

3. Build (TypeScript -> dist):

```bash
npm run build
```

4. Run locally:

```bash
# dev-ish (manual rebuild on change)
npm run dev

# production-style (build + run)
npm start
```

API listens on `http://localhost:<PORT>` and mounts routes under `/api`.

5. Run tests:

```bash
npm test
```

Tests use in-memory MongoDB and mocked Redis; no external services required.

## Frontend Notes

This repo only contains the backend. To run a frontend locally:

- Start the backend (steps above).
- Configure the frontend to point to `http://localhost:<PORT>/api`.
- Current client consumes:
  - `GET /api/sweets` and `GET /api/sweets/search` for listing.
  - `GET /api/sweets/:id` for detail modal data.
  - `POST /api/sweets/:id/purchase` for the purchase flow.
  - Admin: `POST /api/sweets`, `PUT /api/sweets/:id`, `DELETE /api/sweets/:id`, and `POST /api/sweets/:id/restock` for CRUD + restock.
- Ensure `FRONTEND_URL` in `.env` matches the frontend origin so CORS passes.

## Key Features & Performance/Security Notes

- Helmet + HPP + CORS + compression + morgan applied globally.
- Redis-backed rate limiting with window controls (`RATE_LIMIT_*` envs).
- Redis caching for sweet listings and searches with automatic cache invalidation on mutations.
- MongoDB transaction/session for purchases to maintain stock consistency.
- Atlas Search aggregation for ranked search (`sweet-search` index) plus text index on the model.
- Unique email index; JWT auth + role-based admin guard for protected routes.
- Input validation via Zod for bodies and queries; centralized error handling.

## Scripts Reference

- `npm run build` - type-check and emit JS to `dist/`.
- `npm run dev` - build then run compiled server.
- `npm start` - build then run (use for production).
- `npm test` - run Vitest suite.
