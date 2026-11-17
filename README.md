# HRD EventHub UI

A Next.js 16 / React 19 event platform with a backend-free public demo.

## Run the demo

Requires Node.js 22 or newer.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. Demo mode is enabled by default and needs no environment variables, backend, database, or authentication secret. Visitors receive a sample admin session, so all pages are accessible. Use **Explore demo** to navigate the app or reset the sample data.

Groups, events, profiles, participants, polls, surveys, notifications, chat, and transactions use bundled mock data. Supported edits, votes, comments, survey submissions, and chat messages are saved in a compressed, browser-specific cookie for 24 hours. This works across Vercel function restarts and keeps visitors' changes separate. The small cookie is intended for a walkthrough; when it fills, use **Reset demo**. Clearing cookies also resets the data. Concurrent writes from multiple tabs may overwrite each other.

Image uploads simulate a successful upload with a bundled sample picture; the selected file is not sent to any backend. Document uploads, real payments, bank connections, and Telegram integration are unavailable. Demo registration is free, including for the sample admin. Sample transactions are for display only. No email or OTP is sent. Use sample information in demo forms.

## Deploy to Vercel

1. Push this repository to your Git provider and import it into Vercel.
2. Select the **Next.js** framework preset and Node.js **22.x** or newer.
3. Keep the default build command (`npm run build`) and output directory.
4. Leave environment variables empty, or set `NEXT_PUBLIC_DEMO_MODE=true`.
5. Deploy. Direct links to groups, events, profiles, and dashboard pages work without signing in.

This is a backend-free demo using Vercel's built-in Next.js runtime for routing, server components, and server actions. It does not use Next.js `output: "export"`, which would require replacing the app's dynamic routes and server actions.

## Connect a real backend

Set the following and rebuild:

```dotenv
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_API_BASE_URL=https://your-api.example/api/v5
NEXTAUTH_URL=https://your-site.example
NEXTAUTH_SECRET=replace-with-a-strong-random-secret
```

Live mode restores the existing authentication, authorization guards, API forwarding, and realtime connections. The demo API and demo actions reject requests when demo mode is disabled. Demo mode is intended only for sample data.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npx tsc --noEmit` | TypeScript check |
| `npm run test:demo` | Mock data and interaction checks |
| `npm run lint` | ESLint |

Demo fixtures and request handling live in `libs/demo/`. The shared API client and session helper select demo or live behavior without changing the existing page components.
