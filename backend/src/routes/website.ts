import { Router, Request, Response, NextFunction } from 'express';
import { QueueService } from '../services/queue.service';
import { prisma } from '../index';

const router = Router();

router.post('/audit', async (req: Request, res: Response, next: NextFunction) => {
  const { leadId } = req.body;
  if (!leadId) return res.status(400).json({ error: 'leadId is required' });
  try {
    const jobId = await QueueService.getInstance().addJob({
      type: 'website_audit',
      agentId: 'website-audit',
      input: { leadId },
      priority: 4,
    });
    res.json({ jobId, status: 'queued', leadId });
  } catch (err) { next(err); }
});

router.post('/generate', async (req: Request, res: Response, next: NextFunction) => {
  const { leadId } = req.body;
  if (!leadId) return res.status(400).json({ error: 'leadId is required' });
  try {
    const jobId = await QueueService.getInstance().addJob({
      type: 'website_generator',
      agentId: 'website-generator',
      input: { leadId },
      priority: 3,
    });
    res.json({ jobId, status: 'queued', leadId });
  } catch (err) { next(err); }
});

router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const website = await prisma.generatedWebsite.findFirst({
      where: { OR: [{ slug: req.params.slug }, { leadId: req.params.slug }] },
      include: { lead: { include: { audit: true, intelligence: true } } },
    });
    if (!website) return res.status(404).json({ error: 'Generated website not found' });
    res.json(website);
  } catch (err) { next(err); }
});

export default router;
