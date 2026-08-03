'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Bot, Play, Square, RefreshCw, TrendingUp, Download, FileText,
  Scissors, Film, Upload, BarChart3, Eye, Globe, Loader2, ChevronRight
} from 'lucide-react';
import { api, AgentStatus } from '@/lib/api';
import { cn, statusColors, statusDotColors } from '@/lib/utils';

const agentMeta: Record<string, { icon: React.ElementType; color: string; description: string; emoji: string }> = {
  'trend-hunter': { icon: TrendingUp, color: 'text-cyan-400', description: 'Discovers trending content across YouTube, Reddit, Google Trends', emoji: '🔍' },
  'research-agent': { icon: Globe, color: 'text-blue-400', description: 'Generates SEO, keywords, titles, hashtags via AI', emoji: '🔬' },
  'downloader': { icon: Download, color: 'text-violet-400', description: 'Downloads videos from YouTube, TikTok, Twitch via yt-dlp', emoji: '⬇️' },
  'transcriber': { icon: FileText, color: 'text-green-400', description: 'Transcribes audio using OpenAI Whisper with timestamps', emoji: '🎤' },
  'clip-detector': { icon: Scissors, color: 'text-amber-400', description: 'AI detects viral hooks, funny moments, emotional peaks', emoji: '✂️' },
  'video-editor': { icon: Film, color: 'text-pink-400', description: 'FFmpeg editor: trim, 9:16 reframe, enhance quality', emoji: '🎬' },
  'caption-agent': { icon: FileText, color: 'text-indigo-400', description: 'Generates dynamic SRT/VTT captions with emoji placement', emoji: '📝' },
  'thumbnail-agent': { icon: Eye, color: 'text-orange-400', description: 'Creates viral thumbnails using DALL-E 3', emoji: '🖼️' },
  'publisher': { icon: Upload, color: 'text-teal-400', description: 'Publishes to Google Drive, YouTube Shorts, TikTok', emoji: '📤' },
  'analytics-agent': { icon: BarChart3, color: 'text-rose-400', description: 'Tracks views, CTR, retention + AI recommendations', emoji: '📊' },
};

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAgents = async () => {
    try {
      const { agents } = await api.agents.list();
      setAgents(agents);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAgents(); const t = setInterval(fetchAgents, 5000); return () => clearInterval(t); }, []);

  const handleAction = async (agentId: string, action: 'start' | 'stop' | 'restart') => {
    setActionLoading(`${agentId}-${action}`);
    try { await api.agents[action](agentId); await fetchAgents(); }
    catch (e) { console.error(e); }
    finally { setActionLoading(null); }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Bot className="w-6 h-6 text-cyan-400" />AI Agents</h1>
          <p className="text-muted-foreground text-sm mt-1">{agents.filter(a => a.status === 'RUNNING').length} of {agents.length} agents active</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => agents.forEach(a => handleAction(a.id, 'start'))} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-all text-sm">
            <Play className="w-4 h-4" /> Start All
          </button>
          <button onClick={() => agents.forEach(a => handleAction(a.id, 'stop'))} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-sm">
            <Square className="w-4 h-4" /> Stop All
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent, i) => {
          const meta = agentMeta[agent.id] || { icon: Bot, color: 'text-cyan-400', description: '', emoji: '🤖' };
          const Icon = meta.icon;
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="glass-card p-5 hover:border-white/15 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className={cn('w-12 h-12 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-center text-xl shrink-0 relative', agent.status === 'RUNNING' && 'border-current glow-blue')}>
                  {meta.emoji}
                  <div className={cn('absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-background', statusDotColors[agent.status] || 'bg-gray-500')} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">{agent.name}</h3>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleAction(agent.id, 'restart')} disabled={!!actionLoading} className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-white transition-colors">
                        {actionLoading === `${agent.id}-restart` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                      </button>
                      {agent.status !== 'RUNNING' ? (
                        <button onClick={() => handleAction(agent.id, 'start')} disabled={!!actionLoading} className="p-1.5 rounded-lg hover:bg-green-500/20 text-green-400 transition-colors">
                          {actionLoading === `${agent.id}-start` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                        </button>
                      ) : (
                        <button onClick={() => handleAction(agent.id, 'stop')} disabled={!!actionLoading} className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors">
                          {actionLoading === `${agent.id}-stop` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Square className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>

                  <p className={cn('text-xs mt-0.5 font-medium', statusColors[agent.status] || 'text-gray-400')}>{agent.status}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{meta.description}</p>

                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="font-mono">{agent.tokensUsed.toLocaleString()} tokens</span>
                    <span>{agent.memoryMb.toFixed(0)} MB</span>
                    {agent.uptime && <span>{Math.floor(agent.uptime / 60)}m uptime</span>}
                  </div>

                  {agent.currentJob && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-cyan-400">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      {agent.currentJob}
                    </div>
                  )}
                </div>
              </div>

              {/* View logs link */}
              <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
                <Link href={`/agents/${agent.id}`} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-cyan-400 transition-colors">
                  View Console <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
