'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Play, Square, RefreshCw, Trash2, Bot, Loader2 } from 'lucide-react';
import { api, AgentStatus, AgentLog } from '@/lib/api';
import { useSocket } from '@/hooks/useSocket';
import { cn, statusColors, statusDotColors } from '@/lib/utils';

const levelColors: Record<string, string> = {
  debug: 'text-gray-500',
  info: 'text-cyan-400',
  success: 'text-green-400',
  warning: 'text-yellow-400',
  error: 'text-red-400',
};

const levelPrefixes: Record<string, string> = {
  debug: 'DBG',
  info: 'INF',
  success: 'OK ',
  warning: 'WRN',
  error: 'ERR',
};

export default function AgentDetailPage() {
  const params = useParams();
  const agentId = params.id as string;
  const [agent, setAgent] = useState<AgentStatus | null>(null);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const { subscribeToAgent, on, off } = useSocket();

  const fetchAgent = async () => {
    try {
      const [status, logsData] = await Promise.all([
        api.agents.status(agentId),
        api.agents.logs(agentId, 200),
      ]);
      setAgent(status);
      setLogs(logsData.logs);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchAgent();
    subscribeToAgent(agentId);

    on('agent:log', (data: unknown) => {
      const d = data as AgentLog & { agentId: string };
      if (d.agentId === agentId) {
        setLogs((prev) => [...prev, d].slice(-500));
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    });

    const interval = setInterval(fetchAgent, 5000);
    return () => { clearInterval(interval); off('agent:log'); };
  }, [agentId]);

  const handleAction = async (action: 'start' | 'stop' | 'restart') => {
    setActionLoading(action);
    try { await api.agents[action](agentId); await fetchAgent(); }
    catch (e) { console.error(e); }
    finally { setActionLoading(null); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-cyan-400 animate-spin" /></div>;
  if (!agent) return <div className="text-muted-foreground">Agent not found</div>;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-center text-3xl">
              🤖
              <div className={cn('absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background', statusDotColors[agent.status] || 'bg-gray-500')} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{agent.name}</h1>
              <p className={cn('text-sm font-medium', statusColors[agent.status])}>{agent.status}</p>
              {agent.currentJob && <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" />{agent.currentJob}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {agent.status !== 'RUNNING' ? (
              <button onClick={() => handleAction('start')} disabled={!!actionLoading} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-all text-sm">
                {actionLoading === 'start' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />} Start
              </button>
            ) : (
              <button onClick={() => handleAction('stop')} disabled={!!actionLoading} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-sm">
                {actionLoading === 'stop' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Square className="w-4 h-4" />} Stop
              </button>
            )}
            <button onClick={() => handleAction('restart')} disabled={!!actionLoading} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all text-sm">
              <RefreshCw className={cn('w-4 h-4', actionLoading === 'restart' && 'animate-spin')} /> Restart
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t border-white/5">
          {[
            { label: 'Tokens Used', value: agent.tokensUsed.toLocaleString() },
            { label: 'Memory', value: `${agent.memoryMb.toFixed(0)} MB` },
            { label: 'CPU', value: `${agent.cpuPercent.toFixed(1)}%` },
            { label: 'Uptime', value: agent.uptime ? `${Math.floor(agent.uptime / 60)}m` : 'N/A' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-lg font-bold font-mono text-white">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Live Console */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Bot className="w-4 h-4 text-green-400" /> Live Console
          </h2>
          <button onClick={() => setLogs([])} className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="terminal h-80 p-4 overflow-y-auto">
          {logs.length === 0 && <p className="text-green-400/50 text-xs">$ Waiting for output...</p>}
          {logs.map((log, i) => (
            <div key={i} className="flex items-start gap-3 mb-1 text-xs leading-relaxed">
              <span className="text-muted-foreground/50 font-mono shrink-0">
                {new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false })}
              </span>
              <span className={cn('font-bold shrink-0 font-mono', levelColors[log.level] || 'text-gray-400')}>
                {levelPrefixes[log.level] || 'LOG'}
              </span>
              <span className={cn('flex-1', levelColors[log.level] || 'text-gray-300')}>{log.message}</span>
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </motion.div>
    </div>
  );
}
