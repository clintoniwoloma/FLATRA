# PR: Make server Vercel-compatible and enable preview deploys

This PR prepares the project for Vercel preview deployments:

- Exports an Express handler from `server/_core/index.ts` so Vercel can import it as a serverless function.
- Adds `createApp()` and a `/ _health` endpoint for readiness checks.
- Points `vercel.json` output to `dist/public` (Vite build output).
- Adds `.env.example` listing environment variables that must be configured in Vercel.

Build & Preview

1. Vercel build command: `pnpm build`
2. Output directory: `dist/public` (configured in `vercel.json`).
3. When a branch or PR is pushed, Vercel will create a Preview Deployment automatically.

To open a PR preview in browser (auto-filled):
https://github.com/clintoniwoloma/FLATRA/compare/main...feat/vercel-deploy?expand=1

Local commands

```bash
# install deps and build
pnpm install
pnpm build
pnpm dev
```

Notes & required env vars

Set the following in Vercel Project Settings > Environment Variables before merging or previewing features that need them:
- `DATABASE_URL`
- `SUPABASE_URL`, `SUPABASE_KEY` (if using Supabase)
- `JWT_SECRET`, `COOKIE_SECRET`
- `OAUTH_SERVER_URL`, `OWNER_OPEN_ID`
- `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`

If you want, I can open the GitHub PR for you (requires a GitHub token) or you can open it via the link above — that will trigger a Vercel Preview deploy you can use while iterating.
