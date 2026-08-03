import { Router, Request, Response, NextFunction } from 'express';
import { QueueService } from '../services/queue.service';
const router = Router();
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { videoId, title, style } = req.body;
  if (!videoId) return res.status(400).json({ error: 'videoId required' });
  try {
    const jobId = await QueueService.getInstance().addJob({ type: 'generate_thumbnail', agentId: 'thumbnail-agent', input: { videoId, title, style }, priority: 4 });
    res.json({ jobId, status: 'queued', videoId });
  } catch (err) { next(err); }
});
export default router;
