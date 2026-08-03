import { Router, Request, Response, NextFunction } from 'express';
import { QueueService } from '../services/queue.service';

const router = Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { topic } = req.body;
  if (!topic) return res.status(400).json({ error: 'topic is required' });
  try {
    const jobId = await QueueService.getInstance().addJob({
      type: 'research',
      agentId: 'research-agent',
      input: { topic },
      priority: 4,
    });
    res.json({ jobId, status: 'queued', topic });
  } catch (err) { next(err); }
});

export default router;
