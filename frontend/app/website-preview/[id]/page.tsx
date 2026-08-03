'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Monitor, Tablet, Smartphone, Download, Code, Eye,
  Sparkles, ExternalLink, ArrowLeft, CheckCircle2, Copy
} from 'lucide-react';
import Link from 'next/link';
import { api, GeneratedWebsite } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function WebsitePreviewPage() {
  const params = useParams();
  const slug = params.id as string;
  const [website, setWebsite] = useState<GeneratedWebsite | null>(null);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [codeTab, setCodeTab] = useState<'html' | 'react' | 'css'>('html');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.website.get(slug)
      .then(setWebsite)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const copyCode = () => {
    if (!website) return;
    const text = codeTab === 'html' ? website.htmlCode : codeTab === 'react' ? website.reactCode : website.cssCode;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadHtml = () => {
    if (!website) return;
    const blob = new Blob([website.htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${website.slug || 'website-demo'}.html`;
    a.click();
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-cyan-400 font-mono">Loading Interactive Website Studio...</div>;
  if (!website) return <div className="text-center text-muted-foreground p-12">Website demo not found</div>;

  const viewportWidths = {
    desktop: 'w-full max-w-[1400px]',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]',
  };

  return (
    <div className="space-y-4 h-full flex flex-col max-w-[1800px]">
      {/* Top Controls Bar */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/crm" className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-bold text-white text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> {website.title}
            </h1>
            <p className="text-xs text-muted-foreground">Version {website.version} · Template: {website.templateName}</p>
          </div>
        </div>

        {/* Viewport & Mode Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Preview / Code Tab */}
          <div className="flex gap-1 p-1 bg-black/40 border border-white/10 rounded-xl">
            <button
              onClick={() => setActiveTab('preview')}
              className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition', activeTab === 'preview' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-muted-foreground')}
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition', activeTab === 'code' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-muted-foreground')}
            >
              <Code className="w-3.5 h-3.5" /> Code
            </button>
          </div>

          {/* Viewport Controls */}
          {activeTab === 'preview' && (
            <div className="flex gap-1 p-1 bg-black/40 border border-white/10 rounded-xl">
              <button
                onClick={() => setViewport('desktop')}
                className={cn('p-1.5 rounded-lg text-xs transition', viewport === 'desktop' ? 'bg-white/10 text-white' : 'text-muted-foreground')}
                title="Desktop View (1920px)"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewport('tablet')}
                className={cn('p-1.5 rounded-lg text-xs transition', viewport === 'tablet' ? 'bg-white/10 text-white' : 'text-muted-foreground')}
                title="Tablet View (768px)"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewport('mobile')}
                className={cn('p-1.5 rounded-lg text-xs transition', viewport === 'mobile' ? 'bg-white/10 text-white' : 'text-muted-foreground')}
                title="Mobile View (375px)"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Download & Export */}
          <button
            onClick={downloadHtml}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-xs font-bold text-white hover:opacity-90 transition shadow-lg"
          >
            <Download className="w-3.5 h-3.5" /> Export HTML
          </button>
        </div>
      </motion.div>

      {/* Main Preview Container */}
      <div className="flex-1 glass-card overflow-hidden flex flex-col items-center justify-center p-4 bg-slate-950/80">
        {activeTab === 'preview' ? (
          <div className={cn('h-full transition-all duration-300 shadow-2xl rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 flex flex-col', viewportWidths[viewport])}>
            {/* Viewport Header Bar */}
            <div className="h-8 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between text-xs text-slate-500 font-mono shrink-0">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <span>{viewport.toUpperCase()} VIEWPORT — {viewport === 'desktop' ? '1920px' : viewport === 'tablet' ? '768px' : '375px'}</span>
              <span className="text-emerald-400 text-[10px]">LIVE RENDER</span>
            </div>

            {/* Live iframe */}
            <iframe
              srcDoc={website.htmlCode}
              title="Live Website Preview"
              className="w-full flex-1 border-none"
              sandbox="allow-scripts allow-modals"
            />
          </div>
        ) : (
          /* Source Code Viewer */
          <div className="w-full h-full flex flex-col rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
            <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-950">
              <div className="flex gap-2">
                {(['html', 'react', 'css'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setCodeTab(tab)}
                    className={cn('px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition', codeTab === tab ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-500 hover:text-slate-300')}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <button
                onClick={copyCode}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>

            <pre className="flex-1 p-4 overflow-auto font-mono text-xs text-emerald-400 bg-slate-950 leading-relaxed">
              <code>{codeTab === 'html' ? website.htmlCode : codeTab === 'react' ? website.reactCode : website.cssCode}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
