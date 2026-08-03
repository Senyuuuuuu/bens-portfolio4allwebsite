'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Send, Bot, GitBranch, ListTodo, Terminal,
  Settings, ChevronRight, Activity, Globe, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Command Center', color: 'text-cyan-400' },
  { href: '/crm', icon: Users, label: 'CRM Pipeline', color: 'text-emerald-400' },
  { href: '/outreach', icon: Send, label: 'Outreach Studio', color: 'text-indigo-400' },
  { href: '/agents', icon: Bot, label: 'AI Agents', color: 'text-violet-400' },
  { href: '/workflows', icon: GitBranch, label: 'n8n Workflows', color: 'text-orange-400' },
  { href: '/jobs', icon: ListTodo, label: 'Job Queue', color: 'text-amber-400' },
  { href: '/logs', icon: Terminal, label: 'Live Logs', color: 'text-green-400' },
  { href: '/settings', icon: Settings, label: 'Settings', color: 'text-slate-400' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="w-64 h-screen flex flex-col glass-card rounded-none border-r border-white/5 z-50 shrink-0"
    >
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.02 }}>
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center glow-blue">
            <Globe className="w-5 h-5 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-neon-blue">AI LeadGen</h1>
            <p className="text-xs text-muted-foreground">Website Automation OS</p>
          </div>
        </motion.div>
      </div>

      {/* Status pill */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-medium">Auto-Discovery Active</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item, i) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group cursor-pointer',
                    isActive
                      ? 'bg-white/10 text-white border border-white/10 shadow-sm'
                      : 'text-muted-foreground hover:text-white hover:bg-white/5'
                  )}
                >
                  <item.icon className={cn('w-4 h-4 shrink-0', isActive ? item.color : 'text-muted-foreground group-hover:' + item.color)} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="w-3 h-3 text-muted-foreground" />}
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* n8n link */}
      <div className="p-4 border-t border-white/5">
        <a
          href={process.env.NEXT_PUBLIC_N8N_URL || 'http://localhost:5678'}
          target="_blank"
          rel="noopener noreferrer"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 cursor-pointer hover:bg-orange-500/20 transition-all"
          >
            <GitBranch className="w-4 h-4 text-orange-400" />
            <div>
              <p className="text-xs font-medium text-orange-400">n8n Orchestrator</p>
              <p className="text-xs text-muted-foreground">localhost:5678</p>
            </div>
          </motion.div>
        </a>
      </div>
    </motion.aside>
  );
}
