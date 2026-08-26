'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Bot, CheckCircle2, Clock, Cpu, Database, Sparkles, Terminal,
  RefreshCw, Copy, Check, AlertCircle, ArrowRight, ShieldCheck, Zap, Layers
} from 'lucide-react';

interface RAGSource {
  document: string;
  relevanceScore: number;
  snippet: string;
}

interface TicketInfo {
  id: string;
  sentiment: string;
  priority: string;
  category: string;
  tier?: string;
  status: string;
}

interface TelemetryInfo {
  webhookLatencyMs?: number;
  ragLatencyMs?: number;
  llmLatencyMs?: number;
  totalExecutionMs?: number;
  tokensUsed?: number;
}

interface AIResolution {
  output: string;
  confidenceScore: number;
  suggestedActions: string[];
}

interface WebhookResponse {
  status: string;
  workflow: string;
  executionId: string;
  timestamp: string;
  ticket: TicketInfo;
  ragSources: RAGSource[];
  aiResolution: AIResolution;
  telemetry: TelemetryInfo;
}

const PRESET_QUERIES = [
  'Help me with my billing issue',
  'API token expired on webhook endpoint',
  'How do I configure custom webhook triggers in n8n?',
  'Process enterprise invoice refund'
];

export function InteractiveSandbox() {
  const [inputMessage, setInputMessage] = useState('Help me with my billing issue');
  const [selectedTier, setSelectedTier] = useState('Enterprise');
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [response, setResponse] = useState<WebhookResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'json'>('visual');
  const [serverStatus, setServerStatus] = useState<'connected' | 'fallback' | 'checking'>('checking');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Check backend server connectivity on mount
  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch('http://localhost:5050/api/health', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
          setServerStatus('connected');
        } else {
          setServerStatus('fallback');
        }
      } catch {
        setServerStatus('fallback');
      }
    }
    checkHealth();
  }, []);

  // Handle Workflow Execution
  const handleExecute = async (overrideMsg?: string) => {
    const msgToSubmit = overrideMsg || inputMessage;
    if (!msgToSubmit.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setResponse(null);
    setActiveStep(1);

    // Progressive step simulation for visual feedback during 2-second request
    const step2Timer = setTimeout(() => setActiveStep(2), 500);
    const step3Timer = setTimeout(() => setActiveStep(3), 1100);

    const payload = {
      message: msgToSubmit,
      userId: 'client_' + Math.floor(1000 + Math.random() * 9000),
      tier: selectedTier,
      timestamp: new Date().toISOString()
    };

    try {
      let res: Response;
      // Try Express mock server on :5050 first, fallback to internal Next.js API route
      try {
        res = await fetch('http://localhost:5050/api/webhook/customer-support', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Express server returned ' + res.status);
        setServerStatus('connected');
      } catch {
        // Fallback to Next.js API route
        res = await fetch('/api/mock-webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        setServerStatus('fallback');
      }

      const data: WebhookResponse = await res.json();
      setActiveStep(4);
      setResponse(data);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : 'Execution failed');
    } finally {
      clearTimeout(step2Timer);
      clearTimeout(step3Timer);
      setLoading(false);
    }
  };

  const handleCopyJson = () => {
    if (!response) return;
    navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="sandbox" className="py-16 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span>Interactive Workflow Sandbox</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Live n8n Automation Engine
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Trigger a simulated live webhook. Watch the multi-step RAG & AI Agent workflow resolve the inquiry with real-time execution telemetry.
          </p>

          {/* Backend Status indicator */}
          <div className="flex items-center justify-center gap-2 pt-1 text-xs">
            <span className="text-slate-400">Endpoint Status:</span>
            {serverStatus === 'connected' ? (
              <span className="inline-flex items-center gap-1 text-emerald-400 font-mono bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Express Mock Webhook (Port 5050)
              </span>
            ) : serverStatus === 'fallback' ? (
              <span className="inline-flex items-center gap-1 text-cyan-400 font-mono bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Next.js API Engine (Active)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-slate-400 font-mono">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Connecting...
              </span>
            )}
          </div>
        </div>

        {/* Sandbox Glass Card */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl overflow-hidden">
          {/* Top Bar / Stepper Trace */}
          <div className="border-b border-slate-800 bg-slate-950/70 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-400 ml-2">
                  workflow://n8n-customer-support-rag-v1
                </span>
              </div>
              {response && (
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950/50 px-2.5 py-1 rounded-md border border-cyan-500/30">
                  ID: {response.executionId}
                </span>
              )}
            </div>

            {/* 4-Step Pipeline Trace */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Step 1 */}
              <div
                className={`p-3 rounded-xl border transition-all ${
                  activeStep >= 1
                    ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                    : 'bg-slate-900/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                      activeStep >= 1 ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    1
                  </div>
                  <span className="text-xs font-semibold">Webhook Inbound</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">POST /customer-support</p>
              </div>

              {/* Step 2 */}
              <div
                className={`p-3 rounded-xl border transition-all ${
                  activeStep >= 2
                    ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300'
                    : 'bg-slate-900/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                      activeStep >= 2 ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    2
                  </div>
                  <span className="text-xs font-semibold">Vector DB RAG</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">Cosine Similarity &gt; 0.85</p>
              </div>

              {/* Step 3 */}
              <div
                className={`p-3 rounded-xl border transition-all ${
                  activeStep >= 3
                    ? 'bg-purple-500/10 border-purple-500/40 text-purple-300'
                    : 'bg-slate-900/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                      activeStep >= 3 ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    3
                  </div>
                  <span className="text-xs font-semibold">LLM Agent Synthesis</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">LangChain Agent + Memory</p>
              </div>

              {/* Step 4 */}
              <div
                className={`p-3 rounded-xl border transition-all ${
                  activeStep >= 4
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                      activeStep >= 4 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    4
                  </div>
                  <span className="text-xs font-semibold">Respond Webhook</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">JSON Payload Dispatched</p>
              </div>
            </div>
          </div>

          {/* Main Interaction Area: 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left Column: Form & Triggers */}
            <div className="lg:col-span-5 p-6 border-b lg:border-b-0 lg:border-r border-slate-800 space-y-6">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
                  1. Select Preset Scenario or Write Query
                </label>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {PRESET_QUERIES.map((preset, idx) => (
                    <button
                      key={idx}
                      id={`preset-btn-${idx}`}
                      onClick={() => {
                        setInputMessage(preset);
                        handleExecute(preset);
                      }}
                      className="text-[11px] text-left px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-cyan-500/20 hover:text-cyan-300 border border-slate-700/50 hover:border-cyan-500/40 text-slate-300 transition-all"
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <textarea
                    id="sandbox-message-input"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    rows={4}
                    placeholder="Type an inquiry (e.g. Help me with my billing issue)..."
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                  />
                </div>
              </div>

              {/* Parameters */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                    User Tier
                  </label>
                  <select
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Enterprise">Enterprise (SLA 15m)</option>
                    <option value="Business">Business (SLA 1h)</option>
                    <option value="Growth">Growth (SLA 4h)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                    Simulation Latency
                  </label>
                  <div className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 flex items-center justify-between font-mono">
                    <span>2000 ms</span>
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="sandbox-execute-button"
                onClick={() => handleExecute()}
                disabled={loading || !inputMessage.trim()}
                className="w-full relative group overflow-hidden rounded-xl p-[1px] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 rounded-xl transition-all duration-300 group-hover:opacity-100 opacity-90" />
                <span className="relative flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-slate-950 rounded-[11px] transition-all duration-200 group-hover:bg-opacity-75">
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 text-cyan-300 animate-spin" />
                      <span>Executing n8n Pipeline...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span>Execute Workflow Webhook</span>
                      <Send className="w-3.5 h-3.5 ml-1 text-cyan-300" />
                    </>
                  )}
                </span>
              </button>

              {/* Error Alert if any */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            {/* Right Column: Execution Output / Telemetry */}
            <div className="lg:col-span-7 p-6 bg-slate-950/50 flex flex-col justify-between min-h-[460px]">
              {/* Output Tab Switcher */}
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('visual')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        activeTab === 'visual'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      AI Resolution Card
                    </button>
                    <button
                      id="json-tab-button"
                      onClick={() => setActiveTab('json')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        activeTab === 'json'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Raw JSON Inspector
                    </button>
                  </div>

                  {response && (
                    <button
                      onClick={handleCopyJson}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                    </button>
                  )}
                </div>

                {/* State 1: Loading State */}
                {loading && (
                  <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center animate-pulse">
                        <Cpu className="w-8 h-8 text-cyan-400 animate-spin" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-white">
                        {activeStep === 1 && 'Ingesting Webhook & Querying Vector DB...'}
                        {activeStep === 2 && 'Matching Semantic RAG Knowledge Base...'}
                        {activeStep === 3 && 'LangChain AI Agent Synthesizing Resolution...'}
                        {activeStep >= 4 && 'Formatting n8n Response Output...'}
                      </p>
                      <p className="text-xs text-slate-400 font-mono">Simulating 2.0s production latency</p>
                    </div>
                  </div>
                )}

                {/* State 2: Result Ready */}
                {!loading && response && (
                  <AnimatePresence mode="wait">
                    {activeTab === 'visual' ? (
                      <motion.div
                        key="visual-tab"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        {/* Status Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {response.ticket.status}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                            Ticket: {response.ticket.id}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                            Priority: {response.ticket.priority}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-purple-500/10 border border-purple-500/30 text-purple-300">
                            Confidence: {Math.round(response.aiResolution.confidenceScore * 100)}%
                          </span>
                        </div>

                        {/* AI Resolution Box */}
                        <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-2">
                          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                            <Bot className="w-4 h-4" />
                            <span>AI AGENT SYNTHESIZED RESOLUTION</span>
                          </div>
                          <p className="text-sm text-slate-100 leading-relaxed">
                            {response.aiResolution.output}
                          </p>

                          {/* Suggested Next Steps */}
                          {response.aiResolution.suggestedActions?.length > 0 && (
                            <div className="pt-2 border-t border-slate-800/80">
                              <span className="text-[11px] font-mono text-slate-400 uppercase">
                                Actionable Next Steps:
                              </span>
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {response.aiResolution.suggestedActions.map((action, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1"
                                  >
                                    <ArrowRight className="w-3 h-3 text-cyan-400" />
                                    {action}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* RAG Retrieved Context Sources */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                            <Database className="w-3.5 h-3.5 text-indigo-400" />
                            <span>RETRIEVED VECTOR RAG SOURCES</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {response.ragSources.map((source, idx) => (
                              <div
                                key={idx}
                                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1"
                              >
                                <div className="flex items-center justify-between text-indigo-300 font-medium">
                                  <span className="truncate">{source.document}</span>
                                  <span className="text-[10px] font-mono text-emerald-400 shrink-0 ml-1">
                                    {(source.relevanceScore * 100).toFixed(0)}% match
                                  </span>
                                </div>
                                <p className="text-slate-400 text-[11px] line-clamp-2">
                                  "{source.snippet}"
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="json-tab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="rounded-xl bg-slate-950 p-4 border border-slate-800 overflow-x-auto max-h-[340px]"
                      >
                        <pre className="text-xs font-mono text-cyan-300 leading-relaxed whitespace-pre">
                          {JSON.stringify(response, null, 2)}
                        </pre>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}

                {/* State 3: Empty State (Before first execution) */}
                {!loading && !response && (
                  <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                      <Sparkles className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-200">Sandbox Ready for Ingestion</p>
                      <p className="text-xs text-slate-400 max-w-sm">
                        Click <strong>"Execute Workflow Webhook"</strong> to trigger the live n8n pipeline test.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Telemetry Footer */}
              {response && (
                <div className="pt-4 mt-4 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400">
                  <div className="flex items-center gap-3">
                    <span>
                      RAG: <strong className="text-indigo-300">{response.telemetry.ragLatencyMs || 150}ms</strong>
                    </span>
                    <span>
                      LLM: <strong className="text-purple-300">{response.telemetry.llmLatencyMs || 1650}ms</strong>
                    </span>
                    <span>
                      Total: <strong className="text-cyan-300">{response.telemetry.totalExecutionMs || 1800}ms</strong>
                    </span>
                  </div>
                  <div>
                    Tokens:{' '}
                    <strong className="text-emerald-300">{response.telemetry.tokensUsed || 390}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
