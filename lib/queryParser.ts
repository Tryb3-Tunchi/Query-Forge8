import { QueryGroup, QueryRule, QueryNode, Schema } from '@/types/query';

export type QueryFormat = 'sql' | 'mongo' | 'json';

export function generateSQL(group: QueryGroup, schema: Schema, tableName: string = 'records'): string {
  const where = groupToSQL(group, schema, 0);
  if (!where || where === '()') return `SELECT * FROM ${tableName}`;
  return `SELECT *\nFROM ${tableName}\nWHERE ${where}`;
}

function groupToSQL(group: QueryGroup, schema: Schema, depth: number): string {
  if (group.children.length === 0) return '';

  const parts: string[] = [];
  
  for (const child of group.children) {
    if (child.type === 'rule') {
      const sql = ruleToSQL(child as QueryRule, schema);
      if (sql) parts.push(sql);
    } else {
      const nested = groupToSQL(child as QueryGroup, schema, depth + 1);
      if (nested) parts.push(depth > 0 ? `(\n  ${nested}\n)` : `(${nested})`);
    }
  }

  if (parts.length === 0) return '';
  const indent = '  '.repeat(depth);
  return parts.join(`\n${indent}${group.logic} `);
}

function ruleToSQL(rule: QueryRule, schema: Schema): string {
  if (!rule.field || !rule.operator) return '';
  
  const field = `\`${rule.field}\``;
  const val = formatSQLValue(rule.value, rule.field, schema);
  
  switch (rule.operator) {
    case 'equals': return `${field} = ${val}`;
    case 'not_equals': return `${field} != ${val}`;
    case 'contains': return `${field} LIKE '%${rule.value}%'`;
    case 'not_contains': return `${field} NOT LIKE '%${rule.value}%'`;
    case 'starts_with': return `${field} LIKE '${rule.value}%'`;
    case 'ends_with': return `${field} LIKE '%${rule.value}'`;
    case 'greater_than': return `${field} > ${val}`;
    case 'less_than': return `${field} < ${val}`;
    case 'greater_equal': return `${field} >= ${val}`;
    case 'less_equal': return `${field} <= ${val}`;
    case 'between': return `${field} BETWEEN ${val} AND ${formatSQLValue(rule.value2, rule.field, schema)}`;
    case 'in_array': return `${field} IN (${String(rule.value).split(',').map(v => `'${v.trim()}'`).join(', ')})`;
    case 'not_in_array': return `${field} NOT IN (${String(rule.value).split(',').map(v => `'${v.trim()}'`).join(', ')})`;
    case 'is_null': return `${field} IS NULL`;
    case 'is_not_null': return `${field} IS NOT NULL`;
    case 'regex': return `${field} REGEXP '${rule.value}'`;
    case 'date_before': return `${field} < '${rule.value}'`;
    case 'date_after': return `${field} > '${rule.value}'`;
    case 'date_between': return `${field} BETWEEN '${rule.value}' AND '${rule.value2}'`;
    default: return '';
  }
}

function formatSQLValue(value: unknown, field: string, schema: Schema): string {
  const fieldDef = schema.fields.find(f => f.key === field);
  if (!fieldDef) return `'${value}'`;
  if (fieldDef.type === 'number') return String(Number(value));
  if (fieldDef.type === 'boolean') return value ? 'TRUE' : 'FALSE';
  return `'${value}'`;
}

export function generateMongo(group: QueryGroup, schema: Schema): string {
  const query = groupToMongo(group, schema);
  return JSON.stringify(query, null, 2);
}

function groupToMongo(group: QueryGroup, schema: Schema): Record<string, unknown> {
  if (group.children.length === 0) return {};

  const parts: Record<string, unknown>[] = [];
  
  for (const child of group.children) {
    if (child.type === 'rule') {
      const mongo = ruleToMongo(child as QueryRule, schema);
      if (mongo) parts.push(mongo);
    } else {
      const nested = groupToMongo(child as QueryGroup, schema);
      if (Object.keys(nested).length > 0) parts.push(nested);
    }
  }

  if (parts.length === 0) return {};
  if (parts.length === 1) return parts[0];

  return { [`$${group.logic.toLowerCase()}`]: parts };
}

function ruleToMongo(rule: QueryRule, schema: Schema): Record<string, unknown> | null {
  if (!rule.field || !rule.operator) return null;
  
  const fieldDef = schema.fields.find(f => f.key === rule.field);
  const val = fieldDef?.type === 'number' ? Number(rule.value) : rule.value;

  switch (rule.operator) {
    case 'equals': return { [rule.field]: val };
    case 'not_equals': return { [rule.field]: { $ne: val } };
    case 'contains': return { [rule.field]: { $regex: rule.value, $options: 'i' } };
    case 'not_contains': return { [rule.field]: { $not: { $regex: rule.value, $options: 'i' } } };
    case 'starts_with': return { [rule.field]: { $regex: `^${rule.value}`, $options: 'i' } };
    case 'ends_with': return { [rule.field]: { $regex: `${rule.value}$`, $options: 'i' } };
    case 'greater_than': return { [rule.field]: { $gt: val } };
    case 'less_than': return { [rule.field]: { $lt: val } };
    case 'greater_equal': return { [rule.field]: { $gte: val } };
    case 'less_equal': return { [rule.field]: { $lte: val } };
    case 'between': return { [rule.field]: { $gte: Number(rule.value), $lte: Number(rule.value2) } };
    case 'in_array': return { [rule.field]: { $in: String(rule.value).split(',').map(v => v.trim()) } };
    case 'not_in_array': return { [rule.field]: { $nin: String(rule.value).split(',').map(v => v.trim()) } };
    case 'is_null': return { [rule.field]: null };
    case 'is_not_null': return { [rule.field]: { $ne: null } };
    case 'regex': return { [rule.field]: { $regex: rule.value, $options: 'i' } };
    case 'date_before': return { [rule.field]: { $lt: rule.value } };
    case 'date_after': return { [rule.field]: { $gt: rule.value } };
    case 'date_between': return { [rule.field]: { $gte: rule.value, $lte: rule.value2 } };
    default: return null;
  }
}

export function generateQueryJSON(group: QueryGroup): string {
  return JSON.stringify(sanitizeGroup(group), null, 2);
}

function sanitizeGroup(group: QueryGroup): object {
  return {
    id: group.id,
    type: 'group',
    logic: group.logic,
    children: group.children.map(child =>
      child.type === 'group' ? sanitizeGroup(child as QueryGroup) : child
    ),
  };
}