'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const SECTIONS = [
  {
    title: 'Introduction',
    content: 'QueryForge is a visual query builder that lets you construct complex database filters without writing raw query syntax. It supports unlimited nested AND/OR condition groups, three output formats (SQL, MongoDB, JSON), and executes against mock datasets.',
  },
  {
    title: 'Query Rules',
    content: 'Each rule has three parts: a field (from the active schema), an operator (filtered by field type), and a value input (rendered based on type — date picker, number, dropdown, or text). Rules are the leaf nodes of your query tree.',
  },
  {
    title: 'Condition Groups',
    content: 'Groups contain rules and other groups. Set the group logic to AND (all conditions must match) or OR (any condition must match). Groups can be nested infinitely. Each depth level has a distinct border color for visual clarity.',
  },
  {
    title: 'Schema System',
    content: 'Three schemas are available: Users, Products, and Orders. Switching schemas reloads the field list and adapts all operators and inputs. The schema drives which operators are valid — for example, "contains" is unavailable on number fields.',
  },
  {
    title: 'Query Preview',
    content: 'The Preview panel generates three formats live: SQL (SELECT WHERE syntax), MongoDB (dollar-operator filter objects), and raw JSON (the query tree). All three update in real time as you build.',
  },
  {
    title: 'Execution & Results',
    content: 'Click Run Query (or Ctrl+R) to execute against the mock dataset. Results are displayed in a sortable, searchable, paginated table. The match rate bar shows what percentage of records matched.',
  },
  {
    title: 'Keyboard Shortcuts',
    content: 'Ctrl+R — Run query · Ctrl+E — Export JSON · Ctrl+H — Toggle history · Ctrl+Z — Reset query · Ctrl+T — Toggle dark/light theme',
  },
  {
    title: 'Import & Export',
    content: 'Export saves your query as a JSON file containing the tree structure, schema, SQL, and MongoDB output. Import loads a previously exported file — structure is validated and sanitized before loading.',
  },
];

export default function DocsPage() {
  const router = useRouter();

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-void)', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <nav style={{
        padding: '0 48px', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
      }}>
        <span
          onClick={() => router.push('/')}
          style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--text-primary)', cursor: 'pointer' }}
        >
          ◈ QueryForge
        </span>
        <button
          onClick={() => router.push('/query-builder')}
          style={{
            background: 'var(--amber-pure)', color: '#000',
            border: 'none', padding: '8px 20px',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-mono)', fontSize: '12px',
            fontWeight: 700, cursor: 'pointer',
          }}
        >
          Launch Builder →
        </button>
      </nav>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '10px',
          color: 'var(--amber-pure)', letterSpacing: '0.2em', marginBottom: '12px',
        }}>
          DOCUMENTATION
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: '40px',
          color: 'var(--text-primary)', marginBottom: '48px',
        }}>
          How QueryForge works
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {SECTIONS.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              viewport={{ once: true }}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                borderLeft: '3px solid var(--amber-pure)',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '13px',
                color: 'var(--amber-pure)', marginBottom: '10px', fontWeight: 600,
              }}>
                {section.title}
              </div>
              <div style={{
                fontFamily: 'var(--font-sans)', fontSize: '14px',
                color: 'var(--text-secondary)', lineHeight: 1.7,
              }}>
                {section.content}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}