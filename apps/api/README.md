# Infinite Chat — API

NestJS backend for Infinite Chat: REST + Socket.io, Prisma, PostgreSQL, Clerk auth, Cloudinary uploads.

Project overview and architecture: [root README](../../README.md).

- **Production API:** https://infinite-chat-gf7b.onrender.com
- **Swagger UI:** https://infinite-chat-gf7b.onrender.com/api/docs

## Tech stack

NestJS 11 · Socket.io · Prisma 7 (`@prisma/adapter-pg`) · PostgreSQL 16 · Clerk · Cloudinary · Swagger · class-validator

## Getting started

### Requirements

- Node.js 20+
- Docker (for PostgreSQL)
- A Clerk application
- A Cloudinary account
- A public tunnel for local webhooks (ngrok, Cloudflare Tunnel or similar)

### 1. Environment

```bash
cd apps/api
cp .env.example .env
```

Fill in `.env`, see [Environment variables](#environment-variables).

### 2. Database

```bash
docker compose up -d
```

PostgreSQL starts on `localhost:5433` with the user and password from `.env`.

### 3. Install and migrate

```bash
npm install
npx prisma generate
npx prisma migrate deploy
```

`prisma generate` is required: the Prisma client is generated into `src/generated/prisma` and is not committed.

### 4. Run

```bash
npm run start:dev
```

The API runs on http://localhost:3001. Swagger is at http://localhost:3001/api/docs.

### 5. Clerk webhook

The API creates users in its own database from Clerk webhooks. Without this step you can sign in, but the API will not know the user.

1. Start a tunnel to port `3001`.
2. In the Clerk dashboard add an endpoint: `https://<your-tunnel>/api/v1/webhooks/clerk`.
3. Subscribe to `user.created` and `user.updated`.
4. Put the signing secret into `CLERK_WEBHOOK_SIGNING_SECRET`.

## Environment variables

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` or `production` |
| `PORT` | Optional. API port, default `3001` |
| `FRONTEND_URL` | Optional. Allowed CORS origin, default `http://localhost:3000` |
| `DATABASE_URL` | PostgreSQL connection string. Variable expansion is enabled, so it can reference the `POSTGRES_*` values |
| `POSTGRES_USER`, `POSTGRES_PASSWORD` | Used by `docker-compose.yml` |
| `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_DATABASE` | Used to build `DATABASE_URL` |
| `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | Clerk API keys |
| `CLERK_WEBHOOK_SIGNING_SECRET` | Clerk webhook signing secret |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Cloudinary credentials |
| `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL` | Firebase Admin credentials. Required at startup, no feature uses them yet |

Example `DATABASE_URL` for the local Docker database:

```env
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="postgres"
POSTGRES_HOST="localhost"
POSTGRES_PORT="5433"
POSTGRES_DATABASE="postgres"
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DATABASE}"
```

## Scripts

```bash
npm run start:dev    # watch mode
npm run build        # compile to dist/
npm run start:prod   # run compiled build
```

## Project structure

```
prisma/                  schema and migrations
docs/                    WebSocket and upload guides
src/
├── api/                 feature modules: room, messages, user, attachments,
│                        presence, notification, auth, webhooks
├── common/              decorators, DTOs, events, filters, gateways, pipes
├── infra/               Prisma, Clerk, Cloudinary providers
├── listeners/           domain event listeners
├── config/              Swagger setup
└── main.ts
```

## REST API

All routes are prefixed with `/api/v1`. The full list with request and response schemas is in Swagger (`/api/docs`). The OpenAPI schema is available as JSON at `/api/docs/json`.

| Area | Routes |
|---|---|
| Health | `GET /health` |
| User | `GET /user/me`, `GET /user/:id`, `GET /user` |
| Room | `POST /room/direct`, `GET /room`, `GET /room/:roomId`, `DELETE /room/:roomId` |
| Group room | `POST /room/group`, `PATCH /room/group/:roomId/name`, `POST /room/group/:roomId/add/:memberId`, `DELETE /room/group/:roomId/kick/:memberId`, `DELETE /room/group/leave/:roomId`, avatar presign and update |
| Messages | `GET /message/history/:roomId`, `GET /message/unread-count/:roomId`, `POST /message/attachments/presign/:roomId` |
| Webhooks | `POST /webhooks/clerk` |

Group management routes are restricted by role (`OWNER` / `ADMIN`).

## WebSocket API

Socket.io, authenticated with the Clerk JWT in the handshake (`auth.token`).

| Namespace | Purpose |
|---|---|
| `messages` | send, edit, delete and restore messages |
| `rooms` | room created / deleted, read status updates |
| `presence` | online / offline status, typing indicator, heartbeat |
| `notifications` | notifications for the current user |

Event reference and guides:

- [WebSocket events: messages](docs/ws/messages.md)
- [WebSocket API guide](docs/guides/websocket-api.md)
- [Sending messages with attachments](docs/guides/sending-messages-with-attachments.md)
- [Avatar upload](docs/guides/avatar-upload-integration.md)

## Data model

Models: `User`, `Room` (`DIRECT` / `GROUP`), `RoomMember` (role, last read time), `Message` (`USER` / `SYSTEM`, replies, soft delete), `MessageAttachment` (`IMAGE`, `VIDEO`, `AUDIO`, `FILE`), `Notification`.

Full schema: [prisma/schema.prisma](prisma/schema.prisma)

## File uploads

Files are not uploaded through the API. The flow is:

1. The client asks the API for signed upload slots.
2. The client uploads each file directly to Cloudinary.
3. The client sends the message with the file metadata over WebSocket.
