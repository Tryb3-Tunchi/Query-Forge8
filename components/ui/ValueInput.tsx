'use client';

import { QueryRule, Schema } from '@/types/query';

interface Props {
  rule: QueryRule;
  schema: Schema;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ValueInput({ rule, schema, onChange, placeholder }: Props) {
  const fieldDef = schema.fields.find(f => f.key === rule.field);

  if (!fieldDef) {
    return (
      <input
        value={String(rule.value ?? '')}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || 'value...'}
        className="forge-input"
      />
    );
  }

  if (fieldDef.type === 'enum' && !['in_array', 'not_in_array'].includes(rule.operator)) {
    return (
      <select
        value={String(rule.value ?? '')}
        onChange={e => onChange(e.target.value)}
        className="forge-select"
        style={{ flex: 1 }}
      >
        <option value="">— Select —</option>
        {(fieldDef.enumValues || []).map(v => (
          <option key={v} value={v}>{v}</option>
        ))}
      </select>
    );
  }

  if (fieldDef.type === 'boolean') {
    return (
      <select
        value={String(rule.value ?? '')}
        onChange={e => onChange(e.target.value)}
        className="forge-select"
        style={{ flex: 1 }}
      >
        <option value="">— Select —</option>
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
    );
  }

  if (fieldDef.type === 'date') {
    return (
      <input
        type="date"
        value={String(rule.value ?? '')}
        onChange={e => onChange(e.target.value)}
        className="forge-input"
        style={{ flex: 1, colorScheme: 'dark' }}
      />
    );
  }

  if (fieldDef.type === 'number') {
    return (
      <input
        type="number"
        value={String(rule.value ?? '')}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || '0'}
        className="forge-input"
        style={{ flex: 1 }}
      />
    );
  }

  return (
    <input
      type="text"
      value={String(rule.value ?? '')}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder || 'value...'}
      className="forge-input"
      style={{ flex: 1 }}
    />
  );
}