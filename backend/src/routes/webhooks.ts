import { Router, Request, Response, NextFunction } from 'express';
import { QueueService } from '../services/queue.service';
import { io } from '../index';
import { emitSystemEvent } from '../socket';
import { logger } from '../services/logger.service';

const router = Router();

// Generic n8n webhook — n8n calls this to trigger any agent
router.post('/trigger/:agentId', async (req: Request, res: Response, next: NextFunction) => {
  const { agentId } = req.params;
  const { input, priority, callbackUrl } = req.body;

  logger.info(`🔗 n8n webhook received: trigger ${agentId}`);
  emitSystemEvent(io, { type: 'WEBHOOK_RECEIVED', message: `n8n triggered: ${agentId}`, level: 'info', agentId });

  try {
    const jobId = await QueueService.getInstance().addJob({
      type: `webhook:${agentId}`,
      agentId,
      input: { ...input, callbackUrl },
      priority: priority || 5,
    });

    res.json({ jobId, agentId, status: 'queued', timestamp: new Date().toISOString() });
  } catch (err) {
    next(err);
  }
});

// n8n workflow status callback
router.post('/callback/:jobId', async (req: Request, res: Response) => {
  const { jobId } = req.params;
  const { status, result, error } = req.body;

  logger.info(`🔗 Callback received for job ${jobId}: ${status}`);
  io.to(`job:${jobId}`).emit('job:callback', { jobId, status, result, error });
  emitSystemEvent(io, {
    type: 'JOB_CALLBACK',
    message: `Job ${jobId} callback: ${status}`,
    level: status === 'error' ? 'error' : 'success',
  });

  res.json({ received: true });
});

// Event stream for n8n
router.post('/events', (req: Request, res: Response) => {
  const { event, data } = req.body;
  emitSystemEvent(io, { type: event, message: String(data?.message || event), level: 'info', data });
  res.json({ received: true });
});

export default router;
