import { Router, Request, Response, NextFunction } from 'express';
import { QueueService } from '../services/queue.service';
import { GoogleDriveService } from '../services/googledrive.service';
const router = Router();
const drive = new GoogleDriveService();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { filePath, fileName, drivePath } = req.body;
  if (!filePath) return res.status(400).json({ error: 'filePath required' });
  try {
    const result = await drive.uploadFile(filePath, fileName || 'file', drivePath);
    res.json({ success: true, driveId: result.id, url: result.webViewLink });
  } catch (err) { next(err); }
});

router.get('/auth', (_req, res) => {
  const authUrl = drive.getAuthUrl();
  res.json({ authUrl });
});

router.get('/callback', async (req: Request, res: Response) => {
  const { code } = req.query;
  await drive.saveTokens(code as string);
  res.redirect(`${process.env.FRONTEND_URL}?driveConnected=true`);
});

router.get('/files', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const path = (req.query.path as string) || '';
    const files = await drive.listFiles(path);
    res.json({ files });
  } catch (err) { next(err); }
});

router.post('/setup', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    await drive.setupFolderStructure();
    res.json({ success: true, message: 'Google Drive folder structure created' });
  } catch (err) { next(err); }
});

export default router;
