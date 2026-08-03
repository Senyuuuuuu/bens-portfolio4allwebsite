import { Router, Request, Response, NextFunction } from 'express';
import { QueueService } from '../services/queue.service';
import { prisma } from '../index';

const router = Router();

router.post('/search', async (req: Request, res: Response, next: NextFunction) => {
  const { category = 'Restaurant', location = 'New York, NY', limit = 10 } = req.body;
  try {
    const jobId = await QueueService.getInstance().addJob({
      type: 'maps_discovery',
      agentId: 'maps-discovery',
      input: { category, location, limit },
      priority: 3,
    });
    res.json({ jobId, status: 'queued', category, location });
  } catch (err) { next(err); }
});

export default router;
