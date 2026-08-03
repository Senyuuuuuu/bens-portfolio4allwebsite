import { Router, Request, Response, NextFunction } from 'express';
import { QueueService } from '../services/queue.service';
import { prisma } from '../index';
const router = Router();
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { clipId, platform, metadata } = req.body;
  if (!clipId) return res.status(400).json({ error: 'clipId required' });
  try {
    const jobId = await QueueService.getInstance().addJob({ type: 'publish', agentId: 'publisher', input: { clipId, platform, metadata }, priority: 2 });
    res.json({ jobId, status: 'queued', clipId, platform });
  } catch (err) { next(err); }
});
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const publications = await prisma.publication.findMany({ orderBy: { createdAt: 'desc' }, take: 50, include: { analytics: { orderBy: { fetchedAt: 'desc' }, take: 1 } } });
    res.json({ publications });
  } catch (err) { next(err); }
});
export default router;
