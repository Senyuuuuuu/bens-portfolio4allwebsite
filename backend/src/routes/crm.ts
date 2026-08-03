import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../index';
import { PipelineStage } from '@prisma/client';

const router = Router();

router.post('/update', async (req: Request, res: Response, next: NextFunction) => {
  const { leadId, stage, notes } = req.body;
  if (!leadId || !stage) return res.status(400).json({ error: 'leadId and stage are required' });
  try {
    const lead = await prisma.businessLead.update({
      where: { id: leadId },
      update: {
        pipelineStage: stage as PipelineStage,
        notes: notes ? notes : undefined,
      },
    });
    res.json({ success: true, lead });
  } catch (err) { next(err); }
});

export default router;
