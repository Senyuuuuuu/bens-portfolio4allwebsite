'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2, Zap, Minimize2 } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';
import { api } from '@/lib/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_COMMANDS = [
  { label: '🔍 Hunt Trends', action: () => api.trends.hunt() },
  { label: '📊 System Status', action: () => api.system() },
  { label: '✅ Start All Agents', action: () => api.agents.list().then(({ agents }) => agents.forEach(a => api.agents.start(a.id))) },
];

export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', content: '👋 Hi! I\'m your AI Content Factory assistant. Ask me anything about your agents, jobs, or content. Try quick commands below!', timestamp: new Date() }
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { events } = useSocket();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Simulate AI response (in production, connect to OpenAI endpoint)
    setTimeout(async () => {
      let response = '';
      const lower = text.toLowerCase();

      if (lower.includes('agent') || lower.includes('status')) {
        try {
          const { agents } = await api.agents.list();
          const running = agents.filter(a => a.status === 'RUNNING').length;
          response = `📊 **Agent Status**\n\n• ${running}/${agents.length} agents running\n• ${agents.filter(a => a.status === 'ERROR').length} in error state\n• ${agents.filter(a => a.status === 'IDLE').length} idle\n\nAll 10 specialized agents: Trend Hunter, Research, Downloader, Transcriber, Clip Detector, Video Editor, Caption AI, Thumbnail AI, Publisher, Analytics.`;
        } catch {
          response = 'Unable to fetch agent status. Make sure the backend is running on port 4000.';
        }
      } else if (lower.includes('job') || lower.includes('queue')) {
        response = '📋 **Job Queue**\n\nJobs flow through BullMQ → Redis. Check the Job Queue page for real-time status. You can cancel or retry any job from there.';
      } else if (lower.includes('trend') || lower.includes('viral')) {
        response = '🔥 **Trend Discovery**\n\nThe Trend Hunter scans YouTube trending, Reddit top posts, and Google Trends every 2 hours automatically via n8n.\n\nOr trigger manually with the "Hunt Trends" button!';
      } else if (lower.includes('download') || lower.includes('youtube')) {
        response = '⬇️ **Video Download**\n\nPaste any YouTube/TikTok URL and the Downloader agent fetches it via yt-dlp. Quality: 1080p max, with audio extraction.\n\nAfter download → auto-transcription → clip detection.';
      } else if (lower.includes('n8n') || lower.includes('workflow')) {
        response = '🔗 **n8n Workflows**\n\nn8n is the master orchestrator running on port 5678. 12 workflow templates are ready to import:\n\n• `01-trend-discovery.json` — Runs every 2 hours\n• `03-youtube-download.json` — Webhook triggered\n• `12-full-pipeline.json` — End-to-end automation\n\nOpen n8n → Workflows → Import from file.';
      } else if (lower.includes('help') || lower.includes('what can')) {
        response = '🚀 **What I can help with:**\n\n• Check agent & job status\n• Explain the pipeline flow\n• Guide n8n workflow setup\n• Troubleshoot errors\n• Explain any feature\n\nTry: "show agent status", "how does trend hunting work?", "setup n8n"';
      } else {
        response = `I understand you're asking about: "${text}"\n\nFor now, try:\n• "show agent status"\n• "explain the pipeline"\n• "how to setup n8n"\n• "what does the video editor do?"`;
      }

      const assistantMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: response, timestamp: new Date() };
      setMessages(prev => [...prev, assistantMsg]);
      setLoading(false);
    }, 800);
  };

  return (
    <>
      {/* Chat button */}
      <motion.button
        onClick={() => { setOpen(!open); setMinimized(false); }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center shadow-lg glow-blue z-50"
      >
        <AnimatePresence mode="wait">
          {open ? <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }}><X className="w-6 h-6 text-white" /></motion.div>
          : <motion.div key="open" initial={{ rotate: 90 }} animate={{ rotate: 0 }}><MessageSquare className="w-6 h-6 text-white" /></motion.div>}
        </AnimatePresence>
        {!open && <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-background animate-pulse" />}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-96 glass-card border border-white/10 z-50 flex flex-col overflow-hidden shadow-2xl"
            style={{ height: minimized ? 'auto' : '520px' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-white/5 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white">Factory Assistant</h3>
                <p className="text-xs text-muted-foreground">AI-powered help</p>
              </div>
              <button onClick={() => setMinimized(!minimized)} className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground"><Minimize2 className="w-4 h-4" /></button>
            </div>

            {!minimized && (
              <>
                {/* Quick commands */}
                <div className="flex gap-2 p-3 border-b border-white/5 overflow-x-auto shrink-0">
                  {QUICK_COMMANDS.map((cmd) => (
                    <button key={cmd.label} onClick={() => { cmd.action(); sendMessage(cmd.label); }}
                      className="shrink-0 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs text-muted-foreground hover:text-white transition-all border border-white/5">
                      {cmd.label}
                    </button>
                  ))}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center ${msg.role === 'assistant' ? 'bg-gradient-to-br from-cyan-500 to-violet-600' : 'bg-white/10'}`}>
                        {msg.role === 'assistant' ? <Bot className="w-3.5 h-3.5 text-white" /> : <User className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed whitespace-pre-line ${msg.role === 'user' ? 'bg-cyan-500/20 text-white ml-auto' : 'bg-white/5 text-gray-200'}`}>
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                  {loading && (
                    <div className="flex items-start gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="bg-white/5 px-3 py-2 rounded-xl">
                        <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/5 shrink-0">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                      placeholder="Ask about agents, jobs, workflows..."
                      className="flex-1 bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500/50 transition-all"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => sendMessage(input)}
                      disabled={loading || !input.trim()}
                      className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center disabled:opacity-50"
                    >
                      <Send className="w-4 h-4 text-white" />
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
