'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Bot, Zap, ArrowRight, ShieldCheck, Cpu, Terminal, CheckCircle2, Play } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative pt-12 pb-20 overflow-hidden">
      {/* Glow effects & grid background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-purple-600/10 blur-[130px] -z-10 rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b10_1px,transparent_1px),linear-gradient(to_bottom,#1e293b10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium shadow-inner shadow-cyan-500/10"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <span>Production n8n + AI Agent Architect</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]"
          >
            Autonomous AI Pipelines &{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              n8n Workflow Systems
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Architecting enterprise grade, self-healing automations with <strong>n8n</strong>,{' '}
            <strong>LangChain</strong>, and <strong>Multi-Model RAG</strong>. Test the live interactive sandbox below or inspect production workflow blueprints.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <a
              href="#sandbox"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Terminal className="w-4 h-4 text-cyan-200" />
              <span>Launch Live Sandbox</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#case-studies"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 text-slate-200 text-sm font-medium hover:text-white transition-all"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Explore Case Studies</span>
            </a>
          </motion.div>

          {/* Live Metrics Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-8 max-w-4xl mx-auto"
          >
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md text-left">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
                <span>EXECUTION SLA</span>
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">&lt; 2.1s</div>
              <div className="text-[11px] text-cyan-400 font-medium">End-to-End Latency</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md text-left">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
                <span>RAG ACCURACY</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">99.4%</div>
              <div className="text-[11px] text-emerald-400 font-medium">Zero Hallucination Gate</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md text-left">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
                <span>WORKFLOWS</span>
                <Bot className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">45+</div>
              <div className="text-[11px] text-indigo-400 font-medium">Production Blueprints</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md text-left">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
                <span>UPTIME</span>
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">99.98%</div>
              <div className="text-[11px] text-purple-400 font-medium">Self-Healing Webhooks</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
