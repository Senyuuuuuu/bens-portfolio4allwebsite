'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, LayoutGrid, List, Search, Filter, Sparkles,
  Globe, Send, Phone, Mail, ExternalLink, MoreVertical,
  CheckCircle2, Clock, AlertTriangle, ArrowRight, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { api, BusinessLead } from '@/lib/api';
import { cn } from '@/lib/utils';

const stages = [
  { id: 'QUALIFIED', label: 'Qualified Leads', color: 'border-cyan-500/50 bg-cyan-500/5 text-cyan-400' },
  { id: 'WEBSITE_AUDITED', label: 'Audited', color: 'border-blue-500/50 bg-blue-500/5 text-blue-400' },
  { id: 'WEBSITE_GENERATED', label: 'Website Built', color: 'border-emerald-500/50 bg-emerald-500/5 text-emerald-400' },
  { id: 'OUTREACH_DRAFTED', label: 'Outreach Drafted', color: 'border-indigo-500/50 bg-indigo-500/5 text-indigo-400' },
  { id: 'OUTREACH_SENT', label: 'Outreach Sent', color: 'border-violet-500/50 bg-violet-500/5 text-violet-400' },
  { id: 'INTERESTED', label: 'Interested', color: 'border-amber-500/50 bg-amber-500/5 text-amber-400' },
  { id: 'MEETING_SCHEDULED', label: 'Meeting Set', color: 'border-pink-500/50 bg-pink-500/5 text-pink-400' },
  { id: 'WON', label: 'Closed Won', color: 'border-green-500/50 bg-green-500/10 text-green-400' },
];

export default function CRMPage() {
  const [leads, setLeads] = useState<BusinessLead[]>([]);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const { leads } = await api.leads.list({ limit: 100 });
      setLeads(leads);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStageChange = async (leadId: string, newStage: string) => {
    try {
      await api.crm.updateStage(leadId, newStage);
      fetchLeads();
    } catch (e) {
      console.error(e);
    }
  };

  const handleTriggerAction = async (action: 'audit' | 'generate' | 'outreach', leadId: string) => {
    try {
      if (action === 'audit') await api.website.audit(leadId);
      if (action === 'generate') await api.website.generate(leadId);
      if (action === 'outreach') await api.outreach.generate(leadId);
      setTimeout(fetchLeads, 1000);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredLeads = leads.filter((l) => {
    const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (l.address || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = selectedStage === 'ALL' || l.pipelineStage === selectedStage;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-y-6 max-w-[1700px] pb-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" /> CRM Lead Pipeline
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Track business leads from discovery to website generation & outreach conversion</p>
        </div>

        {/* View mode & search controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search business name or location..."
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex gap-1 p-1 glass-card shrink-0">
            <button
              onClick={() => setViewMode('kanban')}
              className={cn('p-2 rounded-lg text-xs font-medium transition', viewMode === 'kanban' ? 'bg-white/10 text-white' : 'text-muted-foreground')}
              title="Kanban View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={cn('p-2 rounded-lg text-xs font-medium transition', viewMode === 'table' ? 'bg-white/10 text-white' : 'text-muted-foreground')}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Kanban View */}
      {viewMode === 'kanban' ? (
        <div className="flex gap-4 overflow-x-auto pb-6 min-h-[600px] scrollbar-thin">
          {stages.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.pipelineStage === stage.id);
            return (
              <div key={stage.id} className="w-80 shrink-0 flex flex-col glass-card p-3 rounded-2xl border-t-2 border-t-current" style={{ borderTopColor: stage.color.split(' ')[0].replace('border-', '') }}>
                {/* Stage Header */}
                <div className="flex items-center justify-between px-2 py-1.5 mb-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{stage.label}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-black/40 text-muted-foreground">{stageLeads.length}</span>
                </div>

                {/* Stage Cards */}
                <div className="flex-1 space-y-3 overflow-y-auto max-h-[700px] pr-1">
                  {stageLeads.map((lead) => (
                    <motion.div
                      key={lead.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="glass-card p-4 hover:border-white/20 transition-all bg-slate-900/60 group"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-white text-sm leading-snug">{lead.name}</h4>
                        <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded', lead.hasWebsite ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400')}>
                          {lead.hasWebsite ? 'Has Site' : 'No Site'}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground mt-1">{lead.category} · {lead.address || 'Local'}</p>

                      {/* Opportunity Lead Score */}
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Lead Score:</span>
                        <span className="font-bold font-mono text-cyan-400">{lead.leadScore}/100</span>
                      </div>

                      {/* Actions */}
                      <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center gap-1.5">
                        {lead.websiteDemos && lead.websiteDemos.length > 0 ? (
                          <Link
                            href={`/website-preview/${lead.websiteDemos[0].slug}`}
                            className="flex-1 text-center py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-[11px] font-medium hover:bg-emerald-500/20 transition"
                          >
                            Preview Demo
                          </Link>
                        ) : (
                          <button
                            onClick={() => handleTriggerAction('generate', lead.id)}
                            className="flex-1 text-center py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 text-[11px] font-medium hover:bg-cyan-500/20 transition flex items-center justify-center gap-1"
                          >
                            <Sparkles className="w-3 h-3" /> Build Site
                          </button>
                        )}

                        <button
                          onClick={() => handleTriggerAction('outreach', lead.id)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[11px]"
                          title="Generate Outreach Draft"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  {stageLeads.length === 0 && (
                    <div className="h-32 flex items-center justify-center border border-dashed border-white/5 rounded-xl text-xs text-muted-foreground">
                      Empty stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Data Table View */
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="border-b border-white/5 text-xs text-muted-foreground uppercase tracking-wider bg-black/20">
                <tr>
                  <th className="px-4 py-3">Business</th>
                  <th className="px-4 py-3">Website Status</th>
                  <th className="px-4 py-3">Lead Score</th>
                  <th className="px-4 py-3">Pipeline Stage</th>
                  <th className="px-4 py-3">Contact Info</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-white text-sm">{lead.name}</div>
                      <div className="text-xs text-muted-foreground">{lead.category} · {lead.address || 'Local Region'}</div>
                    </td>
                    <td className="px-4 py-3">
                      {!lead.hasWebsite ? (
                        <span className="px-2 py-0.5 rounded text-xs bg-red-500/10 text-red-400 font-medium border border-red-500/20">⚠️ No Website</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20">🌐 Existing Site</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-cyan-400">{lead.leadScore}/100</td>
                    <td className="px-4 py-3">
                      <select
                        value={lead.pipelineStage}
                        onChange={(e) => handleStageChange(lead.id, e.target.value)}
                        className="bg-black/40 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                      >
                        {stages.map((s) => (
                          <option key={s.id} value={s.id} className="bg-slate-900">{s.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                      <div>{lead.phone || 'No Phone'}</div>
                      <div>{lead.email || 'No Email'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {lead.websiteDemos && lead.websiteDemos.length > 0 ? (
                          <Link href={`/website-preview/${lead.websiteDemos[0].slug}`} className="px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs hover:bg-emerald-500/20 transition">
                            Preview
                          </Link>
                        ) : (
                          <button onClick={() => handleTriggerAction('generate', lead.id)} className="px-3 py-1 rounded bg-cyan-500/10 text-cyan-400 text-xs hover:bg-cyan-500/20 transition">
                            Build Demo
                          </button>
                        )}
                        <button onClick={() => handleTriggerAction('outreach', lead.id)} className="px-3 py-1 rounded bg-indigo-500/10 text-indigo-400 text-xs hover:bg-indigo-500/20 transition">
                          Draft Email
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
