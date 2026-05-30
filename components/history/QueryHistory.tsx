'use client';

import { motion } from 'framer-motion';
import { useHistoryStore } from '@/store/historyStore';
import { useQueryStore } from '@/store/queryStore';
import { useUIStore } from '@/store/uiStore';
import toast from 'react-hot-toast';

export function QueryHistory() {
  const { history, clearHistory } = useHistoryStore();
  const { loadState } = useQueryStore();
  const { setShowHistory } = useUIStore();

  const handleLoad = (entry: typeof history[0]) => {
    loadState(entry.state);
    setShowHistory(false);
    toast.success('Query loaded from history');
  };

  return (
    <div style={{
      height: '100%',
      background: 'var(--bg-surface)',
      borderLeft: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '16px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--text-primary)' }}>
          Query History
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={clearHistory}
            style={{
              background: 'none',
              border: '1px solid rgba(255,77,109,0.3)',
              color: 'var(--rose-accent)',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              padding: '3px 8px',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
          >
            Clear
          </button>
          <button
            onClick={() => setShowHistory(false)}
            style={{
              background: 'none',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              padding: '3px 8px',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        {history.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--text-muted)',
          }}>
            No history yet. Run a query to start.
          </div>
        ) : (
          history.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => handleLoad(entry)}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                marginBottom: '6px',
                cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--text-muted)',
                marginBottom: '4px',
              }}>
                {new Date(entry.timestamp).toLocaleString()}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-secondary)',
                display: 'flex',
                justifyContent: 'space-between',
              }}>
                <span>{entry.state.schemaId} schema</span>
                <span style={{ color: 'var(--amber-pure)' }}>
                  {entry.resultCount ?? '?'} results
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}