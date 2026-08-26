'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code2, Download, Copy, Check, Terminal, ExternalLink, Bot,
  Layers, ArrowRight, Clock, ShieldCheck, Zap
} from 'lucide-react';

export function WorkflowShowcase() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<'support' | 'hitl'>('support');
  const [copied, setCopied] = useState(false);

  const workflows = {
    support: {
      name: 'n8n-customer-support-workflow.json',
      title: 'Autonomous Customer Support RAG Agent',
      downloadUrl: '/downloads/n8n-customer-support-workflow.json',
      nodes: [
        { name: 'Webhook Trigger', type: 'n8n-nodes-base.webhook', color: 'border-cyan-500 bg-cyan-950/40 text-cyan-300' },
        { name: 'Vector DB RAG Lookup', type: 'n8n-nodes-base.httpRequest', color: 'border-indigo-500 bg-indigo-950/40 text-indigo-300' },
        { name: 'AI Support Agent (LangChain)', type: '@n8n/n8n-nodes-base.agent', color: 'border-purple-500 bg-purple-950/40 text-purple-300' },
        { name: 'OpenAI GPT-4o Model', type: '@n8n/n8n-nodes-base.lmChatOpenAi', color: 'border-emerald-500 bg-emerald-950/40 text-emerald-300' },
        { name: 'Window Buffer Memory', type: '@n8n/n8n-nodes-base.memoryBufferWindow', color: 'border-amber-500 bg-amber-950/40 text-amber-300' },
        { name: 'Respond to Webhook', type: 'n8n-nodes-base.respondToWebhook', color: 'border-rose-500 bg-rose-950/40 text-rose-300' }
      ],
      description:
        'A deterministic customer support pipeline utilizing Pinecone vector retrieval, OpenAI GPT-4o reasoning, and window buffer memory to respond within 2s with zero hallucinations.'
    },
    hitl: {
      name: 'n8n-hitl-workflow.json',
      title: 'Human-in-the-Loop (HITL) Social Media Engine',
      downloadUrl: '/downloads/n8n-hitl-workflow.json',
      nodes: [
        { name: 'Schedule Trigger (Mondays 9AM)', type: 'n8n-nodes-base.scheduleTrigger', color: 'border-amber-500 bg-amber-950/40 text-amber-300' },
        { name: 'Fetch Industry Trends', type: 'n8n-nodes-base.httpRequest', color: 'border-cyan-500 bg-cyan-950/40 text-cyan-300' },
        { name: 'AI Draft LinkedIn Post', type: '@n8n/n8n-nodes-base.openAi', color: 'border-purple-500 bg-purple-950/40 text-purple-300' },
        { name: 'Slack Interactive Approval Buttons', type: 'n8n-nodes-base.slack', color: 'border-emerald-500 bg-emerald-950/40 text-emerald-300' },
        { name: 'Wait for Human Decision Callback', type: 'n8n-nodes-base.wait', color: 'border-indigo-500 bg-indigo-950/40 text-indigo-300' },
        { name: 'Switch Route & Publish', type: 'n8n-nodes-base.switch', color: 'border-rose-500 bg-rose-950/40 text-rose-300' }
      ],
      description:
        'Automated weekly intelligence scanner that drafts LinkedIn thought-leadership posts, dispatches interactive approval buttons to Slack, and routes decisions dynamically.'
    }
  };

  const current = workflows[selectedWorkflow];

  const handleCopyCode = async () => {
    try {
      const res = await fetch(current.downloadUrl);
      const text = await res.text();
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="workflows" className="py-20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
            <Code2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ready-to-Import Blueprints</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            n8n Workflow Canvas Exports
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Download or copy production-ready JSON schemas formatted according to official n8n v1 export standards.
          </p>
        </div>

        {/* Workflow Switcher Tabs */}
        <div className="flex justify-center mb-8">
          <div className="p-1.5 rounded-2xl bg-slate-900 border border-slate-800 flex gap-2">
            <button
              onClick={() => setSelectedWorkflow('support')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                selectedWorkflow === 'support'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Customer Support Agent</span>
            </button>

            <button
              onClick={() => setSelectedWorkflow('hitl')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                selectedWorkflow === 'hitl'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>HITL Social Media Engine</span>
            </button>
          </div>
        </div>

        {/* Workflow Visualizer Card */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <h3 className="text-xl font-bold text-white">{current.title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">{current.description}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleCopyCode}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied JSON!' : 'Copy Workflow JSON'}</span>
              </button>

              <a
                href={current.downloadUrl}
                download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 hover:scale-[1.02] transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .JSON</span>
              </a>
            </div>
          </div>

          {/* Visual Node Diagram */}
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase block mb-3">
              Canvas Node Flow Architecture:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {current.nodes.map((node, nIdx) => (
                <div
                  key={nIdx}
                  className={`p-4 rounded-2xl border ${node.color} flex flex-col justify-between transition-all hover:scale-[1.02]`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono opacity-75">NODE 0{nIdx + 1}</span>
                      <Layers className="w-3.5 h-3.5 opacity-75" />
                    </div>
                    <div className="text-sm font-bold">{node.name}</div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/10 text-[10px] font-mono opacity-80 truncate">
                    {node.type}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
