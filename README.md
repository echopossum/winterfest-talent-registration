# Winterfest Talent Show

Talent-show app for BSA Winterfest. Contestants register, judges score their acts, a stage manager marks who has performed, and a live leaderboard and waitlist update in real time.

Registration, `/waitlist` and `/leaderboard` are public. `/judge`, `/stage` and `/admin` require a login.

Built with SvelteKit, PostgreSQL (Drizzle) and Better Auth.

## Requirements

- Node 22.18 or newer
- Docker (for Postgres)

## Run it locally

```sh
npm install
cp .env.example .env        # then set BETTER_AUTH_SECRET (openssl rand -base64 32)
npm run db:start            # Postgres in Docker
npm run db:migrate
npm run auth:create-admin -- --email you@example.com --name "Your Name" --password "10+ characters"
npm run dev
```

Log in at `/login` with the admin you just created. There is no public sign-up. Create judge accounts at `/admin/users`.

## Environment variables

| Variable             | Purpose                                                                   |
| -------------------- | ------------------------------------------------------------------------- |
| `DATABASE_URL`       | Postgres connection string                                                |
| `BETTER_AUTH_SECRET` | Random string, 32+ characters, used to sign sessions                      |
| `BETTER_AUTH_URL`    | Origin the app is served from (`http://localhost:5173` for `npm run dev`) |

## Deploy

- Build the Docker image and run it with `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `ORIGIN`, `HOST` and `PORT`. `BETTER_AUTH_URL` and `ORIGIN` are both the public https origin. See the commented-out `app` and `migrate` services in [compose.yaml](compose.yaml).
- Put it behind a reverse proxy that terminates TLS, forwards `Host`, sets `X-Forwarded-For`, and does not buffer `/api/events` (the live-update stream).
- Run migrations and create the first admin before first use. Run a single app instance, because live updates are held in memory.

See [CLAUDE.md](CLAUDE.md) for architecture and conventions.
