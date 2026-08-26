'use client';

import React from 'react';
import Link from 'next/link';
import { Bot, Sparkles, Terminal, Code2, Zap, ArrowUpRight, Github } from 'lucide-react';

export function PortfolioHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/25 transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg bg-gradient-to-r from-white via-slate-200 to-cyan-300 bg-clip-text text-transparent">
                JARVIS<span className="text-cyan-400">.ai</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                v2.4 PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Enterprise n8n Automation Architect</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-300">
          <a
            href="#sandbox"
            className="px-3 py-1.5 rounded-lg hover:text-cyan-300 hover:bg-white/5 transition flex items-center gap-1.5"
          >
            <Terminal className="w-4 h-4 text-cyan-400" />
            Live Sandbox
          </a>
          <a
            href="#case-studies"
            className="px-3 py-1.5 rounded-lg hover:text-cyan-300 hover:bg-white/5 transition flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4 text-indigo-400" />
            Case Studies
          </a>
          <a
            href="#workflows"
            className="px-3 py-1.5 rounded-lg hover:text-cyan-300 hover:bg-white/5 transition flex items-center gap-1.5"
          >
            <Code2 className="w-4 h-4 text-emerald-400" />
            n8n Exports
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <a
            href="#sandbox"
            className="relative group overflow-hidden rounded-xl p-[1px] focus:outline-none"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 rounded-xl transition-all duration-300 group-hover:opacity-100 opacity-80" />
            <span className="relative flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-950 rounded-[11px] transition-all duration-200 group-hover:bg-opacity-80">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
              <span>Test Live Agent</span>
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
