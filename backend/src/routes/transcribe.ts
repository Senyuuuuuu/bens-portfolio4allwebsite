import { Router, Request, Response, NextFunction } from 'express';
import { QueueService } from '../services/queue.service';
const router = Router();
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { videoId, videoPath } = req.body;
  if (!videoId || !videoPath) return res.status(400).json({ error: 'videoId and videoPath required' });
  try {
    const jobId = await QueueService.getInstance().addJob({ type: 'transcribe', agentId: 'transcriber', input: { videoId, videoPath }, priority: 4 });
    res.json({ jobId, status: 'queued', videoId });
  } catch (err) { next(err); }
});
export default router;
