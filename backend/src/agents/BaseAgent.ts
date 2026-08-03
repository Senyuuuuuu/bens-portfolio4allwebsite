import { EventEmitter } from 'events';
import { PrismaClient, AgentStatus, AgentType } from '@prisma/client';
import { logger } from '../services/logger.service';
import { io } from '../index';
import { emitSystemEvent } from '../socket';

const prisma = new PrismaClient();

export interface AgentConfig {
  id: string;
  name: string;
  type: AgentType;
}

export interface AgentLog {
  level: 'debug' | 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: string;
  meta?: Record<string, unknown>;
}

export abstract class BaseAgent extends EventEmitter {
  public readonly id: string;
  public readonly name: string;
  public readonly type: AgentType;
  protected status: AgentStatus = AgentStatus.IDLE;
  protected currentJob: string | null = null;
  protected memoryMb = 0;
  protected cpuPercent = 0;
  protected tokensUsed = 0;
  protected logs: AgentLog[] = [];
  protected startTime: Date | null = null;

  constructor(idOrConfig: string | AgentConfig, name?: string, type?: AgentType) {
    super();
    if (typeof idOrConfig === 'string') {
      this.id = idOrConfig;
      this.name = name || idOrConfig;
      this.type = type || (AgentType.CUSTOM as AgentType);
    } else {
      this.id = idOrConfig.id;
      this.name = idOrConfig.name;
      this.type = idOrConfig.type;
    }
  }

  // ─── Lifecycle ─────────────────────────────────────────────────────────────
  async start(): Promise<void> {
    if (this.status === AgentStatus.RUNNING) {
      this.log('warning', `Agent ${this.name} is already running`);
      return;
    }
    this.status = AgentStatus.RUNNING;
    this.startTime = new Date();
    this.log('info', `🚀 Agent ${this.name} started`);
    await this.persistStatus();
    this.emit('started', { agentId: this.id });
    emitSystemEvent(io, {
      type: 'AGENT_STARTED',
      message: `Agent ${this.name} started`,
      level: 'success',
      agentId: this.id,
    });
  }

  async stop(): Promise<void> {
    this.status = AgentStatus.STOPPING;
    this.log('info', `🛑 Agent ${this.name} stopping...`);
    await this.onStop();
    this.status = AgentStatus.STOPPED;
    this.currentJob = null;
    await this.persistStatus();
    this.emit('stopped', { agentId: this.id });
    emitSystemEvent(io, {
      type: 'AGENT_STOPPED',
      message: `Agent ${this.name} stopped`,
      level: 'warning',
      agentId: this.id,
    });
  }

  async restart(): Promise<void> {
    await this.stop();
    await new Promise((r) => setTimeout(r, 500));
    await this.start();
    this.emit('restarted', { agentId: this.id });
  }

  // ─── Status ────────────────────────────────────────────────────────────────
  getStatus(): {
    id: string;
    name: string;
    type: AgentType;
    status: AgentStatus;
    currentJob: string | null;
    memoryMb: number;
    cpuPercent: number;
    tokensUsed: number;
    startTime: Date | null;
    uptime: number | null;
  } {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      status: this.status,
      currentJob: this.currentJob,
      memoryMb: this.memoryMb,
      cpuPercent: this.cpuPercent,
      tokensUsed: this.tokensUsed,
      startTime: this.startTime,
      uptime: this.startTime ? Math.floor((Date.now() - this.startTime.getTime()) / 1000) : null,
    };
  }

  getLogs(limit = 100): AgentLog[] {
    return this.logs.slice(-limit);
  }

  clearLogs(): void {
    this.logs = [];
  }

  // ─── Logging ───────────────────────────────────────────────────────────────
  protected log(level: AgentLog['level'], message: string, meta?: Record<string, unknown>): void {
    const entry: AgentLog = {
      level,
      message,
      timestamp: new Date().toISOString(),
      meta,
    };
    this.logs.push(entry);
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-500);
    }
    logger[level === 'success' ? 'info' : level](`[${this.name}] ${message}`);
    // Broadcast to subscribed clients
    io.to(`agent:${this.id}`).emit('agent:log', {
      agentId: this.id,
      ...entry,
    });
    emitSystemEvent(io, {
      type: 'AGENT_LOG',
      message,
      level: level === 'success' ? 'success' : (level as 'info' | 'warning' | 'error'),
      agentId: this.id,
    });
  }

  protected setCurrentJob(jobId: string | null): void {
    this.currentJob = jobId;
    io.to(`agent:${this.id}`).emit('agent:job_update', {
      agentId: this.id,
      jobId,
    });
  }

  protected updateTokens(count: number): void {
    this.tokensUsed += count;
  }

  // ─── Persistence ───────────────────────────────────────────────────────────
  protected async persistStatus(): Promise<void> {
    try {
      await prisma.agent.upsert({
        where: { id: this.id },
        update: {
          status: this.status,
          currentJob: this.currentJob,
          memoryMb: this.memoryMb,
          cpuPercent: this.cpuPercent,
          tokensUsed: this.tokensUsed,
          lastStarted: this.startTime ?? undefined,
          updatedAt: new Date(),
        },
        create: {
          id: this.id,
          name: this.name,
          type: this.type,
          status: this.status,
        },
      });
    } catch (err) {
      logger.error(`Failed to persist agent status: ${err}`);
    }
  }

  // ─── Abstract methods ──────────────────────────────────────────────────────
  abstract execute(input: Record<string, unknown>): Promise<Record<string, unknown>>;
  protected abstract onStop(): Promise<void>;
}
