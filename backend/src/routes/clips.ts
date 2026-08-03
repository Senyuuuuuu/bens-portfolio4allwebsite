import { Router, Request, Response, NextFunction } from 'express';
import { QueueService } from '../services/queue.service';
import { prisma } from '../index';
const router = Router();
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { videoId } = req.body;
  if (!videoId) return res.status(400).json({ error: 'videoId required' });
  try {
    const jobId = await QueueService.getInstance().addJob({ type: 'detect_clips', agentId: 'clip-detector', input: { videoId }, priority: 4 });
    res.json({ jobId, status: 'queued', videoId });
  } catch (err) { next(err); }
});
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clips = await prisma.clip.findMany({ orderBy: { score: 'desc' }, take: 50, include: { video: true } });
    res.json({ clips });
  } catch (err) { next(err); }
});
export default router;
