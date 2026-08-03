import { Router, Request, Response, NextFunction } from 'express';
import { QueueService } from '../services/queue.service';
const router = Router();
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { videoId, clipId } = req.body;
  try {
    const jobId = await QueueService.getInstance().addJob({ type: 'generate_captions', agentId: 'caption-agent', input: { videoId, clipId }, priority: 4 });
    res.json({ jobId, status: 'queued' });
  } catch (err) { next(err); }
});
export default router;
