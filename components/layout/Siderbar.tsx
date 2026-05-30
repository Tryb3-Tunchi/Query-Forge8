'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQueryStore } from '@/store/queryStore';
import { useUIStore } from '@/store/uiStore';
import { SCHEMAS } from '@/components/schema/schemas';

const PANELS = [
  { id: 'builder', label: 'Builder', icon: '⊞' },
  { id: 'preview', label: 'Preview', icon: '◧' },
  { id: 'results', label: 'Results', icon: '▤' },
] as const;

const SHORTCUTS = [
  { keys: ['Ctrl', 'R'], action: 'Run Query' },
  { keys: ['Ctrl', 'E'], action: 'Export' },
  { keys: ['Ctrl', 'I'], action: 'Import' },
  { keys: ['Ctrl', 'H'], action: 'History' },
  { keys: ['Ctrl', 'Z'], action: 'Reset' },
  { keys: ['Ctrl', 'T'], action: 'Theme' },
];

export function Sidebar() {
  const { activePanel, setActivePanel } = useUIStore();
  const { schemaId } = useQueryStore();
  const schema = SCHEMAS.find(s => s.id === schemaId)!;
  const [showFields, setShowFields] = useState(true);

  return (
    <motion.aside
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      style={{
        width: '200px',
        flexShrink: 0,
        borderRight: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Panel nav */}
      <div style={{ padding: '12px 12px 8px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '8px' }}>
          PANELS
        </div>
        {PANELS.map(panel => (
          <button
            key={panel.id}
            onClick={() => setActivePanel(panel.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              padding: '7px 10px',
              marginBottom: '2px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activePanel === panel.id ? 'var(--amber-glow)' : 'transparent',
              color: activePanel === panel.id ? 'var(--amber-pure)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              textAlign: 'left',
              transition: 'all 0.15s',
              borderLeft: activePanel === panel.id ? '2px solid var(--amber-pure)' : '2px solid transparent',
            }}
          >
            <span>{panel.icon}</span>
            <span>{panel.label}</span>
          </button>
        ))}
      </div>

      {/* Schema fields */}
      <div style={{ padding: '12px', borderBottom: '1px solid var(--border-subtle)', flex: 1, overflowY: 'auto' }}>
        <button
          onClick={() => setShowFields(!showFields)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '0.15em',
            marginBottom: '8px',
          }}
        >
          <span>SCHEMA FIELDS</span>
          <span>{showFields ? '▾' : '▸'}</span>
        </button>

        {showFields && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {schema.fields.map(field => (
              <div
                key={field.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '5px 8px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-primary)' }}>
                  {field.label}
                </span>
                <FieldTypeBadge type={field.type} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Shortcuts */}
      <div style={{ padding: '12px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '8px' }}>
          SHORTCUTS
        </div>
        {SHORTCUTS.map(s => (
          <div key={s.action} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>{s.action}</span>
            <div style={{ display: 'flex', gap: '2px' }}>
              {s.keys.map(k => (
                <kbd key={k} style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '3px',
                  padding: '1px 4px',
                  color: 'var(--text-secondary)',
                }}>
                  {k}
                </kbd>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.aside>
  );
}

const TYPE_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  string: { bg: 'rgba(0,229,204,0.1)', color: '#00e5cc', label: 'STR' },
  number: { bg: 'rgba(245,166,35,0.1)', color: '#f5a623', label: 'NUM' },
  boolean: { bg: 'rgba(155,89,245,0.1)', color: '#9b59f5', label: 'BOL' },
  date: { bg: 'rgba(255,77,109,0.1)', color: '#ff4d6d', label: 'DAT' },
  enum: { bg: 'rgba(100,200,100,0.1)', color: '#64c864', label: 'ENM' },
  array: { bg: 'rgba(200,150,50,0.1)', color: '#c89632', label: 'ARR' },
};

function FieldTypeBadge({ type }: { type: string }) {
  const cfg = TYPE_COLORS[type] || { bg: 'var(--bg-hover)', color: 'var(--text-muted)', label: type.toUpperCase().slice(0, 3) };
  return (
    <span style={{
      background: cfg.bg,
      color: cfg.color,
      fontFamily: 'var(--font-mono)',
      fontSize: '8px',
      padding: '1px 4px',
      borderRadius: '2px',
      letterSpacing: '0.05em',
    }}>
      {cfg.label}
    </span>
  );
}