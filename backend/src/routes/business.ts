import { Router, Request, Response, NextFunction } from 'express';
import { QueueService } from '../services/queue.service';

const router = Router();

router.post('/analyze', async (req: Request, res: Response, next: NextFunction) => {
  const { leadId } = req.body;
  if (!leadId) return res.status(400).json({ error: 'leadId is required' });
  try {
    const jobId = await QueueService.getInstance().addJob({
      type: 'business_bi',
      agentId: 'business-bi',
      input: { leadId },
      priority: 4,
    });
    res.json({ jobId, status: 'queued', leadId });
  } catch (err) { next(err); }
});

export default router;
