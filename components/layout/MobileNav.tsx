'use client';

import { useUIStore } from '@/store/uiStore';

export function MobileNav() {
  const { activePanel, setActivePanel } = useUIStore();

  const tabs = [
    { id: 'builder', label: 'Builder', icon: '⊞' },
    { id: 'preview', label: 'Preview', icon: '◧' },
    { id: 'results', label: 'Results', icon: '▤' },
  ] as const;

  return (
    <nav
      className="mobile-nav"
      style={{
        display: 'none', // shown via CSS media query
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        zIndex: 100,
        padding: '8px 0',
      }}
    >
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActivePanel(tab.id)}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            background: 'none',
            border: 'none',
            color: activePanel === tab.id ? 'var(--amber-pure)' : 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            cursor: 'pointer',
            padding: '4px 0',
          }}
        >
          <span style={{ fontSize: '18px' }}>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}