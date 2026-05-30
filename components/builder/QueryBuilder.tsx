'use client';

import { useEffect } from 'react';
import { useQueryStore } from '@/store/queryStore';
import { useUIStore } from '@/store/uiStore';
import { useHistoryStore } from '@/store/historyStore';
import { SCHEMAS } from '@/components/schema/schemas';
import { executeQuery } from '@/lib/queryEngine';
import { validateQuery } from '@/lib/queryValidator';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { ConditionGroup } from './ConditionGroup';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export function QueryBuilder() {
  const { rootGroup, schemaId, resetQuery } = useQueryStore();
  const { setActivePanel, setExecuting } = useUIStore();
  const { addToHistory } = useHistoryStore();
  const schema = SCHEMAS.find(s => s.id === schemaId)!;
  const errors = validateQuery(rootGroup, schema);

  const handleRun = async () => {
    if (errors.length > 0) {
      toast.error(`Fix ${errors.length} error${errors.length > 1 ? 's' : ''} before running`);
      return;
    }
    setExecuting(true);
    setActivePanel('results');
    await new Promise(r => setTimeout(r, 600));
    const results = executeQuery(schema.mockData, rootGroup, schema);
    addToHistory({ rootGroup, schemaId }, results.length);
    setExecuting(false);
    toast.success(`Found ${results.length} record${results.length !== 1 ? 's' : ''}`);
  };

  useKeyboardShortcuts({
    'mod+r': () => handleRun(),
    'mod+z': () => { resetQuery(); toast('Query reset'); },
    'mod+e': () => {/* handled in header */},
  });

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Builder toolbar */}
      <div style={{
        padding: '12px 20px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        background: 'var(--bg-surface)',
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--text-primary)' }}>
            Query Builder
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {schema.name} · {schema.mockData.length} records · Build your filter conditions below
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={resetQuery}
            style={{
              background: 'none',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              padding: '7px 14px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
            }}
          >
            ↺ Reset
          </button>

          {errors.length > 0 && (
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--rose-accent)',
              background: 'var(--rose-dim)',
              border: '1px solid rgba(255,77,109,0.3)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
            }}>
              ⚠ {errors.length} validation error{errors.length > 1 ? 's' : ''}
            </div>
          )}

          <motion.button
            onClick={handleRun}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: 'var(--amber-pure)',
              color: '#000',
              border: 'none',
              padding: '8px 20px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              boxShadow: 'var(--shadow-glow-amber)',
            }}
          >
            ▶ RUN QUERY
          </motion.button>
        </div>
      </div>

      {/* Builder area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ConditionGroup
            group={rootGroup}
            depth={0}
            isRoot
            schema={schema}
            errors={errors}
          />
        </motion.div>
      </div>
    </div>
  );
}