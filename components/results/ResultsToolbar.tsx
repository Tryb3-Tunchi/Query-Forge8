'use client';

interface Props {
  search: string;
  onSearch: (v: string) => void;
  resultCount: number;
  totalCount: number;
}

export function ResultsToolbar({ search, onSearch, resultCount, totalCount }: Props) {
  const pct = totalCount > 0 ? Math.round((resultCount / totalCount) * 100) : 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {/* Match rate */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <div style={{
          width: '80px',
          height: '4px',
          background: 'var(--bg-elevated)',
          borderRadius: '2px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${pct}%`,
            height: '100%',
            background: pct > 50 ? 'var(--cyan-accent)' : pct > 25 ? 'var(--amber-pure)' : 'var(--rose-accent)',
            borderRadius: '2px',
            transition: 'width 0.3s',
          }} />
        </div>
        <span>{pct}%</span>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={e => onSearch(e.target.value)}
        placeholder="Filter results..."
        className="forge-input"
        style={{ width: '180px' }}
      />
    </div>
  );
}