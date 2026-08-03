# 🚀 AI Lead Generation & Website Automation Platform

> **Comprehensive AI Sales & Automation Platform.** Automatically discovers local businesses, audits digital presence, builds AI-generated demo websites with multi-device previews, drafts personalized outreach sequences, and manages pipeline stages with n8n orchestration.

![AI LeadGen Platform](https://img.shields.io/badge/AI%20LeadGen-v1.0.0-00d4ff?style=for-the-badge&logo=robot&logoColor=white)
![n8n](https://img.shields.io/badge/n8n-Orchestrator-FF6D00?style=for-the-badge&logo=n8n)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-PostgreSQL-2D3748?style=for-the-badge&logo=prisma)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│             AI Lead Gen & Website Automation OS             │
├─────────────────────────────────────────────────────────────┤
│  Frontend Dashboard & CRM Studio (Next.js 14)       :3000   │
│  ├── Command Center (Maps Discovery Search & Metrics)       │
│  ├── CRM Pipeline (Kanban & Table lead tracking)            │
│  ├── Interactive Website Studio (Desktop/Mobile previewer)  │
│  ├── Outreach Studio (Human Review Draft Gate)             │
│  ├── Live Logs (SSE streaming terminal)                    │
│  └── Settings (Google Maps, Google AI Studio, SMTP)        │
├─────────────────────────────────────────────────────────────┤
│  Backend API & 9 AI Agents (Express + Socket.IO)    :4000   │
│  ├── 9 Specialized AI Agents (AgentRegistry)                │
│  ├── REST API Routes (14 route groups)                     │
│  ├── Socket.IO Event Broadcasting                          │
│  └── BullMQ Job Queue & Redis Worker                        │
├─────────────────────────────────────────────────────────────┤
│  n8n Automation Engine                              :5678   │
│  ├── 6 Master Workflows (Discovery, Audit, Gen, CRM, etc.) │
├─────────────────────────────────────────────────────────────┤
│  Database & Infrastructure                                  │
│  ├── PostgreSQL (Prisma ORM - 11 models)            :5432   │
│  └── Redis Queue                                    :6379   │
└─────────────────────────────────────────────────────────────┘
```

## 🤖 9 AI Agents

| Agent | ID | Purpose |
|-------|----|---------|
| 📍 Google Maps Discovery | `maps-discovery` | Searches businesses by industry & location, extracts public info |
| 🌐 Website Audit | `website-audit` | Evaluates SSL, mobile layout, SEO score, calculates Quality Score |
| 📘 Facebook Analysis | `facebook-analysis` | Inspects public Facebook profile, follower count & branding |
| 🧠 Business BI | `business-bi` | Synthesizes brand style, color palettes, & improvement recommendations |
| 🎨 AI Website Generator | `website-generator` | Builds full Next.js/React/Tailwind demo websites |
| 📸 Screenshot Agent | `screenshot-agent` | Renders multi-viewport previews (Desktop, Tablet, Mobile) |
| ✉️ Outreach Agent | `outreach-agent` | Drafts personalized email, social & SMS sequences |
| 📈 CRM Agent | `crm-agent` | Manages pipeline stage transitions & notes |
| 📊 Analytics | `analytics-agent` | Aggregates conversion rates & pipeline statistics |

---

## ⚡ Quick Start

### 1. Configure Environment
```bash
cp .env.example .env
```

### 2. Launch Local Environment
```bash
docker-compose up -d postgres redis n8n
```

### 3. Start Backend Server
```bash
cd backend
npm install
npm run db:push
npm run dev # Starts on http://localhost:4000
```

### 4. Start Frontend Studio
```bash
cd frontend
npm install
npm run dev # Starts on http://localhost:3000
```

### 5. Setup n8n Workflows
1. Open **http://localhost:5678**
2. Import template JSON files from `n8n/workflows/`
3. Activate the workflows

---

## 📡 API Reference

```
POST /api/maps/search          # Search local businesses
POST /api/business/analyze     # Generate Business BI
POST /api/facebook/analyze     # Analyze Facebook page
POST /api/website/audit        # Audit existing website
POST /api/website/generate     # Generate AI demo website
GET  /api/website/:slug        # Fetch website code & details
POST /api/screenshots          # Generate device screenshots
POST /api/outreach             # Create outreach drafts
GET  /api/outreach/drafts      # List outreach drafts
POST /api/outreach/:id/approve # Approve & queue dispatch
POST /api/crm/update           # Update lead stage
GET  /api/leads                # List/filter CRM leads
GET  /api/status               # System health & metrics
```

---

## 📜 License

MIT License — Built for Anti Gravity AI Automation.
