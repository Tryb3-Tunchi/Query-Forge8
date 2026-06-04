'use client';

import { useQueryStore } from '@/store/queryStore';
import { SCHEMAS } from './schemas';

export function SchemaSelector() {
  const { schemaId, setSchema } = useQueryStore();

  return (
    <div id="schema-selector" style={{ display: 'flex', gap: '4px' }}>
      {SCHEMAS.map(schema => (
        <button
          key={schema.id}
          onClick={() => setSchema(schema.id)}
          style={{
            background: schemaId === schema.id ? 'var(--amber-glow)' : 'var(--bg-elevated)',
            border: `1px solid ${schemaId === schema.id ? 'var(--amber-pure)' : 'var(--border-subtle)'}`,
            color: schemaId === schema.id ? 'var(--amber-pure)' : 'var(--text-secondary)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            transition: 'all 0.15s',
          }}
        >
          <span>{schema.icon}</span>
          <span>{schema.name}</span>
        </button>
      ))}
    </div>
  );
}