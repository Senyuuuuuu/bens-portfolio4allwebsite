import { Router, Request, Response, NextFunction } from 'express';
import { QueueService } from '../services/queue.service';
import { prisma } from '../index';
const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, limit = '20', page = '1' } = req.query;
    const where = status ? { status: status as string } : {};
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: parseInt(limit as string), include: { agent: true } }),
      prisma.job.count({ where }),
    ]);
    const queueStats = await QueueService.getInstance().getQueue();
    res.json({ jobs, total, page: parseInt(page as string), queueStats });
  } catch (err) { next(err); }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await prisma.job.findUnique({ where: { id: req.params.id }, include: { agent: true, video: true } });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) { next(err); }
});

router.post('/:id/cancel', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await QueueService.getInstance().cancelJob(req.params.id);
    res.json({ success: true, message: 'Job cancelled' });
  } catch (err) { next(err); }
});

router.post('/:id/retry', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await prisma.job.findUnique({ where: { id: req.params.id } });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    const newJobId = await QueueService.getInstance().addJob({
      type: job.type,
      agentId: job.agentId || '',
      input: (job.input as Record<string, unknown>) || {},
      priority: job.priority,
    });
    res.json({ success: true, newJobId });
  } catch (err) { next(err); }
});

export default router;
