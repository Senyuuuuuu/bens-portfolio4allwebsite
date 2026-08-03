import { Router, Request, Response, NextFunction } from 'express';
import { QueueService } from '../services/queue.service';
const router = Router();
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { clipId, videoPath } = req.body;
  if (!clipId || !videoPath) return res.status(400).json({ error: 'clipId and videoPath required' });
  try {
    const jobId = await QueueService.getInstance().addJob({ type: 'edit_video', agentId: 'video-editor', input: { clipId, videoPath }, priority: 3 });
    res.json({ jobId, status: 'queued', clipId });
  } catch (err) { next(err); }
});
export default router;
