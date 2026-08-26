'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Bot, FileText, Share2, CheckCircle2, ArrowRight, Download, Cpu,
  ExternalLink, Sparkles, Database, ShieldCheck, Zap
} from 'lucide-react';

interface CaseStudy {
  id: string;
  title: string;
  category: string;
  badgeColor: string;
  icon: React.ElementType;
  description: string;
  metrics: { label: string; value: string }[];
  stack: string[];
  workflowFile: string;
  keyFeatures: string[];
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'customer-support',
    title: 'Autonomous Customer Support Agent',
    category: 'Conversational AI & Multi-Model RAG',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    icon: Bot,
    description:
      'Autonomous Tier-1 & Tier-2 customer service orchestration engine. Connects incoming webhooks to Pinecone vector search, grounds responses in real-time knowledge base docs, maintains conversation memory buffer, and routes complex edge-cases to human specialists.',
    metrics: [
      { label: 'Deflection Rate', value: '78.4%' },
      { label: 'Avg Resolution Time', value: '1.8s' },
      { label: 'CSAT Rating', value: '4.9/5' }
    ],
    stack: ['n8n', 'LangChain', 'OpenAI GPT-4o', 'Pinecone Vector DB', 'Zendesk API', 'Slack'],
    workflowFile: '/downloads/n8n-customer-support-workflow.json',
    keyFeatures: [
      'Sub-2 second deterministic vector RAG context matching',
      'Autonomous ticket classification and sentiment scoring',
      'Continuous sliding window conversation memory',
      'Automated fallback escalation with full ticket history'
    ]
  },
  {
    id: 'invoice-processor',
    title: 'Vision-Based Invoice & Receipt Processor',
    category: 'Computer Vision & Financial Operations',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    icon: FileText,
    description:
      'Multi-modal computer vision pipeline extracting line items, VAT numbers, payment terms, and vendor metadata from PDFs and scanned images. Validates schema strictly using Zod/JSON Schema before syncing to QuickBooks and ERP systems.',
    metrics: [
      { label: 'Extraction Accuracy', value: '99.7%' },
      { label: 'Processing Speed', value: '3.4s / doc' },
      { label: 'Accounting Time Saved', value: '35 hrs/wk' }
    ],
    stack: ['n8n', 'Gemini 1.5 Pro Vision', 'AWS S3', 'QuickBooks API', 'Postgres', 'Stripe'],
    workflowFile: '/downloads/n8n-customer-support-workflow.json',
    keyFeatures: [
      'Zero-shot vision extraction of unstructured tables & multi-currency items',
      'Mathematical double-entry checksum validation before ERP entry',
      'Automated vendor duplicate detection and anomaly alerts',
      'Direct synchronization to accounting ledgers & cloud archive'
    ]
  },
  {
    id: 'hitl-social',
    title: 'Human-in-the-Loop (HITL) Social Media Engine',
    category: 'Content Generation & Automated Distribution',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    icon: Share2,
    description:
      'Scheduled autonomous intelligence agent that scours industry RSS and news feeds every Monday, synthesizes viral LinkedIn post drafts with custom tone-of-voice prompts, dispatches interactive approval buttons to Slack/Telegram, and publishes upon human click.',
    metrics: [
      { label: 'Audience Growth', value: '+310%' },
      { label: 'Editorial Time Saved', value: '85%' },
      { label: 'Approval Latency', value: '< 30s' }
    ],
    stack: ['n8n', 'OpenAI API', 'Slack Interactive Blocks', 'LinkedIn API', 'Telegram Bot API'],
    workflowFile: '/downloads/n8n-hitl-workflow.json',
    keyFeatures: [
      'Automated Monday 9AM cron trigger fetching real-time market trends',
      'Dynamic prompt template optimized for viral hook & bullet takeaways',
      'Interactive Slack Block Kit UI with "Approve" and "Regenerate" callbacks',
      'Conditional switch routing based on human supervisor response'
    ]
  }
];

export function CaseStudies() {
  return (
    <section id="case-studies" className="py-20 bg-slate-950/60 border-t border-b border-slate-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Proven Enterprise Architectures</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Production Case Studies
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Detailed breakdowns of production-tested n8n automation pipelines delivering measurable enterprise ROI.
          </p>
        </div>

        {/* Case Study Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {CASE_STUDIES.map((study, idx) => {
            const Icon = study.icon;
            return (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="group rounded-3xl bg-slate-900/70 border border-slate-800/80 hover:border-cyan-500/40 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10"
              >
                {/* Top Section */}
                <div className="space-y-4">
                  {/* Badge & Icon */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full border ${study.badgeColor}`}
                    >
                      {study.category}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {study.title}
                  </h3>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {study.description}
                  </p>

                  {/* Metrics Bar */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800/80 bg-slate-950/40 rounded-xl px-3 text-center">
                    {study.metrics.map((m, mIdx) => (
                      <div key={mIdx}>
                        <div className="text-sm sm:text-base font-extrabold text-white font-mono">
                          {m.value}
                        </div>
                        <div className="text-[10px] text-slate-400 leading-tight">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Key Features Bullet List */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-mono text-slate-400 uppercase">Architecture Highlights:</span>
                    {study.keyFeatures.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech Stack Chips */}
                  <div className="pt-2">
                    <div className="flex flex-wrap gap-1.5">
                      {study.stack.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/90 text-slate-400 border border-slate-700/60"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action / Download JSON */}
                <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                  <a
                    href={study.workflowFile}
                    download
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download n8n JSON</span>
                  </a>

                  <a
                    href="#workflows"
                    className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
