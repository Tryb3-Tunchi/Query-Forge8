'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/store/uiStore';
import { Header } from '@/components/layout/Header';
import { PanelLayout } from '@/components/layout/PanelLayout';
// import { Sidebar } from '@/components/layout/Sidebar';
import { QueryHistory } from '@/components/history/QueryHistory';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { PresetManager } from '@/components/history/PresetManger';
import { Sidebar } from '@/components/layout/Siderbar';

export default function Home() {
  const { theme, showHistory, showPresets } = useUIStore();

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('theme-light');
    } else {
      document.documentElement.classList.remove('theme-light');
    }
  }, [theme]);

  return (
    <main className="flex flex-col h-screen overflow-hidden" style={{ background: 'var(--bg-void)' }}>
      {/* Ambient background grid */}
      <div className="grid-bg fixed inset-0 pointer-events-none opacity-30" />

      {/* Ambient glow spots */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: '-20%',
          left: '30%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(245,166,35,0.04) 0%, transparent 70%)',
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: '-10%',
          right: '20%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(0,229,204,0.03) 0%, transparent 70%)',
        }}
      />

      <Header />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />

        <div className="flex-1 overflow-hidden">
          <PanelLayout />
        </div>

        {/* Drawers */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 z-50"
              style={{ width: '360px' }}
            >
              <QueryHistory />
            </motion.div>
          )}
          {showPresets && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 z-50"
              style={{ width: '360px' }}
            >
              <PresetManager />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-medium)',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
          },
        }}
      />
    </main>
  );
}