import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../index';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { stage, category, search, priority, limit = '50', page = '1' } = req.query;
    const where: Record<string, unknown> = {};
    if (stage) where.pipelineStage = stage;
    if (category) where.category = category;
    if (priority) where.priority = priority;
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { category: { contains: search as string, mode: 'insensitive' } },
        { address: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [leads, total] = await Promise.all([
      prisma.businessLead.findMany({
        where,
        orderBy: [{ leadScore: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: parseInt(limit as string),
        include: {
          audit: true,
          social: true,
          intelligence: true,
          websiteDemos: { orderBy: { createdAt: 'desc' }, take: 1 },
          screenshots: true,
          outreachDrafts: { orderBy: { createdAt: 'desc' }, take: 2 },
        },
      }),
      prisma.businessLead.count({ where }),
    ]);

    res.json({ leads, total, page: parseInt(page as string) });
  } catch (err) { next(err); }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await prisma.businessLead.findUnique({
      where: { id: req.params.id },
      include: {
        audit: true,
        social: true,
        intelligence: true,
        websiteDemos: { orderBy: { createdAt: 'desc' } },
        screenshots: true,
        outreachDrafts: { orderBy: { createdAt: 'desc' } },
        jobs: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (err) { next(err); }
});

export default router;
