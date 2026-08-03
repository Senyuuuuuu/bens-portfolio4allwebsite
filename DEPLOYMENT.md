# 🚀 JARVIS AI Platform — Comprehensive Deployment Manual

This guide provides step-by-step instructions for deploying your **JARVIS AI Operating System & Lead Automation Platform**.

It implements a hybrid architecture:
- **Netlify**: Hosts the public frontend UI (Next.js Studio Dashboard + JARVIS Standalone HUD) over HTTPS with automatic GitHub CI/CD deployments.
- **Cloud Server / VPS (Railway / Render / DigitalOcean)**: Hosts the persistent backend Node.js process, Socket.IO WebSocket streamer, PostgreSQL database, and Redis queue engine.

---

## 🏛️ Architecture Overview

```
                                  🌐 PUBLIC CLIENT (Mobile / Laptop / Remote)
                                                    │
                                                    ▼
                             ┌──────────────────────────────────────────────┐
                             │       Netlify CDN (HTTPS Static/SPA)         │
                             │  • Next.js 14 Studio App (/frontend)          │
                             │  • Standalone JARVIS HUD (/index.html)       │
                             └──────────────────────┬───────────────────────┘
                                                    │
                                  HTTPS REST API    │    WSS WebSockets
                                  (Bearer Auth)     │    (Real-time Logs)
                                                    ▼
                             ┌──────────────────────────────────────────────┐
                             │    Persistent Cloud Backend (Railway/VPS)    │
                             │  • Node.js / Express Server (:4000)          │
                             │  • Socket.IO Server (Real-time Events)       │
                             │  • 9 AI Agents & AgentRegistry               │
                             │  • Puppeteer Headless Screenshot Runner      │
                             └───────┬──────────────────────────────┬───────┘
                                     │                              │
                                     ▼                              ▼
                          ┌────────────────────┐          ┌───────────────────┐
                          │ Managed PostgreSQL │          │   Managed Redis   │
                          │ (Neon/Supabase/VPS)│          │  (Upstash/Render) │
                          └────────────────────┘          └───────────────────┘
```

---

## 🛠️ Step 1: GitHub Repository Setup

1. Commit and push all latest changes to your GitHub repository:
   ```bash
   git add .
   git commit -m "Configure JARVIS Netlify frontend deployment and persistent backend CORS"
   git push origin main
   ```

---

## 🌐 Step 2: Deploying Frontend to Netlify

1. Log into your **Netlify** account at [netlify.com](https://app.netlify.com).
2. Click **"Add new site" → "Import an existing project"**.
3. Select **GitHub** as your Git provider and authorize Netlify.
4. Select your repository: `davila7/claude-code-templates` (or your personal fork/repo).
5. Configure the site build settings:
   - **Branch to deploy**: `main`
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
6. Configure Netlify Environment Variables (**Site settings → Environment variables**):
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-domain.up.railway.app
   NEXT_PUBLIC_SOCKET_URL=https://your-backend-domain.up.railway.app
   NEXT_PUBLIC_N8N_URL=https://your-n8n-instance.com
   ```
7. Click **Deploy site**. Netlify will build the Next.js site and provide a public HTTPS URL (e.g. `https://jarvis-ai.netlify.app`).

---

## ⚡ Step 3: Deploying Persistent Cloud Backend (Railway / Render / VPS)

Because Netlify serverless functions timeout and cannot keep WebSockets open, the `backend/` directory must run on a persistent server:

### Option A: Deploying on Railway.app (Recommended)
1. Go to [Railway.app](https://railway.app) and create a **New Project**.
2. Provision a **PostgreSQL** database module in Railway (copies `DATABASE_URL`).
3. Provision a **Redis** module in Railway (copies `REDIS_URL`).
4. Click **Deploy from GitHub repo** and select the `backend` root path.
5. Set the required backend Environment Variables in Railway:
   ```env
   PORT=4000
   NODE_ENV=production
   FRONTEND_URL=https://jarvis-ai.netlify.app
   DATABASE_URL=postgresql://user:pass@host:5432/db
   REDIS_URL=redis://default:pass@redis-host:6379
   JWT_SECRET=your-secure-random-jwt-secret-key
   GOOGLE_MAPS_API_KEY=your-google-maps-key
   OPENAI_API_KEY=your-openai-key
   ANTHROPIC_API_KEY=your-anthropic-key
   ```
6. Set the start command:
   ```bash
   npx prisma db push --schema=../database/schema.prisma && npm start
   ```
7. Generate a Railway Domain (e.g. `https://jarvis-backend-production.up.railway.app`).

---

## 🔒 Step 4: Security & Environment Variable Matrix

| Secret / Variable | Where to Configure | Exposed to Client? | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Netlify Site Settings | Yes (`NEXT_PUBLIC_`) | Points client to production Express API |
| `NEXT_PUBLIC_SOCKET_URL` | Netlify Site Settings | Yes (`NEXT_PUBLIC_`) | Points client to production Socket.IO server |
| `NEXT_PUBLIC_N8N_URL` | Netlify Site Settings | Yes (`NEXT_PUBLIC_`) | Links to active n8n instance |
| `DATABASE_URL` | Backend Cloud (Railway/VPS) | 🔒 NO (Secret) | PostgreSQL connection string |
| `REDIS_URL` | Backend Cloud (Railway/VPS) | 🔒 NO (Secret) | Redis connection string for BullMQ queues |
| `JWT_SECRET` | Backend Cloud (Railway/VPS) | 🔒 NO (Secret) | Signs and verifies user session tokens |
| `OPENAI_API_KEY` | Backend Cloud (Railway/VPS) | 🔒 NO (Secret) | OpenAI model billing & completion key |
| `ANTHROPIC_API_KEY` | Backend Cloud (Railway/VPS) | 🔒 NO (Secret) | Anthropic Claude model completion key |

---

## 🧪 Step 5: Post-Deployment Verification Checklist

After deploying the Netlify frontend and backend server:

- [ ] **Access Site**: Open `https://your-site.netlify.app` from a mobile phone or remote laptop.
- [ ] **Voice Interaction**: Tap the microphone icon on the HUD and speak a command. Verify browser speech recognition and TTS audio playback work over HTTPS.
- [ ] **API Connection**: Navigate to the Lead Gen Command Center and trigger a Maps Discovery search. Confirm HTTP 200 response from backend.
- [ ] **Socket.IO Streaming**: Check the **Live Logs** terminal. Verify green socket connection status indicator.
- [ ] **CORS Verification**: Check browser console network tab to ensure no CORS or `Access-Control-Allow-Origin` errors occur.
