import { Router, Request, Response, NextFunction } from 'express';
import { QueueService } from '../services/queue.service';
import { prisma } from '../index';

const router = Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { query, sources = ['youtube', 'reddit', 'google'] } = req.body;
  try {
    const jobId = await QueueService.getInstance().addJob({
      type: 'trend_hunt',
      agentId: 'trend-hunter',
      input: { query, sources },
      priority: 3,
    });
    res.json({ jobId, status: 'queued' });
  } catch (err) { next(err); }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const trends = await prisma.trend.findMany({
      orderBy: { viralScore: 'desc' },
      take: limit,
    });
    res.json({ trends });
  } catch (err) { next(err); }
});

export default router;
