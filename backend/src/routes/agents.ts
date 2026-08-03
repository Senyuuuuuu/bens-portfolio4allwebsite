import { Router, Request, Response } from 'express';
import { AgentRegistry } from '../agents/AgentRegistry';
import { QueueService } from '../services/queue.service';
import { authenticate } from '../middleware/auth';

const router = Router();

// GET /api/agents — list all agents
router.get('/', (_req: Request, res: Response) => {
  const registry = AgentRegistry.getInstance();
  res.json({ agents: registry.getAllStatuses() });
});

// GET /api/agents/:id/status
router.get('/:id/status', (req: Request, res: Response) => {
  const agent = AgentRegistry.getInstance().getAgent(req.params.id);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  res.json(agent.getStatus());
});

// GET /api/agents/:id/logs
router.get('/:id/logs', (req: Request, res: Response) => {
  const agent = AgentRegistry.getInstance().getAgent(req.params.id);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  const limit = parseInt(req.query.limit as string) || 100;
  res.json({ logs: agent.getLogs(limit) });
});

// POST /api/agents/:id/start
router.post('/:id/start', async (req: Request, res: Response) => {
  const agent = AgentRegistry.getInstance().getAgent(req.params.id);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  try {
    await agent.start();
    res.json({ success: true, status: agent.getStatus() });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// POST /api/agents/:id/stop
router.post('/:id/stop', async (req: Request, res: Response) => {
  const agent = AgentRegistry.getInstance().getAgent(req.params.id);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  try {
    await agent.stop();
    res.json({ success: true, status: agent.getStatus() });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// POST /api/agents/:id/restart
router.post('/:id/restart', async (req: Request, res: Response) => {
  const agent = AgentRegistry.getInstance().getAgent(req.params.id);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  try {
    await agent.restart();
    res.json({ success: true, status: agent.getStatus() });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// POST /api/agents/:id/execute — direct execute (n8n calls this)
router.post('/:id/execute', async (req: Request, res: Response) => {
  const agent = AgentRegistry.getInstance().getAgent(req.params.id);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });

  // Queue the job
  const queue = QueueService.getInstance();
  const jobId = await queue.addJob({
    type: `agent:${req.params.id}`,
    agentId: req.params.id,
    input: req.body,
    priority: req.body.priority || 5,
  });

  res.json({ jobId, agentId: req.params.id, status: 'queued' });
});

export default router;
