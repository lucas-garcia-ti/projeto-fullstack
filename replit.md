# Running the imported inventory project

The existing stack is Express with SQLite in the repository root and React/Vite in `frontend/`. Keep this layout and stack.

## Install dependencies

- Root: `npm ci`
- Frontend: `npm --prefix frontend ci`

## Run on Replit

The Run workflows start:

- **Backend API**: `npm start`, Express on port 3000.
- **Frontend**: `npm --prefix frontend run dev`, Vite on `0.0.0.0:5000`.

Open the frontend in Preview. Its relative `/api/*` requests are proxied by Vite to the backend, so browser requests do not depend on localhost or a hardcoded Replit domain.

No external services or secrets are required. SQLite creates `src/database.sqlite` on first startup; this file is ignored by Git. Keep it to preserve local development records.

## Checks

- `npm --prefix frontend run build`
- `npm --prefix frontend run lint`

The root `npm test` is the imported placeholder and is not a working test suite.

This is a development setup, not a production deployment configuration. The existing app has no sign-in or access controls; do not expose sensitive inventory data publicly.