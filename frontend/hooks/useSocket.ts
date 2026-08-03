'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface LiveEvent {
  type: string;
  message: string;
  level: 'info' | 'success' | 'warning' | 'error';
  agentId?: string;
  jobId?: string;
  timestamp: string;
}

let socket: Socket | null = null;

export function useSocket() {
  const [connected, setConnected] = useState(false);
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const listenersRef = useRef<Map<string, (data: unknown) => void>>(new Map());

  useEffect(() => {
    if (!socket) {
      socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: Infinity,
      });
    }

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    // Subscribe to system events
    socket.emit('subscribe:system');

    socket.on('live:event', (event: LiveEvent) => {
      setEvents((prev) => [event, ...prev].slice(0, 200));
    });

    socket.on('system:event', (event: LiveEvent) => {
      setEvents((prev) => [event, ...prev].slice(0, 200));
    });

    return () => {
      socket?.off('connect');
      socket?.off('disconnect');
      socket?.off('live:event');
      socket?.off('system:event');
    };
  }, []);

  const subscribeToAgent = (agentId: string) => {
    socket?.emit('subscribe:agent', agentId);
  };

  const subscribeToJob = (jobId: string) => {
    socket?.emit('subscribe:job', jobId);
  };

  const on = (event: string, handler: (data: unknown) => void) => {
    socket?.on(event, handler);
    listenersRef.current.set(event, handler);
  };

  const off = (event: string) => {
    const handler = listenersRef.current.get(event);
    if (handler) socket?.off(event, handler);
    listenersRef.current.delete(event);
  };

  return { connected, events, subscribeToAgent, subscribeToJob, on, off, socket };
}
