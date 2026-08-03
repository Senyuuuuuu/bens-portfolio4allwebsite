import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { ChatAssistant } from '@/components/chat/ChatAssistant';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'AI Content Factory — Autonomous Content OS',
  description: 'Production-ready AI Content Factory with 10 specialized agents for discovering, downloading, editing, and publishing viral content.',
  keywords: ['AI', 'content factory', 'automation', 'n8n', 'viral content', 'video editing'],
  openGraph: {
    title: 'AI Content Factory',
    description: 'Your autonomous AI content production system',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased overflow-hidden">
        <div className="flex h-screen w-screen overflow-hidden">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <TopBar />
            <main className="flex-1 overflow-auto p-6">
              {children}
            </main>
          </div>
        </div>
        <ChatAssistant />
        <Toaster />
      </body>
    </html>
  );
}
