# 🚀 Infinite Chat

A modern fullstack real-time chat application built with a cutting-edge stack.  
Focused on performance, scalability, and smooth user experience.

🔗 **Live Demo:** https://infinite-chat-itvi.vercel.app/

---

## ✨ Features

- 🔐 Authentication via Clerk
    
- 💬 Real-time messaging (Upstash Realtime)
    
- 🟢 Online / offline user status
    
- ⌨️ Typing indicators
    
- 🔔 Notifications (in-app + browser Notification API)
    
- 🧑‍🤝‍🧑 Private conversations (1-to-1 chats)
    
- 📎 File uploads (UploadThing)
    
- ✏️ Message editing
    
- 🔗 Auto link detection
    
- 😀 Emoji picker
    
- ⚡ Optimistic UI with React Query
    
- 🧠 Full type-safety with Zod
    

---

## 🛠️ Tech Stack

### Frontend

- Next.js 16 (App Router)
    
- React 19
    
- TypeScript
    
- Tailwind CSS
    
- React Query
    

### Backend

- Elysia (lightweight API layer inside Next.js)
    
- Eden (end-to-end type-safe API client)
    

### Database

- PostgreSQL
    
- Prisma ORM
    

### Realtime

- Upstash Realtime
    
- Upstash Redis
    

### Auth

- Clerk
    

### File Uploads

- UploadThing
    

---

## 🧠 Key Highlights

- ⚡ **Type-safe fullstack architecture** (Elysia + Eden + Zod)
    
- 🔄 **Realtime system without WebSockets server** (Upstash)
    
- 🚀 **Optimistic UI updates** for instant UX
    
- 🧩 **Modular architecture** for scalability
    

---

## 📦 Installation

```bash
git clone https://github.com/KirillPitomets/infinite-chat.git
cd infinite-chat
npm install
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Database
DATABASE_URL=

# Upstash
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# UploadThing
UPLOADTHING_TOKEN=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🧬 Database Setup

```bash
npx prisma generate
npx prisma migrate dev
```

---

## ▶️ Running the app

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🏗️ Architecture Overview

- **Next.js App Router** handles UI and server environment
    
- **Elysia** acts as a lightweight API layer inside Next.js
    
- **Eden** provides type-safe communication between client and server
    
- **Prisma** manages database access
    
- **Upstash** powers real-time messaging and presence
    
- **React Query** handles caching and async state 
---
## 📁 Project Structure

The project follows a feature-based architecture with clear separation of concerns:

- `app/` – Next.js routing and layouts  
- `features/` – domain-specific modules (chat, message, user)  
- `shared/` – reusable components, hooks, and utilities  
- `server/` – backend logic (API routes, services, database)  

This structure improves scalability, maintainability, and code organization.
    

---

## 📸 Screenshots

<p align="center">
<img width="700"  alt="mobile" src="https://github.com/user-attachments/assets/6aa05cba-5211-47e1-8bd2-9e83070c3785" />
<img width="700"  alt="image" src="https://github.com/user-attachments/assets/44895213-ed85-4fa5-be39-aeaca50a2303" />
<img width="700"  alt="2" src="https://github.com/user-attachments/assets/edce89e9-326d-4cfc-8e75-d82daa482aee" />
</p>

---

## 🚀 Future Improvements

- 👥 Group chats
    
- 📱 Mobile-first UI improvements
    
- 🌙 Dark mode
    
- 🔍 Search messages
    
- 📌 Pin messages
    

---

<img width="1277" height="898" alt="image" src="https://github.com/user-attachments/assets/885e0a4e-6813-43a9-97b7-b898c8552f0d" />
