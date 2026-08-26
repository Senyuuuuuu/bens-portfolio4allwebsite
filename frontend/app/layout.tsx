import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'AI Automation Portfolio & Live n8n Sandbox',
  description: 'Enterprise AI Agent Architect showcasing production n8n workflows, RAG systems, and interactive automation sandboxes.',
  keywords: ['n8n', 'AI Automation', 'LangChain', 'RAG', 'Agentic Workflows', 'Portfolio'],
  openGraph: {
    title: 'AI Automation Portfolio & Live n8n Sandbox',
    description: 'Explore enterprise n8n workflow blueprints with live sandbox testing',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#080B11] text-slate-100 min-h-screen overflow-x-hidden">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
