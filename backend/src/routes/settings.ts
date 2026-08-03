import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../index';
const router = Router();

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await prisma.setting.findMany();
    // Mask sensitive values
    const masked = settings.map(s => ({
      ...s,
      value: s.encrypted ? '***' : s.value,
    }));
    res.json({ settings: masked });
  } catch (err) { next(err); }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { key, value, category, encrypted } = req.body;
  if (!key || !value) return res.status(400).json({ error: 'key and value required' });
  try {
    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value, category, encrypted: encrypted ?? false, updatedAt: new Date() },
      create: { key, value, category, encrypted: encrypted ?? false },
    });
    res.json({ setting: { ...setting, value: setting.encrypted ? '***' : setting.value } });
  } catch (err) { next(err); }
});

router.delete('/:key', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.setting.delete({ where: { key: req.params.key } });
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
