# Infinite Chat — Web

Next.js client for Infinite Chat.

Project overview and architecture: [root README](../../README.md).

- **Live demo:** https://infinite-chat-kappa.vercel.app

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · TanStack Query · Clerk · socket.io-client · openapi-fetch · emoji-picker-react

## Getting started

### Requirements

- Node.js 20+
- The API running locally, see [apps/api/README.md](../api/README.md)
- A Clerk application (the same one the API uses)

### 1. Environment

Create `apps/web/.env.local`:

```env
# API base URL, without /api/v1
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_WS_URL="http://localhost:3001"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | API base URL for REST requests, without `/api/v1` |
| `NEXT_PUBLIC_WS_URL` | Socket.io server URL |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |

### 2. Install and run

```bash
cd apps/web
npm install
npm run dev
```

The app runs on http://localhost:3000.

## Scripts

```bash
npm run dev       # development server
npm run build     # production build
npm run start     # run production build
npm run gen:api   # regenerate API types (API must run on localhost:3001)
```

## API types

REST types are generated from the API's OpenAPI schema into `src/shared/lib/api/schema.d.ts` and used with `openapi-fetch`. After changing API routes or DTOs, start the API and run:

```bash
npm run gen:api
```

## Project structure

```
src/
├── app/          routes (App Router), /account is protected by Clerk
├── features/     feature modules: chat, user, upload
├── shared/       components, hooks, config, providers, types, utils
│   └── lib/      API client, socket client
└── proxy.ts      Clerk middleware
```

## Real-time

The client connects to the API over Socket.io (`websocket` transport) using one connection per namespace. Each connection authenticates with the Clerk JWT. Socket events are typed in `src/shared/types/socket`.

## Images

Remote images are allowed only from Cloudinary and `img.clerk.com`, see `next.config.ts`. If you use your own Cloudinary account, change the `pathname` there to your cloud name.
