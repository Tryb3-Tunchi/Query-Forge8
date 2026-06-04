'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  return (
    <main style={{
      minHeight: '100vh',
      background: 'var(--bg-void)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Nav */}
      <nav style={{
        padding: '0 48px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{
              width: '28px', height: '28px',
              border: '2px solid var(--amber-pure)',
              borderRadius: '6px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--amber-pure)', fontSize: '14px',
              boxShadow: 'var(--shadow-glow-amber)',
            }}
          >◈</motion.div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--text-primary)' }}>
            QueryForge
          </span>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          {['Features', 'How It Works', 'Docs'].map(item => (
            <span key={item} style={{
              fontFamily: 'var(--font-mono)', fontSize: '12px',
              color: 'var(--text-secondary)', cursor: 'pointer',
              letterSpacing: '0.05em',
            }}>
              {item}
            </span>
          ))}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/query-builder')}
            style={{
              background: 'var(--amber-pure)',
              color: '#000',
              border: 'none',
              padding: '8px 20px',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-glow-amber)',
            }}
          >
            Launch Builder →
          </motion.button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 48px',
        textAlign: 'center',
        position: 'relative',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute',
          top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(245,166,35,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px',
            color: 'var(--amber-pure)', letterSpacing: '0.2em',
            marginBottom: '20px',
            border: '1px solid var(--border-medium)',
            display: 'inline-block',
            padding: '4px 14px',
            borderRadius: '20px',
            background: 'var(--amber-trace)',
          }}>
            VISUAL QUERY ENGINE · v1.0
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(40px, 6vw, 80px)',
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            marginBottom: '24px',
            maxWidth: '800px',
          }}>
            Build complex queries.<br />
            <span style={{ color: 'var(--amber-pure)' }}>Without writing a line.</span>
          </h1>

          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '18px',
            color: 'var(--text-secondary)', maxWidth: '540px',
            lineHeight: 1.7, marginBottom: '40px',
          }}>
            QueryForge gives you a visual workspace to build recursive AND/OR filter logic,
            preview SQL and MongoDB output live, and execute against mock datasets.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/query-builder')}
              style={{
                background: 'var(--amber-pure)',
                color: '#000',
                border: 'none',
                padding: '14px 32px',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px', fontWeight: 700,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-glow-amber)',
              }}
            >
              ▶ Launch Builder
            </motion.button>
            <button
              onClick={() => router.push('/docs')}
              style={{
                background: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-medium)',
                padding: '14px 32px',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Read Docs →
            </button>
          </div>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{ display: 'flex', gap: '10px', marginTop: '48px', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          {[
            '⊞ Unlimited Nesting',
            '◧ Live SQL + Mongo Preview',
            '▤ Mock Execution',
            '⣿ Drag & Drop',
            '★ Saved Presets',
            '⟳ Query History',
          ].map(feat => (
            <div key={feat} style={{
              fontFamily: 'var(--font-mono)', fontSize: '11px',
              color: 'var(--text-secondary)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              padding: '6px 14px',
              borderRadius: '20px',
            }}>
              {feat}
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features grid */}
      <section id="features" style={{
        padding: '80px 48px',
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px',
              color: 'var(--text-muted)', letterSpacing: '0.2em', marginBottom: '12px',
            }}>
              FEATURES
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: '36px',
              color: 'var(--text-primary)',
            }}>
              Everything you need to query visually
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}>
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '12px' }}>{f.icon}</div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '13px',
                  color: 'var(--amber-pure)', marginBottom: '8px', fontWeight: 600,
                }}>
                  {f.title}
                </div>
                <div style={{
                  fontFamily: 'var(--font-sans)', fontSize: '13px',
                  color: 'var(--text-secondary)', lineHeight: 1.6,
                }}>
                  {f.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ padding: '80px 48px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '10px',
            color: 'var(--text-muted)', letterSpacing: '0.2em', marginBottom: '12px',
          }}>
            HOW IT WORKS
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '36px',
            color: 'var(--text-primary)', marginBottom: '48px',
          }}>
            From schema to results in four steps
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '20px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px 24px',
                  textAlign: 'left',
                }}
              >
                <div style={{
                  width: '36px', height: '36px', flexShrink: 0,
                  borderRadius: '50%',
                  background: 'var(--amber-glow)',
                  border: '1px solid var(--amber-dim)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: '13px',
                  color: 'var(--amber-pure)', fontWeight: 700,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '13px',
                    color: 'var(--text-primary)', marginBottom: '4px', fontWeight: 600,
                  }}>
                    {step.title}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-sans)', fontSize: '13px',
                    color: 'var(--text-secondary)', lineHeight: 1.6,
                  }}>
                    {step.desc}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 48px',
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: '40px',
          color: 'var(--text-primary)', marginBottom: '16px',
        }}>
          Ready to build your first query?
        </h2>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: '16px',
          color: 'var(--text-secondary)', marginBottom: '32px',
        }}>
          No setup required. Pick a schema and start building.
        </p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push('/query-builder')}
          style={{
            background: 'var(--amber-pure)', color: '#000',
            border: 'none', padding: '16px 40px',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-mono)', fontSize: '14px',
            fontWeight: 700, cursor: 'pointer',
            boxShadow: 'var(--shadow-glow-amber)',
          }}
        >
          ▶ Open QueryForge
        </motion.button>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '24px 48px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '11px',
          color: 'var(--text-muted)',
        }}>
          © 2026 QueryForge · Terminal Noir Edition
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '11px',
          color: 'var(--text-muted)',
        }}>
          SQL · MongoDB · JSON · Recursive Logic
        </span>
      </footer>
    </main>
  );
}

const FEATURES = [
  { icon: '⊞', title: 'Recursive Nesting', desc: 'Build unlimited nested AND/OR condition groups. Each level is depth-coded with a unique color so you never lose track of your logic.' },
  { icon: '◧', title: 'Live Query Preview', desc: 'Every rule change instantly generates SQL, MongoDB, and JSON output. Three formats, always in sync with your builder.' },
  { icon: '◈', title: 'Schema-Driven UI', desc: 'Operators, inputs, and validations adapt to your field types. Numbers get number inputs, enums get dropdowns, dates get date pickers.' },
  { icon: '▤', title: 'Query Executor', desc: 'Run queries against mock datasets. Inspect results with sorting, pagination, and inline search.' },
  { icon: '⚡', title: 'Validation Engine', desc: 'Incompatible operators are blocked at the UI level. Invalid values surface as inline errors before you even run the query.' },
  { icon: '★', title: 'History & Presets', desc: 'Every query run is saved to history. Save complex queries as named presets. Export and import via JSON.' },
];

const STEPS = [
  { title: 'Choose a schema', desc: 'Select Users, Products, or Orders. The builder adapts — loading the correct fields, types, and operators for that data source.' },
  { title: 'Build your conditions', desc: 'Add rules, nest groups, drag to reorder. Combine AND/OR logic at any depth. Collapse groups to manage complexity.' },
  { title: 'Review the query output', desc: 'Switch between SQL, MongoDB, and JSON previews. Copy to clipboard or export as a file.' },
  { title: 'Execute and inspect', desc: 'Run against mock data. Sort, filter, and paginate your results. Save the query to presets for reuse.' },
];