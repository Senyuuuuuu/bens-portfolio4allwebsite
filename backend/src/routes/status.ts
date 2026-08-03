import { Router, Request, Response } from 'express';
import os from 'os';
import { prisma } from '../index';
import { AgentRegistry } from '../agents/AgentRegistry';
import { QueueService } from '../services/queue.service';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const [agentStatuses, queueStats, leadCounts, stageCounts] = await Promise.all([
    AgentRegistry.getInstance().getAllStatuses(),
    QueueService.getInstance().getQueue(),
    prisma.businessLead.count(),
    prisma.businessLead.groupBy({ by: ['pipelineStage'], _count: { pipelineStage: true } }),
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
      },
      platform: os.platform(),
      uptime: process.uptime(),
    },
    agents: {
      total: agentStatuses.length,
      running: agentStatuses.filter((a) => a.status === 'RUNNING').length,
      idle: agentStatuses.filter((a) => a.status === 'IDLE').length,
      statuses: agentStatuses,
    },
    queue: queueStats,
    leads: {
      total: leadCounts,
      stages: Object.fromEntries(stageCounts.map((s) => [s.pipelineStage, s._count.pipelineStage])),
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
