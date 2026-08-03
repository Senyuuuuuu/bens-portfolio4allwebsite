'use client';

import { motion } from 'framer-motion';
import { Suspense, lazy } from 'react';
import { Zap, ArrowDown, Play } from 'lucide-react';

// Lazy-load the WebGL canvas to prevent SSR issues
const HeroCanvas = lazy(() => import('./HeroCanvas').then((m) => ({ default: m.HeroCanvas })));

const AGENT_LABELS = [
  { label: 'Trend Hunter', color: '#00d4ff', delay: 0 },
  { label: 'Downloader', color: '#8b5cf6', delay: 0.1 },
  { label: 'Transcriber', color: '#00ff88', delay: 0.2 },
  { label: 'Clip Detector', color: '#ffd700', delay: 0.3 },
  { label: 'Video Editor', color: '#ff006e', delay: 0.4 },
  { label: 'Caption AI', color: '#00d4ff', delay: 0.5 },
  { label: 'Publisher', color: '#8b5cf6', delay: 0.6 },
  { label: 'Analytics', color: '#00ff88', delay: 0.7 },
];

export function Hero3D() {
  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center">
      {/* 3D Background Canvas */}
      <div className="absolute inset-0 z-0">
        <Suspense
          fallback={
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 to-violet-900/10 flex items-center justify-center">
              <div className="w-12 h-12 border-2 border-cyan-500/50 border-t-cyan-500 rounded-full animate-spin" />
            </div>
          }
        >
          <HeroCanvas />
        </Suspense>
      </div>

      {/* Radial vignette overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(8,10,22,0.7) 100%)' }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-10"
        style={{ backgroundImage: 'linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)', backgroundSize: '80px 80px' }}
      />

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-medium mb-6"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          10 AI Agents • n8n Orchestrated • Real-Time WebSocket
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black tracking-tight mb-4"
          style={{ lineHeight: 1.05 }}
        >
          <span className="text-white">AI Content</span>
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-green-400 bg-clip-text text-transparent">
            Factory OS
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8"
        >
          Discover trends → Download videos → Extract clips → Add captions → Publish —
          all automated by AI agents orchestrated through n8n
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <motion.a
            href="#dashboard"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold text-sm shadow-lg"
            style={{ boxShadow: '0 0 30px rgba(0,212,255,0.3)' }}
          >
            <Zap className="w-4 h-4" />
            Open Command Center
          </motion.a>
          <motion.a
            href={process.env.NEXT_PUBLIC_N8N_URL || 'http://localhost:5678'}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-all"
          >
            <Play className="w-4 h-4 text-orange-400" />
            Open n8n
          </motion.a>
        </motion.div>

        {/* Agent pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {AGENT_LABELS.map((agent) => (
            <motion.div
              key={agent.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + agent.delay, duration: 0.4 }}
              className="px-3 py-1 rounded-full border text-xs font-medium"
              style={{
                borderColor: agent.color + '40',
                color: agent.color,
                backgroundColor: agent.color + '10',
                boxShadow: `0 0 10px ${agent.color}20`,
              }}
            >
              {agent.label}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="text-xs">Scroll to Dashboard</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </div>
  );
}
