'use client';

import React from 'react';
import { PortfolioHeader } from '@/components/portfolio/PortfolioHeader';
import { HeroSection } from '@/components/portfolio/HeroSection';
import { InteractiveSandbox } from '@/components/portfolio/InteractiveSandbox';
import { CaseStudies } from '@/components/portfolio/CaseStudies';
import { WorkflowShowcase } from '@/components/portfolio/WorkflowShowcase';
import { Bot, Sparkles, ArrowUpRight, Github, Mail, ShieldCheck, Zap } from 'lucide-react';

export default function AutomationPortfolioPage() {
  return (
    <div className="min-h-screen bg-[#080B11] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* Top Sticky Navigation Bar */}
      <PortfolioHeader />

      {/* Main Content Sections */}
      <main>
        {/* 1. Hero Section with Live Stats */}
        <HeroSection />

        {/* 2. Interactive Sandbox with Live n8n Simulation */}
        <InteractiveSandbox />

        {/* 3. Case Studies: Support Agent, Invoice Vision, HITL Social */}
        <CaseStudies />

        {/* 4. n8n Workflow JSON Blueprints & Direct Download */}
        <WorkflowShowcase />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-sm bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
                JARVIS AI Automation Portfolio
              </span>
              <p className="text-xs text-slate-500">Autonomous Workflows & Enterprise n8n Systems</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <a href="#sandbox" className="hover:text-cyan-300 transition">
              Live Sandbox
            </a>
            <a href="#case-studies" className="hover:text-cyan-300 transition">
              Case Studies
            </a>
            <a href="#workflows" className="hover:text-cyan-300 transition">
              n8n Exports
            </a>
            <a
              href="/downloads/n8n-customer-support-workflow.json"
              download
              className="hover:text-cyan-300 transition flex items-center gap-1"
            >
              <span>Download Schema</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>

          <div className="text-xs text-slate-500 font-mono">
            &copy; {new Date().getFullYear()} AI Automation Systems. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
