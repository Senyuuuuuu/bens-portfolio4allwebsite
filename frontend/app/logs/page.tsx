'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, Trash2, Download, Filter } from 'lucide-react';
import { api, LogEntry } from '@/lib/api';
import { useSocket } from '@/hooks/useSocket';
import { cn } from '@/lib/utils';

const levelColors: Record<string, { text: string; bg: string; label: string }> = {
  DEBUG:   { text: 'text-gray-400',   bg: 'bg-gray-500/10',   label: 'DBG' },
  INFO:    { text: 'text-cyan-400',   bg: 'bg-cyan-500/10',   label: 'INF' },
  SUCCESS: { text: 'text-green-400',  bg: 'bg-green-500/10',  label: 'OK!' },
  WARNING: { text: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'WRN' },
  ERROR:   { text: 'text-red-400',    bg: 'bg-red-500/10',    label: 'ERR' },
};

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<string>('ALL');
  const [autoScroll, setAutoScroll] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { events } = useSocket();

  useEffect(() => {
    api.logs({ limit: 200 }).then(({ logs }) => setLogs(logs)).catch(console.error);
  }, []);

  useEffect(() => {
    const newLogs = events.map((e) => ({
      id: e.timestamp,
      level: e.level?.toUpperCase() || 'INFO',
      message: e.message,
      agentId: e.agentId,
      jobId: e.jobId,
      timestamp: e.timestamp,
    }));
    if (newLogs.length) setLogs((prev) => [...newLogs, ...prev].slice(0, 1000));
  }, [events]);

  useEffect(() => {
    if (autoScroll) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, autoScroll]);

  const filtered = filter === 'ALL' ? logs : logs.filter((l) => l.level === filter);

  const exportLogs = () => {
    const text = filtered.map((l) => `[${l.timestamp}] ${l.level} ${l.message}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'acf-logs.txt'; a.click();
  };

  return (
    <div className="space-y-4 h-full flex flex-col max-w-5xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><TerminalIcon className="w-6 h-6 text-green-400" />Live Logs</h1>
          <p className="text-muted-foreground text-sm mt-1">{filtered.length} entries — streaming in real-time</p>
        </div>
        <div className="flex items-center gap-2">
          {['ALL', 'INFO', 'SUCCESS', 'WARNING', 'ERROR'].map((level) => (
            <button key={level} onClick={() => setFilter(level)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                filter === level ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400' : 'text-muted-foreground hover:text-white hover:bg-white/5')}>
              {level}
            </button>
          ))}
          <button onClick={() => setLogs([])} className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"><Trash2 className="w-4 h-4" /></button>
          <button onClick={exportLogs} className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"><Download className="w-4 h-4" /></button>
        </div>
      </motion.div>

      {/* Terminal */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 terminal overflow-hidden flex flex-col">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-green-500/10 bg-black/20">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs text-muted-foreground font-mono ml-2">acf-factory — logs</span>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400 font-mono">LIVE</span>
          </div>
        </div>

        {/* Log content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-0.5" onScroll={(e) => {
          const el = e.currentTarget;
          setAutoScroll(el.scrollHeight - el.scrollTop - el.clientHeight < 50);
        }}>
          <p className="text-green-400/50 text-xs font-mono mb-2">AI Content Factory v1.0.0 — Log Stream Active</p>
          <AnimatePresence initial={false}>
            {filtered.map((log, i) => {
              const lvl = levelColors[log.level] || levelColors.INFO;
              return (
                <motion.div
                  key={`${log.id}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn('flex items-start gap-3 px-2 py-0.5 rounded font-mono text-xs leading-5 hover:bg-white/5 transition-colors group', lvl.bg)}
                >
                  <span className="text-muted-foreground/60 shrink-0 w-20">
                    {new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false })}
                  </span>
                  <span className={cn('font-bold shrink-0 w-8', lvl.text)}>{lvl.label}</span>
                  {log.agentId && <span className="text-muted-foreground/50 shrink-0 w-28 truncate">[{log.agentId}]</span>}
                  <span className={cn('flex-1 whitespace-pre-wrap break-all', lvl.text)}>{log.message}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
      </motion.div>
    </div>
  );
}
