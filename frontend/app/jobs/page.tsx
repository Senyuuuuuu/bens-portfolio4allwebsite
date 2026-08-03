'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ListTodo, Clock, CheckCircle2, XCircle, Loader2, Pause, RotateCcw, X, AlertTriangle } from 'lucide-react';
import { api, Job, QueueStats } from '@/lib/api';
import { cn, timeAgo } from '@/lib/utils';

const statusConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  PENDING:   { icon: Clock,         color: 'text-amber-400',  bg: 'bg-amber-500/10'  },
  RUNNING:   { icon: Loader2,       color: 'text-cyan-400',   bg: 'bg-cyan-500/10'   },
  COMPLETED: { icon: CheckCircle2,  color: 'text-green-400',  bg: 'bg-green-500/10'  },
  FAILED:    { icon: XCircle,       color: 'text-red-400',    bg: 'bg-red-500/10'    },
  CANCELLED: { icon: Pause,         color: 'text-gray-400',   bg: 'bg-gray-500/10'   },
  RETRYING:  { icon: RotateCcw,     color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [queueStats, setQueueStats] = useState<QueueStats | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const { jobs, queueStats } = await api.jobs.list({ limit: 50, status: statusFilter !== 'ALL' ? statusFilter : undefined });
      setJobs(jobs); setQueueStats(queueStats);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); const t = setInterval(fetchJobs, 5000); return () => clearInterval(t); }, [statusFilter]);

  const handleCancel = async (jobId: string) => {
    await api.jobs.cancel(jobId); fetchJobs();
  };
  const handleRetry = async (jobId: string) => {
    await api.jobs.retry(jobId); fetchJobs();
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><ListTodo className="w-6 h-6 text-amber-400" />Job Queue</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage and monitor all background jobs</p>
        </div>
      </motion.div>

      {/* Queue Stats */}
      {queueStats && (
        <div className="grid grid-cols-5 gap-3">
          {[
            { label: 'Waiting', value: queueStats.waiting, color: 'text-amber-400' },
            { label: 'Active', value: queueStats.active, color: 'text-cyan-400' },
            { label: 'Completed', value: queueStats.completed, color: 'text-green-400' },
            { label: 'Failed', value: queueStats.failed, color: 'text-red-400' },
            { label: 'Delayed', value: queueStats.delayed, color: 'text-violet-400' },
          ].map((s) => (
            <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-4 text-center">
              <div className={cn('text-2xl font-bold font-mono', s.color)}>{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2">
        {['ALL', 'PENDING', 'RUNNING', 'COMPLETED', 'FAILED'].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              statusFilter === s ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400' : 'text-muted-foreground hover:text-white hover:bg-white/5')}>
            {s}
          </button>
        ))}
      </div>

      {/* Jobs Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Agent</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Priority</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Progress</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Created</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {jobs.map((job) => {
                const status = statusConfig[job.status] || statusConfig.PENDING;
                const Icon = status.icon;
                return (
                  <tr key={job.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className={cn('flex items-center gap-1.5 px-2 py-1 rounded-full w-fit text-xs font-medium', status.bg, status.color)}>
                        <Icon className={cn('w-3 h-3', job.status === 'RUNNING' && 'animate-spin')} />
                        {job.status}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{job.type}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{job.agent?.name || job.agentId || '—'}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{job.priority}</td>
                    <td className="px-4 py-3">
                      <div className="w-20 bg-black/30 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-300" style={{ width: `${job.progress}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground mt-0.5">{job.progress}%</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{timeAgo(job.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {job.status === 'FAILED' && (
                          <button onClick={() => handleRetry(job.id)} className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-400 transition-colors" title="Retry">
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {(job.status === 'PENDING' || job.status === 'RUNNING') && (
                          <button onClick={() => handleCancel(job.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors" title="Cancel">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {jobs.length === 0 && !loading && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground text-sm">No jobs found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
