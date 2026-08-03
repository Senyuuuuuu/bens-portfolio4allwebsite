import { Server as SocketIOServer, Socket } from 'socket.io';
import { logger } from './services/logger.service';
import { AgentRegistry } from './agents/AgentRegistry';

export function setupSocketIO(io: SocketIOServer): void {
  io.on('connection', (socket: Socket) => {
    logger.info(`🔌 Client connected: ${socket.id}`);

    // Subscribe to agent events
    socket.on('subscribe:agent', (agentId: string) => {
      socket.join(`agent:${agentId}`);
      logger.debug(`Client ${socket.id} subscribed to agent:${agentId}`);
    });

    socket.on('unsubscribe:agent', (agentId: string) => {
      socket.leave(`agent:${agentId}`);
    });

    // Subscribe to job events
    socket.on('subscribe:job', (jobId: string) => {
      socket.join(`job:${jobId}`);
    });

    socket.on('unsubscribe:job', (jobId: string) => {
      socket.leave(`job:${jobId}`);
    });

    // Subscribe to system events
    socket.on('subscribe:system', () => {
      socket.join('system');
    });

    // Agent control commands via socket
    socket.on('agent:start', async (data: { agentId: string }) => {
      const registry = AgentRegistry.getInstance();
      const agent = registry.getAgent(data.agentId);
      if (agent) {
        await agent.start();
        io.to(`agent:${data.agentId}`).emit('agent:started', { agentId: data.agentId });
      }
    });

    socket.on('agent:stop', async (data: { agentId: string }) => {
      const registry = AgentRegistry.getInstance();
      const agent = registry.getAgent(data.agentId);
      if (agent) {
        await agent.stop();
        io.to(`agent:${data.agentId}`).emit('agent:stopped', { agentId: data.agentId });
      }
    });

    socket.on('disconnect', () => {
      logger.debug(`🔌 Client disconnected: ${socket.id}`);
    });
  });
}

// ─── Emit helpers (used throughout the app) ──────────────────────────────────
export function emitToAll(io: SocketIOServer, event: string, data: unknown): void {
  io.emit(event, data);
}

export function emitToRoom(io: SocketIOServer, room: string, event: string, data: unknown): void {
  io.to(room).emit(event, data);
}

export function emitSystemEvent(io: SocketIOServer, event: {
  type: string;
  message: string;
  level?: 'info' | 'success' | 'warning' | 'error';
  agentId?: string;
  jobId?: string;
  data?: unknown;
}): void {
  const payload = {
    ...event,
    timestamp: new Date().toISOString(),
    level: event.level || 'info',
  };
  io.to('system').emit('system:event', payload);
  io.emit('live:event', payload);
}
