'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Send, Mail, CheckCircle2, Clock, ShieldCheck,
  Sparkles, ExternalLink, RefreshCw, Filter, User
} from 'lucide-react';
import { api, OutreachDraft } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function OutreachStudioPage() {
  const [drafts, setDrafts] = useState<OutreachDraft[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  const fetchDrafts = async () => {
    try {
      const { drafts } = await api.outreach.drafts(filterStatus !== 'ALL' ? filterStatus : undefined);
      setDrafts(drafts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, [filterStatus]);

  const handleApprove = async (draftId: string) => {
    try {
      await api.outreach.approve(draftId);
      fetchDrafts();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Send className="w-6 h-6 text-indigo-400" /> Outreach Studio
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Review, approve & dispatch personalized email & social sequences (Human Gate Compliance)</p>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-1 p-1 glass-card shrink-0">
          {['ALL', 'DRAFT', 'APPROVED', 'SENT'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition', filterStatus === st ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-muted-foreground hover:text-white')}
            >
              {st}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Compliance Warning Banner */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 border-indigo-500/20 bg-indigo-500/5 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
        <p className="text-xs text-indigo-200">
          <strong>Human Review Policy:</strong> Outbound messages require explicit manual approval to ensure CAN-SPAM and platform compliance.
        </p>
      </motion.div>

      {/* Drafts List */}
      <div className="space-y-4">
        {drafts.map((draft, i) => (
          <motion.div
            key={draft.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-5 space-y-3 hover:border-white/15 transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {draft.channel}
                </span>
                <span className="text-xs font-medium text-white">{draft.lead?.name || 'Business Lead'}</span>
                <span className="text-xs text-muted-foreground">({draft.lead?.category})</span>
              </div>

              <div className="flex items-center gap-2">
                <span className={cn(
                  'px-2 py-0.5 rounded text-[10px] font-bold uppercase',
                  draft.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' :
                  draft.status === 'SENT' ? 'bg-violet-500/10 text-violet-400' : 'bg-amber-500/10 text-amber-400'
                )}>
                  {draft.status}
                </span>
              </div>
            </div>

            {draft.subject && (
              <div className="text-xs font-semibold text-white">Subject: {draft.subject}</div>
            )}

            <pre className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 text-xs font-sans whitespace-pre-wrap leading-relaxed">
              {draft.bodyText}
            </pre>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-muted-foreground font-mono">Created {new Date(draft.createdAt).toLocaleString()}</span>

              {draft.status === 'DRAFT' && (
                <button
                  onClick={() => handleApprove(draft.id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-500 text-xs font-bold text-white hover:opacity-90 transition shadow-lg"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Queue Dispatch
                </button>
              )}
            </div>
          </motion.div>
        ))}

        {drafts.length === 0 && !loading && (
          <div className="glass-card p-12 text-center text-muted-foreground text-sm">
            No outreach drafts found. Run the Personalized Outreach Agent from the CRM to generate drafts.
          </div>
        )}
      </div>
    </div>
  );
}
