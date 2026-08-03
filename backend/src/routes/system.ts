import { Router, Request, Response } from 'express';
import os from 'os';
import { prisma } from '../index';
import { AgentRegistry } from '../agents/AgentRegistry';
import { QueueService } from '../services/queue.service';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const [agentStatuses, queueStats, jobCounts] = await Promise.all([
    AgentRegistry.getInstance().getAllStatuses(),
    QueueService.getInstance().getQueue(),
    prisma.job.groupBy({ by: ['status'], _count: { status: true } }),
  ]);

  const cpuUsage = process.cpuUsage();
  const memUsage = process.memoryUsage();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();

  res.json({
    system: {
      cpu: {
        cores: os.cpus().length,
        model: os.cpus()[0]?.model || 'Unknown',
        usage: ((cpuUsage.user + cpuUsage.system) / 1000000).toFixed(2),
      },
      memory: {
        total: Math.round(totalMem / 1024 / 1024),
        free: Math.round(freeMem / 1024 / 1024),
        used: Math.round((totalMem - freeMem) / 1024 / 1024),
        usedPercent: Math.round(((totalMem - freeMem) / totalMem) * 100),
        process: {
          rss: Math.round(memUsage.rss / 1024 / 1024),
          heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
          heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        },
      },
      platform: os.platform(),
      uptime: process.uptime(),
      nodeVersion: process.version,
    },
    agents: {
      total: agentStatuses.length,
      running: agentStatuses.filter((a) => a.status === 'RUNNING').length,
      idle: agentStatuses.filter((a) => a.status === 'IDLE').length,
      error: agentStatuses.filter((a) => a.status === 'ERROR').length,
      statuses: agentStatuses,
    },
    queue: queueStats,
    jobs: Object.fromEntries(jobCounts.map((j) => [j.status.toLowerCase(), j._count.status])),
    timestamp: new Date().toISOString(),
  });
});

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
