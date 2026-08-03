'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Users, Sparkles, MapPin, Search, Play, Square,
  CheckCircle2, AlertCircle, Clock, Loader2, Bot,
  ExternalLink, Send, Zap, ChevronRight, Activity
} from 'lucide-react';
import Link from 'next/link';
import { api, AgentStatus, BusinessLead, QueueStats } from '@/lib/api';
import { useSocket } from '@/hooks/useSocket';
import { cn, statusColors, statusDotColors, timeAgo } from '@/lib/utils';
import { Hero3D } from '@/components/3d/Hero3D';

export default function CommandCenter() {
  const [statusData, setStatusData] = useState<Record<string, unknown> | null>(null);
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [recentLeads, setRecentLeads] = useState<BusinessLead[]>([]);
  const [searchCategory, setSearchCategory] = useState('Resort');
  const [searchLocation, setSearchLocation] = useState('Miami, FL');
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  const { events, connected } = useSocket();

  const fetchData = async () => {
    try {
      const [st, ag, ld] = await Promise.allSettled([
        api.status(),
        api.agents.list(),
        api.leads.list({ limit: 6 }),
      ]);

      if (st.status === 'fulfilled') setStatusData(st.value);
      if (ag.status === 'fulfilled') setAgents(ag.value.agents);
      if (ld.status === 'fulfilled') setRecentLeads(ld.value.leads);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const t = setInterval(fetchData, 8000);
    return () => clearInterval(t);
  }, []);

  const handleSearchMaps = async () => {
    if (!searchCategory || !searchLocation) return;
    setSearching(true);
    try {
      await api.maps.search(searchCategory, searchLocation, 10);
      setTimeout(fetchData, 1000);
    } catch (e) {
      console.error(e);
    } finally {
      setSearching(false);
    }
  };

  const handleGenerateWebsite = async (leadId: string) => {
    try {
      await api.website.generate(leadId);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const st = statusData as { leads?: { total?: number; stages?: Record<string, number> }; queue?: QueueStats } | null;
  const totalLeads = st?.leads?.total || recentLeads.length;
  const runningAgents = agents.filter((a) => a.status === 'RUNNING').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div className="flex flex-col items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center glow-blue">
            <Globe className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-muted-foreground text-sm font-mono">Initializing AI Lead Gen Platform...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1600px] pb-12">
      {/* 3D WebGL Hero Canvas Section */}
      <Hero3D />

      <div id="dashboard" className="space-y-6 pt-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neon-blue flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-cyan-400" /> Lead Gen Command Center
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Autonomous business discovery, AI website generation & outreach studio</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <div className={cn('w-2 h-2 rounded-full', connected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400')} />
            {connected ? 'Realtime Socket Connected' : 'Connecting...'}
          </div>
        </motion.div>

        {/* Discovery Search Banner */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 border-cyan-500/20 glow-blue">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Find New Business Leads</h3>
                <p className="text-xs text-muted-foreground">Search Google Maps by industry & city to trigger automated audits & website builds</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <input
                type="text"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                placeholder="Category (e.g. Resort, Dental Clinic)"
                className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500"
              />
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Location (e.g. Miami, FL)"
                className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleSearchMaps}
                disabled={searching}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 font-semibold text-xs text-white hover:opacity-90 transition-all shrink-0"
              >
                {searching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                Discover Leads
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { label: 'Total Leads Found', value: totalLeads, icon: Users, color: 'text-cyan-400' },
            { label: 'No Website (Urgent)', value: recentLeads.filter((l) => !l.hasWebsite).length, icon: AlertCircle, color: 'text-amber-400' },
            { label: 'Websites Built', value: st?.leads?.stages?.WEBSITE_GENERATED || 0, icon: Globe, color: 'text-emerald-400' },
            { label: 'Outreach Sent', value: st?.leads?.stages?.OUTREACH_SENT || 0, icon: Send, color: 'text-indigo-400' },
            { label: 'Active Agents', value: `${runningAgents}/${agents.length}`, icon: Bot, color: 'text-violet-400' },
            { label: 'n8n Status', value: 'Active', icon: Activity, color: 'text-orange-400' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="glass-card p-4 hover:border-white/15 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={cn('w-4 h-4', stat.color)} />
              </div>
              <div className={cn('text-2xl font-bold font-mono', stat.color)}>{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Target Leads Table */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" /> Recent Target Leads
              </h2>
              <Link href="/crm" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
                View Full CRM <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentLeads.map((lead, i) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-white/15 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-white shrink-0">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white text-sm">{lead.name}</h3>
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase',
                          lead.priority === 'HIGH' || lead.priority === 'URGENT' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-400'
                        )}>
                          Score {lead.leadScore}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {lead.category} · {lead.address || 'Local Region'} · Rating: {lead.rating || 'N/A'} ★
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {!lead.hasWebsite ? (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-medium">⚠️ No Website</span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium">🌐 Has Website</span>
                        )}
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Stage: {lead.pipelineStage}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                    {lead.websiteDemos && lead.websiteDemos.length > 0 ? (
                      <Link
                        href={`/website-preview/${lead.websiteDemos[0].slug}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs hover:bg-emerald-500/20 transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Preview Demo
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleGenerateWebsite(lead.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs hover:bg-cyan-500/20 transition"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Generate Demo
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
              {recentLeads.length === 0 && (
                <div className="glass-card p-8 text-center text-muted-foreground text-sm">
                  No leads discovered yet. Click "Discover Leads" above to start!
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Events & AI Agents */}
          <div className="space-y-4">
            {/* Live Events */}
            <div className="glass-card p-4">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" /> Live Automation Events
              </h2>
              <div className="space-y-2 max-h-56 overflow-y-auto font-mono text-xs">
                <AnimatePresence initial={false}>
                  {events.slice(0, 12).map((evt, idx) => (
                    <div key={`${evt.timestamp}-${idx}`} className="flex items-start gap-2 border-b border-white/5 pb-1.5">
                      <span className="text-muted-foreground/60 shrink-0">
                        {new Date(evt.timestamp).toLocaleTimeString('en-US', { hour12: false })}
                      </span>
                      <span className={cn(
                        'flex-1 truncate',
                        evt.level === 'error' ? 'text-red-400' : evt.level === 'success' ? 'text-emerald-400' : 'text-slate-300'
                      )}>
                        {evt.message}
                      </span>
                    </div>
                  ))}
                </AnimatePresence>
                {events.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">Listening for live events...</p>
                )}
              </div>
            </div>

            {/* AI Agents Mini Overview */}
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Bot className="w-4 h-4 text-violet-400" /> AI Agents ({agents.length})
                </h2>
                <Link href="/agents" className="text-xs text-cyan-400 hover:underline">Manage</Link>
              </div>
              <div className="space-y-2">
                {agents.slice(0, 5).map((ag) => (
                  <div key={ag.id} className="flex items-center justify-between p-2 rounded-lg bg-black/20 text-xs">
                    <div className="flex items-center gap-2">
                      <div className={cn('w-2 h-2 rounded-full', statusDotColors[ag.status] || 'bg-slate-500')} />
                      <span className="font-medium text-white">{ag.name}</span>
                    </div>
                    <span className={cn('font-mono', statusColors[ag.status])}>{ag.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
