import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../index';
const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { level, agentId, limit = '100', page = '1' } = req.query;
    const where: Record<string, unknown> = {};
    if (level) where.level = level;
    if (agentId) where.agentId = agentId;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const logs = await prisma.log.findMany({ where, orderBy: { timestamp: 'desc' }, skip, take: parseInt(limit as string), include: { agent: true } });
    res.json({ logs });
  } catch (err) { next(err); }
});

// SSE streaming logs
router.get('/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  const interval = setInterval(async () => {
    const logs = await prisma.log.findMany({ orderBy: { timestamp: 'desc' }, take: 5 });
    res.write(`data: ${JSON.stringify(logs)}\n\n`);
  }, 2000);

  req.on('close', () => clearInterval(interval));
});

export default router;
