'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useHistoryStore } from '@/store/historyStore';
import { useQueryStore } from '@/store/queryStore';
import { useUIStore } from '@/store/uiStore';
import toast from 'react-hot-toast';

export function PresetManager() {
  const { presets, savePreset, deletePreset } = useHistoryStore();
  const { rootGroup, schemaId, loadState } = useQueryStore();
  const { setShowPresets } = useUIStore();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const handleSave = () => {
    if (!name.trim()) { toast.error('Name required'); return; }
    savePreset(name, desc, [], { rootGroup, schemaId });
    setName('');
    setDesc('');
    setSaving(false);
    toast.success('Preset saved');
  };

  const handleLoad = (preset: typeof presets[0]) => {
    loadState(preset.state);
    setShowPresets(false);
    toast.success(`Loaded: ${preset.name}`);
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
          Saved Presets
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setSaving(!saving)}
            style={{
              background: 'var(--amber-trace)',
              border: '1px solid var(--border-medium)',
              color: 'var(--amber-pure)',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              padding: '3px 8px',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
          >
            + Save Current
          </button>
          <button
            onClick={() => setShowPresets(false)}
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

      {saving && (
        <div style={{
          padding: '12px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-elevated)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Preset name"
            className="forge-input"
          />
          <input
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Description (optional)"
            className="forge-input"
          />
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={handleSave}
              style={{
                flex: 1,
                background: 'var(--amber-pure)',
                color: '#000',
                border: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 700,
                padding: '6px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
              }}
            >
              Save
            </button>
            <button
              onClick={() => setSaving(false)}
              style={{
                background: 'none',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        {presets.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--text-muted)',
          }}>
            No presets saved. Build a query and save it.
          </div>
        ) : (
          presets.map((preset, i) => (
            <motion.div
              key={preset.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                marginBottom: '6px',
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '4px',
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-primary)' }}>
                  {preset.name}
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => handleLoad(preset)}
                    style={{
                      background: 'var(--amber-trace)',
                      border: '1px solid var(--amber-dim)',
                      color: 'var(--amber-pure)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      cursor: 'pointer',
                    }}
                  >
                    Load
                  </button>
                  <button
                    onClick={() => deletePreset(preset.id)}
                    style={{
                      background: 'none',
                      border: '1px solid rgba(255,77,109,0.3)',
                      color: 'var(--rose-accent)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      cursor: 'pointer',
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
              {preset.description && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
                  {preset.description}
                </div>
              )}
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {preset.state.schemaId}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}