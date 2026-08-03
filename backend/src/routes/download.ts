import { Router, Request, Response, NextFunction } from 'express';
import { QueueService } from '../services/queue.service';
import { prisma } from '../index';

const router = Router();

// POST /api/download
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { url, priority, callbackUrl } = req.body;
  if (!url) return res.status(400).json({ error: 'url is required' });

  try {
    const jobId = await QueueService.getInstance().addJob({
      type: 'download',
      agentId: 'downloader',
      input: { url, callbackUrl },
      priority: priority || 5,
    });

    res.json({ jobId, status: 'queued', message: `Download queued for ${url}` });
  } catch (err) {
    next(err);
  }
});

// GET /api/download — list downloaded videos
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json({ videos });
  } catch (err) {
    next(err);
  }
});

export default router;
