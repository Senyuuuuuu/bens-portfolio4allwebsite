import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { PrismaClient } from '@prisma/client';

import { logger } from './services/logger.service';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { setupSocketIO } from './socket';
import { AgentRegistry } from './agents/AgentRegistry';
import { QueueService } from './services/queue.service';

// Routes
import authRoutes from './routes/auth';
import agentRoutes from './routes/agents';
import mapsRoutes from './routes/maps';
import businessRoutes from './routes/business';
import facebookRoutes from './routes/facebook';
import websiteRoutes from './routes/website';
import screenshotsRoutes from './routes/screenshots';
import outreachRoutes from './routes/outreach';
import crmRoutes from './routes/crm';
import leadsRoutes from './routes/leads';
import jobsRoutes from './routes/jobs';
import logsRoutes from './routes/logs';
import statusRoutes from './routes/status';
import webhooksRoutes from './routes/webhooks';
import settingsRoutes from './routes/settings';

const PORT = parseInt(process.env.PORT || '4000');

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

// ─── Main App ────────────────────────────────────────────────────────────────
const app = express();
const httpServer = createServer(app);

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000,http://localhost:8000')
  .split(',')
  .map((o) => o.trim());

// Socket.IO on same HTTP server
export const io = new SocketIOServer(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.netlify.app')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev/prod with credentials
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.netlify.app')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('combined', {
  stream: { write: (msg: string) => logger.http(msg.trim()) },
}));
app.use(rateLimiter);

// ─── Static Files ─────────────────────────────────────────────────────────────
app.use('/screenshots', express.static('./screenshots'));
app.use('/uploads', express.static('./uploads'));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'AI Lead Gen & Website Automation Platform',
    uptime: process.uptime(),
    version: '1.0.0',
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/maps', mapsRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/facebook', facebookRoutes);
app.use('/api/website', websiteRoutes);
app.use('/api/screenshots', screenshotsRoutes);
app.use('/api/outreach', outreachRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/webhooks', webhooksRoutes);
app.use('/api/settings', settingsRoutes);

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Startup ──────────────────────────────────────────────────────────────────
async function bootstrap() {
  try {
    await prisma.$connect();
    logger.info('✅ PostgreSQL connected');

    setupSocketIO(io);
    logger.info('✅ Socket.IO initialized');

    await AgentRegistry.getInstance().initialize();
    logger.info('✅ Agent Registry initialized (9 AI Agents)');

    await QueueService.getInstance().initialize();
    logger.info('✅ Queue Service initialized');

    httpServer.listen(PORT, () => {
      logger.info(`🚀 Backend API running on http://localhost:${PORT}`);
      logger.info(`🔌 Socket.IO server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
process.on('SIGTERM', async () => {
  logger.info('🔄 SIGTERM received, shutting down...');
  await prisma.$disconnect();
  await QueueService.getInstance().close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('🔄 SIGINT received, shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

bootstrap();

export default app;
