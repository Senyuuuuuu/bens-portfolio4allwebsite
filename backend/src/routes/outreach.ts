import { Router, Request, Response, NextFunction } from 'express';
import { QueueService } from '../services/queue.service';
import { prisma } from '../index';
import { DraftStatus, PipelineStage } from '@prisma/client';

const router = Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { leadId } = req.body;
  if (!leadId) return res.status(400).json({ error: 'leadId is required' });
  try {
    const jobId = await QueueService.getInstance().addJob({
      type: 'outreach_agent',
      agentId: 'outreach-agent',
      input: { leadId },
      priority: 4,
    });
    res.json({ jobId, status: 'queued', leadId });
  } catch (err) { next(err); }
});

router.get('/drafts', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query;
    const where = status ? { status: status as DraftStatus } : {};
    const drafts = await prisma.outreachDraft.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { lead: true },
    });
    res.json({ drafts });
  } catch (err) { next(err); }
});

router.post('/:id/approve', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const draft = await prisma.outreachDraft.update({
      where: { id: req.params.id },
      update: { status: DraftStatus.APPROVED, approvedAt: new Date() },
      include: { lead: true },
    });
    await prisma.businessLead.update({
      where: { id: draft.leadId },
      update: { pipelineStage: PipelineStage.OUTREACH_SENT },
    });
    res.json({ success: true, draft });
  } catch (err) { next(err); }
});

export default router;
