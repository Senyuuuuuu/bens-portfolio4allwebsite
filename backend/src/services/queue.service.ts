import { Queue, Worker, Job, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';
import { logger } from './logger.service';
import { io } from '../index';
import { emitSystemEvent } from '../socket';
import { AgentRegistry } from '../agents/AgentRegistry';
import { prisma } from '../index';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

export type JobPayload = {
  type: string;
  agentId: string;
  input: Record<string, unknown>;
  priority?: number;
  jobId?: string;
};

export class QueueService {
  private static instance: QueueService;
  private queue: Queue<JobPayload>;
  private worker: Worker<JobPayload>;
  private queueEvents: QueueEvents;

  private constructor() {
    this.queue = new Queue<JobPayload>('acf-main', {
      connection,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: { count: 1000 },
        removeOnFail: { count: 500 },
      },
    });

    this.worker = new Worker<JobPayload>(
      'acf-main',
      async (job: Job<JobPayload>) => {
        return this.processJob(job);
      },
      {
        connection,
        concurrency: 5,
      },
    );

    this.queueEvents = new QueueEvents('acf-main', { connection });
    this.setupWorkerEvents();
    this.setupQueueEvents();
  }

  static getInstance(): QueueService {
    if (!QueueService.instance) {
      QueueService.instance = new QueueService();
    }
    return QueueService.instance;
  }

  async initialize(): Promise<void> {
    await this.queue.waitUntilReady();
    logger.info('✅ BullMQ Queue ready');
  }

  async addJob(payload: JobPayload): Promise<string> {
    const job = await this.queue.add(payload.type, payload, {
      priority: payload.priority || 5,
    });

    // Persist to DB
    await prisma.job.create({
      data: {
        id: job.id || undefined,
        type: payload.type,
        status: 'PENDING',
        priority: payload.priority || 5,
        input: payload.input,
        agentId: payload.agentId,
      },
    });

    logger.info(`📬 Job queued: ${payload.type} [${job.id}]`);
    emitSystemEvent(io, { type: 'JOB_QUEUED', message: `Job queued: ${payload.type}`, level: 'info' });

    return job.id!;
  }

  async getQueue(): Promise<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
  }> {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      this.queue.getWaitingCount(),
      this.queue.getActiveCount(),
      this.queue.getCompletedCount(),
      this.queue.getFailedCount(),
      this.queue.getDelayedCount(),
    ]);
    return { waiting, active, completed, failed, delayed };
  }

  async getJobs(status: 'waiting' | 'active' | 'completed' | 'failed', limit = 20): Promise<Job[]> {
    return this.queue.getJobs([status], 0, limit);
  }

  async cancelJob(jobId: string): Promise<void> {
    const job = await this.queue.getJob(jobId);
    if (job) await job.remove();
    await prisma.job.updateMany({
      where: { id: jobId },
      data: { status: 'CANCELLED' },
    });
  }

  async close(): Promise<void> {
    await this.worker.close();
    await this.queue.close();
    connection.disconnect();
  }

  private async processJob(job: Job<JobPayload>): Promise<unknown> {
    const { agentId, input } = job.data;
    const registry = AgentRegistry.getInstance();
    const agent = registry.getAgent(agentId);

    if (!agent) throw new Error(`Agent not found: ${agentId}`);

    await prisma.job.updateMany({
      where: { id: job.id },
      data: { status: 'RUNNING', startedAt: new Date() },
    });

    emitSystemEvent(io, {
      type: 'JOB_STARTED',
      message: `Job ${job.data.type} started`,
      level: 'info',
      jobId: job.id,
      agentId,
    });

    const result = await agent.execute({ ...input, jobId: job.id });

    await prisma.job.updateMany({
      where: { id: job.id },
      data: {
        status: 'COMPLETED',
        progress: 100,
        output: result as Record<string, unknown>,
        completedAt: new Date(),
      },
    });

    return result;
  }

  private setupWorkerEvents(): void {
    this.worker.on('completed', (job) => {
      logger.info(`✅ Job completed: ${job.id}`);
      emitSystemEvent(io, { type: 'JOB_COMPLETED', message: `Job completed: ${job.data.type}`, level: 'success', jobId: job.id });
      io.to(`job:${job.id}`).emit('job:completed', { jobId: job.id, result: job.returnvalue });
    });

    this.worker.on('failed', (job, err) => {
      logger.error(`❌ Job failed: ${job?.id} — ${err.message}`);
      if (job) {
        prisma.job.updateMany({ where: { id: job.id }, data: { status: 'FAILED', error: err.message } }).catch(() => {});
        emitSystemEvent(io, { type: 'JOB_FAILED', message: `Job failed: ${err.message}`, level: 'error', jobId: job.id });
      }
    });

    this.worker.on('progress', (job, progress) => {
      io.to(`job:${job.id}`).emit('job:progress', { jobId: job.id, progress });
    });
  }

  private setupQueueEvents(): void {
    this.queueEvents.on('waiting', ({ jobId }) => {
      io.emit('queue:update', { jobId, status: 'waiting' });
    });
    this.queueEvents.on('active', ({ jobId }) => {
      io.emit('queue:update', { jobId, status: 'active' });
    });
  }
}
