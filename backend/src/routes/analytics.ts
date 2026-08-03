import { Router, Request, Response, NextFunction } from 'express';
import { QueueService } from '../services/queue.service';
import { prisma } from '../index';
const router = Router();
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { publicationId } = req.body;
  if (!publicationId) return res.status(400).json({ error: 'publicationId required' });
  try {
    const jobId = await QueueService.getInstance().addJob({ type: 'collect_analytics', agentId: 'analytics-agent', input: { publicationId }, priority: 6 });
    res.json({ jobId, status: 'queued', publicationId });
  } catch (err) { next(err); }
});
router.get('/summary', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await prisma.analytics.aggregate({
      _sum: { views: true, likes: true, comments: true, shares: true },
      _avg: { ctr: true, retention: true, engagementRate: true },
    });
    res.json({ summary: stats });
  } catch (err) { next(err); }
});
export default router;
