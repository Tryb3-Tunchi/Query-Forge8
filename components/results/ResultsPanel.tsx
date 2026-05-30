'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryStore } from '@/store/queryStore';
import { useUIStore } from '@/store/uiStore';
import { SCHEMAS } from '@/components/schema/schemas';
import { executeQuery } from '@/lib/queryEngine';
import { validateQuery } from '@/lib/queryValidator';
import { ResultsToolbar } from './ResultsToolbar';

const PAGE_SIZE = 10;

export function ResultsPanel() {
  const { rootGroup, schemaId } = useQueryStore();
  const { isExecuting } = useUIStore();
  const schema = SCHEMAS.find(s => s.id === schemaId)!;
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');

  const errors = validateQuery(rootGroup, schema);

  const results = useMemo(() => {
    if (errors.length > 0) return [];
    return executeQuery(schema.mockData, rootGroup, schema);
  }, [rootGroup, schema, errors.length]);

  const filteredResults = useMemo(() => {
    let r = [...results];
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(row =>
        Object.values(row).some(v => String(v).toLowerCase().includes(q))
      );
    }
    if (sortField) {
      r.sort((a, b) => {
        const av = a[sortField];
        const bv = b[sortField];
        const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return r;
  }, [results, search, sortField, sortDir]);

  const totalPages = Math.ceil(filteredResults.length / PAGE_SIZE);
  const pageData = filteredResults.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const visibleFields = schema.fields.slice(0, 6);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
    setPage(1);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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
            Query Results
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {errors.length > 0
              ? `⚠ Fix ${errors.length} errors to run query`
              : `${filteredResults.length} of ${schema.mockData.length} records matched`}
          </div>
        </div>

        <ResultsToolbar
          search={search}
          onSearch={(s) => { setSearch(s); setPage(1); }}
          resultCount={filteredResults.length}
          totalCount={schema.mockData.length}
        />
      </div>

      {isExecuting ? (
        <ExecutingState />
      ) : errors.length > 0 ? (
        <ErrorState errors={errors.map(e => e.message)} />
      ) : filteredResults.length === 0 ? (
        <EmptyState />
      ) : (
        <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px' }}>
          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}>
            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${visibleFields.length}, 1fr)`,
              borderBottom: '2px solid var(--border-medium)',
              background: 'var(--bg-surface)',
            }}>
              {visibleFields.map(field => (
                <button
                  key={field.key}
                  onClick={() => handleSort(field.key)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '10px 12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.1em',
                    color: sortField === field.key ? 'var(--amber-pure)' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    borderRight: '1px solid var(--border-subtle)',
                  }}
                >
                  {field.label}
                  {sortField === field.key && (
                    <span>{sortDir === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Table body */}
            <AnimatePresence>
              {pageData.map((row, i) => (
                <motion.div
                  key={String(row.id || i)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="result-row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${visibleFields.length}, 1fr)`,
                  }}
                >
                  {visibleFields.map(field => (
                    <div
                      key={field.key}
                      style={{
                        padding: '9px 12px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        color: 'var(--text-secondary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        borderRight: '1px solid var(--border-subtle)',
                      }}
                    >
                      <CellValue value={row[field.key]} type={field.type} />
                    </div>
                  ))}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
            }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: page === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                }}
              >
                ← Prev
              </button>

              <span style={{ color: 'var(--text-secondary)' }}>
                Page <span style={{ color: 'var(--amber-pure)' }}>{page}</span> of {totalPages}
              </span>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: page === totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: page === totalPages ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                }}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CellValue({ value, type }: { value: unknown; type: string }) {
  if (value === null || value === undefined) {
    return <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>null</span>;
  }
  if (type === 'boolean') {
    return (
      <span style={{ color: value ? 'var(--cyan-accent)' : 'var(--rose-accent)' }}>
        {value ? '✓ true' : '✗ false'}
      </span>
    );
  }
  if (type === 'date') {
    return <span>{new Date(value as string).toLocaleDateString()}</span>;
  }
  if (type === 'array') {
    const arr = Array.isArray(value) ? value : [];
    return (
      <span style={{ color: 'var(--text-muted)' }}>
        [{arr.join(', ')}]
      </span>
    );
  }
  return <span>{String(value)}</span>;
}

function ExecutingState() {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{ width: '40px', height: '40px', border: '2px solid var(--border-subtle)', borderTopColor: 'var(--amber-pure)', borderRadius: '50%' }}
      />
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
        Executing query...
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
      <div style={{ fontSize: '40px', opacity: 0.3 }}>◈</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--text-secondary)' }}>No Results</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
        No records matched your query conditions
      </div>
    </div>
  );
}

function ErrorState({ errors }: { errors: string[] }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', padding: '40px' }}>
      <div style={{ fontSize: '32px' }}>⚠</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--rose-accent)' }}>Validation Errors</div>
      {errors.slice(0, 5).map((e, i) => (
        <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
          {e}
        </div>
      ))}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
        Fix errors in the Query Builder and try again
      </div>
    </div>
  );
}