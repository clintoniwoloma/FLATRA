## Summary

Make server Vercel-compatible and point Vercel static output to `dist/public`.

Changes:
- Export a default handler from `server/_core/index.ts` so Vercel can import it as a Serverless Function.
- Add `createApp()` to setup Express app without starting a listener.
- Start local server only when not running on Vercel.
- Update `vercel.json` output directory to `dist/public` to match Vite build.
- Add `.env.example` listing required environment variables.

## How to test locally

1. Install dependencies:
```bash
pnpm install
```
2. Run dev:
```bash
pnpm dev
```
3. Build for production:
```bash
pnpm build
```

## Vercel deployment notes
- Set environment variables from `.env.example` in Vercel Project Settings.
- Build & Output Settings: `pnpm build`, Output Directory: `dist/public` (already in `vercel.json`).
- The serverless function will be `dist/index.js` after build.

## TODOs / Follow-ups
- Implement full DB-backed logic for marketplace, merchant, profile, wallet, escrow flows.
- Add CI to run `pnpm test` on PRs.

/cc @maintainers
