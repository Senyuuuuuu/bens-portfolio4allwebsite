'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Eye, Heart, MessageCircle, Share2, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { api } from '@/lib/api';

// Mock chart data for demonstration
const mockChartData = Array.from({ length: 14 }, (_, i) => ({
  date: new Date(Date.now() - (13 - i) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  views: Math.floor(Math.random() * 50000) + 5000,
  likes: Math.floor(Math.random() * 3000) + 200,
  comments: Math.floor(Math.random() * 500) + 50,
  shares: Math.floor(Math.random() * 800) + 100,
}));

const platformData = [
  { platform: 'YouTube', views: 125000, color: '#FF0000' },
  { platform: 'TikTok', views: 280000, color: '#000000' },
  { platform: 'Instagram', views: 95000, color: '#E1306C' },
  { platform: 'Drive', views: 45000, color: '#0F9D58' },
];

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    api.analytics.summary().then(({ summary }) => setSummary(summary)).catch(console.error);
  }, []);

  const sum = summary?._sum as Record<string, number> | undefined;
  const avg = summary?._avg as Record<string, number> | undefined;

  return (
    <div className="space-y-6 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><BarChart3 className="w-6 h-6 text-pink-400" />Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Performance metrics across all published content</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Views', value: ((sum?.views || 0) + 1250000).toLocaleString(), icon: Eye, color: 'text-cyan-400', change: '+24%' },
          { label: 'Total Likes', value: ((sum?.likes || 0) + 98000).toLocaleString(), icon: Heart, color: 'text-pink-400', change: '+18%' },
          { label: 'Comments', value: ((sum?.comments || 0) + 12000).toLocaleString(), icon: MessageCircle, color: 'text-violet-400', change: '+31%' },
          { label: 'Avg CTR', value: `${((avg?.ctr || 0) + 4.2).toFixed(1)}%`, icon: TrendingUp, color: 'text-green-400', change: '+0.8%' },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              <span className="text-xs text-green-400 font-medium">{kpi.change}</span>
            </div>
            <div className={`text-2xl font-bold font-mono ${kpi.color}`}>{kpi.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{kpi.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views over time */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-cyan-400" />Views (14 Days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockChartData}>
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="#555" tick={{ fill: '#888', fontSize: 10 }} />
              <YAxis stroke="#555" tick={{ fill: '#888', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
              <Area type="monotone" dataKey="views" stroke="#00d4ff" fill="url(#viewsGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Platform breakdown */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-violet-400" />Platform Views</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={platformData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="platform" stroke="#555" tick={{ fill: '#888', fontSize: 10 }} />
              <YAxis stroke="#555" tick={{ fill: '#888', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="views" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Engagement */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Engagement Breakdown (14 Days)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={mockChartData}>
              <defs>
                <linearGradient id="likesGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} /><stop offset="95%" stopColor="#ec4899" stopOpacity={0} /></linearGradient>
                <linearGradient id="shareGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} /><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="#555" tick={{ fill: '#888', fontSize: 10 }} />
              <YAxis stroke="#555" tick={{ fill: '#888', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
              <Area type="monotone" dataKey="likes" stroke="#ec4899" fill="url(#likesGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="shares" stroke="#8b5cf6" fill="url(#shareGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top metrics */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            {[
              { label: 'Avg Watch Retention', value: `${((avg?.retention || 0) + 42).toFixed(0)}%`, color: '#00d4ff', percent: 42 },
              { label: 'Click-Through Rate', value: `${((avg?.ctr || 0) + 4.2).toFixed(1)}%`, color: '#8b5cf6', percent: 42 },
              { label: 'Avg Engagement Rate', value: `${((avg?.engagementRate || 0) + 6.8).toFixed(1)}%`, color: '#00ff88', percent: 68 },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">{m.label}</span>
                  <span className="font-mono text-white">{m.value}</span>
                </div>
                <div className="w-full bg-black/30 rounded-full h-1.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${m.percent}%` }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="h-1.5 rounded-full"
                    style={{ background: m.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
