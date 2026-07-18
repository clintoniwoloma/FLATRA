Deployment recommendation and run instructions

Recommended method: Docker (production-ready, repeatable, easy rollback).

1) Why Docker
- Encapsulates Node/Vite/Esbuild environment
- Easier to run on servers, staging, or CI
- Simplifies environment variable management and scaling

2) Quick Docker setup (recommended)

Create a `.env.production` from `.env.example` and fill values.

Build and run:
```bash
# Build server + client into production artifacts (on dev machine or CI)
pnpm install
pnpm build

# Build a Docker image (server bundle resides in dist/)
docker build -t flatra:latest .

# Run container (example)
docker run -d \
  --name flatra \
  --env-file .env.production \
  -p 3000:3000 \
  flatra:latest
```

Notes:
- Expose port 3000 (or set `PORT`) and place a reverse proxy (nginx) or cloud LB in front.
- Use `docker-compose` for DB, redis, and other services if needed.

3) Manual (non-Docker) server run

Prereqs: Node.js 22+, pnpm 10+, PostgreSQL (if using DB)

```bash
# install deps
pnpm install

# build frontend and server bundle
pnpm build

# set env vars (see .env.example)
export DATABASE_URL=postgres://...
export JWT_SECRET=...

# start server (built dist/index.js)
NODE_ENV=production pnpm start
```

4) Environment checklist (set these in production or Vercel)
- DATABASE_URL
- SUPABASE_URL
- SUPABASE_KEY
- JWT_SECRET
- COOKIE_SECRET
- OAUTH_SERVER_URL
- OWNER_OPEN_ID
- BUILT_IN_FORGE_API_URL
- BUILT_IN_FORGE_API_KEY
- NODE_ENV=production

5) Healthcheck & readiness
- App exposes `/_health` returning { ok: true }. Use this for probes.

6) Optional: Dockerfile / docker-compose
- I can add a sample `Dockerfile` and `docker-compose.yml` if you want to run the full stack (Postgres + app).

7) Rollback & updates
- Build a new image tag (v1.2.3) and update container.
- Keep migrations under `drizzle/migrations` and run `drizzle-kit migrate` during deploy.

8) Security
- Ensure env vars are stored securely.
- Use HTTPS at proxy layer.
- Rotate `JWT_SECRET` carefully (session invalidation required).

-- End of guide
