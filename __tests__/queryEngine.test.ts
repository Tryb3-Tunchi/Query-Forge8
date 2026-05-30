import { describe, it, expect } from 'vitest';
import { executeQuery } from '@/lib/queryEngine';
import { SCHEMAS } from '@/components/schema/schemas';
import { QueryGroup } from '@/types/query';
import { generateId } from '@/lib/utils';

const schema = SCHEMAS.find(s => s.id === 'users')!;

const makeGroup = (logic: 'AND' | 'OR', children: QueryGroup['children']): QueryGroup => ({
  id: generateId(),
  type: 'group',
  logic,
  collapsed: false,
  children,
});

const makeRule = (field: string, operator: any, value: any): QueryGroup['children'][0] => ({
  id: generateId(),
  type: 'rule',
  field,
  operator,
  value,
});

describe('queryEngine', () => {
  it('returns all records with empty group', () => {
    const group = makeGroup('AND', []);
    const results = executeQuery(schema.mockData, group, schema);
    expect(results.length).toBe(schema.mockData.length);
  });

  it('filters by equals operator', () => {
    const country = 'Nigeria';
    const group = makeGroup('AND', [makeRule('country', 'equals', country)]);
    const results = executeQuery(schema.mockData, group, schema);
    expect(results.every(r => (r.country as string).toLowerCase() === country.toLowerCase())).toBe(true);
  });

  it('filters by greater_than operator', () => {
    const group = makeGroup('AND', [makeRule('age', 'greater_than', 30)]);
    const results = executeQuery(schema.mockData, group, schema);
    expect(results.every(r => Number(r.age) > 30)).toBe(true);
  });

  it('combines AND conditions', () => {
    const group = makeGroup('AND', [
      makeRule('age', 'greater_than', 20),
      makeRule('verified', 'equals', 'true'),
    ]);
    const results = executeQuery(schema.mockData, group, schema);
    expect(results.every(r => Number(r.age) > 20)).toBe(true);
  });

  it('combines OR conditions', () => {
    const group = makeGroup('OR', [
      makeRule('country', 'equals', 'Nigeria'),
      makeRule('country', 'equals', 'Ghana'),
    ]);
    const results = executeQuery(schema.mockData, group, schema);
    const valid = results.every(r => ['nigeria', 'ghana'].includes(String(r.country).toLowerCase()));
    expect(valid).toBe(true);
  });

  it('handles nested groups', () => {
    const inner = makeGroup('OR', [
      makeRule('status', 'equals', 'active'),
      makeRule('status', 'equals', 'pending'),
    ]);
    const outer = makeGroup('AND', [
      makeRule('age', 'greater_than', 18),
      inner,
    ]);
    const results = executeQuery(schema.mockData, outer, schema);
    expect(results.every(r => Number(r.age) > 18)).toBe(true);
    expect(results.every(r => ['active', 'pending'].includes(String(r.status).toLowerCase()))).toBe(true);
  });

  it('handles is_null operator', () => {
    const group = makeGroup('AND', [makeRule('tags', 'is_not_null', null)]);
    const results = executeQuery(schema.mockData, group, schema);
    expect(results.length).toBeGreaterThan(0);
  });

  it('handles between operator', () => {
    const rule = { ...makeRule('age', 'between', 20), value2: 40 } as any;
    const group = makeGroup('AND', [rule]);
    const results = executeQuery(schema.mockData, group, schema);
    expect(results.every(r => Number(r.age) >= 20 && Number(r.age) <= 40)).toBe(true);
  });

  it('handles contains operator on strings', () => {
    const group = makeGroup('AND', [makeRule('email', 'contains', 'user')]);
    const results = executeQuery(schema.mockData, group, schema);
    expect(results.every(r => String(r.email).toLowerCase().includes('user'))).toBe(true);
  });
});