'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useQueryStore } from '@/store/queryStore';
import { useUIStore } from '@/store/uiStore';
import { SCHEMAS } from '@/components/schema/schemas';
import { generateSQL, generateMongo, generateQueryJSON } from '@/lib/queryParser';
import { PreviewTabs } from './PreviewTabs';
import toast from 'react-hot-toast';

export function QueryPreview() {
  const { rootGroup, schemaId } = useQueryStore();
  const { previewFormat, setPreviewFormat } = useUIStore();
  const schema = SCHEMAS.find(s => s.id === schemaId)!;

  const sql = useMemo(() => generateSQL(rootGroup, schema, schema.name.toLowerCase()), [rootGroup, schema]);
  const mongo = useMemo(() => generateMongo(rootGroup, schema), [rootGroup, schema]);
  const json = useMemo(() => generateQueryJSON(rootGroup), [rootGroup]);

  const content = previewFormat === 'sql' ? sql : previewFormat === 'mongo' ? mongo : json;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  };

  const highlightSQL = (code: string) => {
    return code
      .replace(/\b(SELECT|FROM|WHERE|AND|OR|NOT|IN|BETWEEN|LIKE|IS|NULL|REGEXP|ASC|DESC|ORDER|BY|LIMIT)\b/g, `<span style="color:var(--amber-pure);font-weight:600">$1</span>`)
      .replace(/`([^`]+)`/g, `<span style="color:var(--cyan-accent)">\`$1\`</span>`)
      .replace(/'([^']*)'/g, `<span style="color:#64c864">'$1'</span>`)
      .replace(/\b(\d+\.?\d*)\b/g, `<span style="color:var(--violet-accent)">$1</span>`);
  };

  const highlightJSON = (code: string) => {
    return code
      .replace(/"([^"]+)":/g, `<span style="color:var(--cyan-accent)">"$1"</span>:`)
      .replace(/: "([^"]*)"/g, `: <span style="color:#64c864">"$1"</span>`)
      .replace(/: (\d+\.?\d*)/g, `: <span style="color:var(--violet-accent)">$1</span>`)
      .replace(/: (true|false|null)/g, `: <span style="color:var(--amber-pure)">$1</span>`);
  };

  const highlighted = previewFormat === 'sql' ? highlightSQL(content) : highlightJSON(content);

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
            Query Preview
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Live-generated query · Updates as you build
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <PreviewTabs
            active={previewFormat}
            onChange={setPreviewFormat}
          />
          <button
            onClick={handleCopy}
            style={{
              background: 'var(--amber-trace)',
              border: '1px solid var(--border-medium)',
              color: 'var(--amber-pure)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              padding: '5px 12px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            ⧉ Copy
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
        <motion.div
          key={previewFormat}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Format label */}
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '0.15em',
            color: 'var(--amber-dim)',
            background: 'var(--amber-trace)',
            border: '1px solid var(--border-subtle)',
            padding: '2px 6px',
            borderRadius: '3px',
          }}>
            {previewFormat.toUpperCase()}
          </div>

          {/* Scanline effect */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 4px)',
            pointerEvents: 'none',
          }} />

          <pre
            className="code-preview"
            dangerouslySetInnerHTML={{ __html: highlighted }}
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              margin: 0,
              position: 'relative',
            }}
          />

          {/* Blinking cursor */}
          <span
            className="animate-blink"
            style={{
              display: 'inline-block',
              width: '8px',
              height: '16px',
              background: 'var(--amber-pure)',
              verticalAlign: 'middle',
              marginLeft: '2px',
            }}
          />
        </motion.div>

        {/* Character/line stats */}
        <div style={{
          marginTop: '12px',
          display: 'flex',
          gap: '16px',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--text-muted)',
        }}>
          <span>{content.length} chars</span>
          <span>{content.split('\n').length} lines</span>
          <span style={{ color: 'var(--amber-dim)' }}>
            {previewFormat === 'sql' ? 'SQL-compatible' : previewFormat === 'mongo' ? 'MongoDB compatible' : 'Raw JSON'}
          </span>
        </div>
      </div>
    </div>
  );
}