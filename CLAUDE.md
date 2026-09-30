# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Talent-show app for BSA Winterfest. Contestants register, a stage manager marks who has performed, judges score acts, and a live leaderboard and waitlist display update in real time.

It runs in a Docker Compose stack on a homelab, behind the owner's reverse proxy (which terminates TLS), on a public domain so outside users can register and watch the leaderboard. Registration, `/waitlist` and `/leaderboard` are public; `/judge`, `/stage` and `/admin` require a login.

## Commands

```sh
npm run dev           # vite dev server
npm run build         # production build (adapter-node -> ./build, run with `node build`)
npm run check         # svelte-kit sync + svelte-check (type check)
npm run lint          # prettier --check . && eslint .
npm run format        # prettier --write .

npm run db:start      # docker compose up -d (local Postgres on :5432)
npm run db:push       # push schema directly to DB (dev)
npm run db:generate   # generate a migration in ./drizzle
npm run db:migrate    # apply migrations
npm run db:studio
npm run auth:create-admin -- --email you@example.com --name "Name" --password "10+ chars"   # first admin
```

There is no test suite. Copy `.env.example` to `.env` for `DATABASE_URL`, `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL`; `src/lib/server/db/index.ts` and `src/lib/server/auth.ts` throw at startup if they are unset. `auth:create-admin` uses Node's built-in TypeScript stripping, so it needs Node 22.18+ (the project requires Node 24 via `engines`; the runtime image doesn't ship `scripts/`, so run it from the dev machine against the DB).

## Architecture

**SvelteKit 2 + Svelte 5 with experimental remote functions.** `svelte.config.js` enables `kit.experimental.remoteFunctions` and `compilerOptions.experimental.async`. Server logic lives in `*.remote.ts` files next to the routes that use them (`query`, `command`, `form` from `$app/server`), validated with valibot. Pages call these directly, so most features have no `+server.ts` endpoint. Forms bind via `{...registerTalent}` / `registerTalent.fields.x.as('text')`.

- `src/routes/data.remote.ts` - public registration form (`registerTalent`)
- `src/routes/judge/judge.remote.ts` - `getJudgeRegistrants` and `scoreTalent` (judge login required; records `judgeId`)
- `src/routes/stage/stage.remote.ts` - list contestants, `markPerformed` (admin only)
- `src/routes/waitlist/` - public display of contestants who have not yet performed; `waitlist.remote.ts` selects only non-sensitive columns
- `src/routes/leaderboard/leaderboard.remote.ts` - totals via SQL `sum` over `registrant` left-joined to `score`
- `src/routes/admin/admin.remote.ts` - edit/delete registrants and scores (admin only)
- `src/routes/admin/users/` - admin UI and `users.remote.ts` for creating and managing staff accounts
- `src/routes/login/` - `login` and `logout` forms
- `src/routes/api/events/+server.ts` - the SSE stream (the only plain endpoint besides Better Auth's `/api/auth/*`)

**Real-time updates via SSE.** `src/lib/server/events.ts` keeps an in-memory `Set` of connected SSE controllers; `broadcast(event, data)` writes to all of them. `/api/events` registers each client and sends a ping every 10s. Pages (`waitlist`, `stage`, `leaderboard`, `admin`) open an `EventSource('/api/events')` and re-fetch on a named event. Two event names are used:

- `refresh` - scores or registrants changed (leaderboard, admin)
- `stageRefresh` - performed status or the registrant list changed (stage, waitlist)

Any mutation that affects what those pages show must call `broadcast(...)` with the right event name, or the displays go stale. Client state is in process memory, so this only works with a single server instance.

**Data model** (`src/lib/server/db/schema.ts`, Drizzle + `postgres` driver): `registrant` (unique `email`, `performed` flag), `score` (FK to `registrant` with `onDelete: cascade`; five 1-10 criteria plus `judgesChoice` 0-5, an optional comment, and a nullable `judgeId` FK to `user` with `onDelete: set null`), plus the Better Auth tables `user`, `session`, `account`, `verification` (the admin plugin adds `role`, `banned`, ... to `user`). A leaderboard total is the sum of all six numeric score fields across all judges' rows.

## Auth

Better Auth, email + password only, with the `admin` plugin (`src/lib/server/auth.ts`). Public sign-up is disabled (`disableSignUp`); admins create accounts at `/admin/users`, and the first admin comes from `npm run auth:create-admin`. Roles are `admin` and `judge` (`src/lib/server/permissions.ts`); admins can also judge. There is no Better Auth client: login/logout are remote forms in `src/routes/login/login.remote.ts` calling `auth.api.*`, and `sveltekitCookies` (last plugin) sets the session cookie.

- `src/hooks.server.ts` loads the session into `event.locals.user` and redirects/403s page requests to `/admin`, `/stage` (admin) and `/judge` (judge or admin). **That is UX only.** Remote functions are served from `/_app/remote/...`, not the route path, so **every privileged remote function must call `requireRole(...)` from `src/lib/server/guard.ts` itself.** When adding a `query`, `command` or `form` that returns or changes non-public data, guard it.
- Anything reachable without a login must not return PII (email, phone, description). The waitlist and leaderboard queries select only display columns; `getStageView` and `getAdminView` return full rows and are admin-only.

## Things to know

- **CSRF `trustedOrigins`** in `svelte.config.js` is an explicit allowlist (localhost:3000 plus the `bsawinterfest.show` hosts). Form and command posts from any other origin are rejected, so add new hostnames there. With `ORIGIN` set to the public origin, SvelteKit's own same-origin check already passes for it.
- **Behind a reverse proxy:** set `ORIGIN` and `BETTER_AUTH_URL` to the public https origin. Better Auth reads the client IP from `X-Forwarded-For` (`advanced.ipAddress.ipAddressHeaders`) for its login rate limiting, so the proxy must set that header.
- **Duplicate registration** surfaces the Postgres error `detail` as an HTTP 409 (`registerTalent`).
- **Unit types** (`Post`, `Crew`, `Ship`, `Troop`, `Other`) are hard-coded in both the registration form (`src/routes/+page.svelte`) and the admin edit validator (`admin.remote.ts`).
- **Deployment:** the Dockerfile builds with Node 24 and runs `node build` on port 3000. The app runs with `ORIGIN`, `HOST`, `PORT`, `BETTER_AUTH_URL` and `BETTER_AUTH_SECRET` set (see the commented-out `app` and `migrate` services in `compose.yaml`). The compose `db` service only binds Postgres to `127.0.0.1`; keep it off public interfaces. Migrations are a separate step (`npm run db:migrate`).
- **Formatting:** tabs, prettier with the svelte and tailwind plugins. Styling is Tailwind 4 with daisyUI classes.
- `README.md` is the unmodified `sv create` template and has no project-specific information.
