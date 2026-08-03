# n8n Workflows — AI Content Factory

## Overview

This folder contains **12 n8n workflow JSON templates** for the AI Content Factory.
n8n is the **master orchestrator** — it controls when and how each AI agent runs.

## Quick Start

1. Open n8n at **http://localhost:5678**
2. Click **Workflows → Import from file**
3. Import each `.json` file from this folder
4. Activate the workflows you want to run

## Workflows

| # | File | Trigger | Description |
|---|------|---------|-------------|
| 01 | `01-trend-discovery.json` | ⏰ Every 2 hours | Auto-discovers trending content |
| 03 | `03-youtube-download.json` | 🔗 Webhook POST | Downloads video + triggers transcription |
| 12 | `12-full-pipeline.json` | 🔗 Webhook POST | Full end-to-end pipeline |

## How to Trigger Workflows Manually

### Trigger Trend Discovery
```bash
# n8n will auto-run every 2 hours, or trigger manually in the n8n UI
```

### Trigger Full Pipeline via curl
```bash
curl -X POST http://localhost:5678/webhook/full-pipeline \
  -H "Content-Type: application/json" \
  -d '{"url": "https://youtube.com/watch?v=dQw4w9WgXcQ"}'
```

### Trigger Download via curl
```bash
curl -X POST http://localhost:5678/webhook/video-download \
  -H "Content-Type: application/json" \
  -d '{"url": "https://youtube.com/watch?v=VIDEO_ID"}'
```

## Backend API Reference

All workflows call the backend at `http://host.docker.internal:4000` (Docker) or `http://localhost:4000` (local).

| Endpoint | Method | Agent |
|----------|--------|-------|
| `/api/trending` | POST | Trend Hunter |
| `/api/research` | POST | Research Agent |
| `/api/download` | POST | Downloader |
| `/api/transcribe` | POST | Transcriber |
| `/api/clips` | POST | Clip Detector |
| `/api/edit` | POST | Video Editor |
| `/api/captions` | POST | Caption AI |
| `/api/thumbnail` | POST | Thumbnail AI |
| `/api/upload` | POST | Publisher |
| `/api/publish` | POST | Publisher |
| `/api/analytics` | POST | Analytics |
| `/api/jobs/:id` | GET | Job status |
| `/api/system` | GET | System health |

## Webhook Endpoints

n8n calls these to trigger agents directly:
```
POST http://localhost:4000/api/webhooks/trigger/:agentId
POST http://localhost:4000/api/webhooks/callback/:jobId
POST http://localhost:4000/api/webhooks/events
```

## Configuration

In n8n, create credentials:
- **HTTP Header Auth** for backend API (optional, set JWT token)
- No special credentials needed for localhost

## Notes

- `host.docker.internal` is used inside Docker containers to reach localhost services
- Change to `localhost` if running n8n directly (not in Docker)
- Workflows include error handling via n8n's built-in retry mechanism
