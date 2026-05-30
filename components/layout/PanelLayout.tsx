'use client';

import { useUIStore } from '@/store/uiStore';
import { QueryBuilder } from '@/components/builder/QueryBuilder';
import { QueryPreview } from '@/components/preview/QueryPreview';
import { ResultsPanel } from '@/components/results/ResultsPanel';
import { motion, AnimatePresence } from 'framer-motion';

export function PanelLayout() {
  const { activePanel } = useUIStore();

  return (
    <div style={{ height: '100%', overflow: 'hidden', position: 'relative' }}>
      <AnimatePresence mode="wait">
        {activePanel === 'builder' && (
          <PanelWrap key="builder">
            <QueryBuilder />
          </PanelWrap>
        )}
        {activePanel === 'preview' && (
          <PanelWrap key="preview">
            <QueryPreview />
          </PanelWrap>
        )}
        {activePanel === 'results' && (
          <PanelWrap key="results">
            <ResultsPanel />
          </PanelWrap>
        )}
      </AnimatePresence>
    </div>
  );
}

function PanelWrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      style={{ height: '100%', overflow: 'hidden' }}
    >
      {children}
    </motion.div>
  );
}