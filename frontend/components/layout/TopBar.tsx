'use client';

import { motion } from 'framer-motion';
import { Bell, RefreshCw, Wifi, WifiOff, Clock } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';
import { useState, useEffect } from 'react';

export function TopBar() {
  const { connected } = useSocket();
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="h-14 border-b border-white/5 px-6 flex items-center justify-between shrink-0 glass-card rounded-none">
      {/* Breadcrumb / title area */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/50 via-violet-500/30 to-transparent w-32" />
        <span className="text-xs text-muted-foreground font-mono">{time}</span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Connection status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
            connected
              ? 'bg-green-500/10 border-green-500/30 text-green-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          {connected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
          {connected ? 'Live' : 'Disconnected'}
        </motion.div>

        {/* Refresh */}
        <motion.button
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.3 }}
          onClick={() => window.location.reload()}
          className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </motion.button>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="relative p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        </motion.button>
      </div>
    </header>
  );
}
