'use client';

const FORMATS = [
  { id: 'sql', label: 'SQL' },
  { id: 'mongo', label: 'Mongo' },
  { id: 'json', label: 'JSON' },
] as const;

interface Props {
  active: string;
  onChange: (fmt: 'sql' | 'mongo' | 'json') => void;
}

export function PreviewTabs({ active, onChange }: Props) {
  return (
    <div style={{
      display: 'flex',
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-sm)',
      padding: '2px',
      gap: '2px',
    }}>
      {FORMATS.map(fmt => (
        <button
          key={fmt.id}
          onClick={() => onChange(fmt.id)}
          style={{
            background: active === fmt.id ? 'var(--amber-glow)' : 'transparent',
            border: `1px solid ${active === fmt.id ? 'var(--amber-dim)' : 'transparent'}`,
            color: active === fmt.id ? 'var(--amber-pure)' : 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            padding: '4px 10px',
            borderRadius: '3px',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {fmt.label}
        </button>
      ))}
    </div>
  );
}